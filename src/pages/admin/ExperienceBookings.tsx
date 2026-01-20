import { useState, useEffect } from "react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Compass, Loader2, Calendar, Users } from "lucide-react";

interface ExperienceBooking {
  id: string;
  guest_name: string;
  guest_email: string;
  guest_phone: string | null;
  booking_date: string;
  booking_time: string;
  num_participants: number;
  special_requests: string | null;
  status: string;
  payment_status: string | null;
  payment_method: string | null;
  total_amount: number | null;
  created_at: string;
  experience: {
    name: string;
    category: string | null;
  } | null;
}

const AdminExperienceBookings = () => {
  const [bookings, setBookings] = useState<ExperienceBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase
        .from("experience_bookings")
        .select(`
          *,
          experience:experiences(name, category)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast.error("Failed to load experience bookings");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const updateBookingStatus = async (bookingId: string, status: string) => {
    try {
      const { error } = await supabase
        .from("experience_bookings")
        .update({ status })
        .eq("id", bookingId);

      if (error) throw error;
      toast.success("Booking status updated");
      fetchBookings();
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-500",
      confirmed: "bg-green-500",
      cancelled: "bg-red-500",
      completed: "bg-blue-500",
    };
    return colors[status] || "bg-gray-500";
  };

  const getPaymentStatusColor = (status: string | null) => {
    if (!status) return "bg-gray-500";
    const colors: Record<string, string> = {
      unpaid: "bg-red-500",
      pending: "bg-yellow-500",
      paid: "bg-green-500",
    };
    return colors[status] || "bg-gray-500";
  };

  const formatCurrency = (amount: number | null) => {
    if (!amount) return "-";
    return new Intl.NumberFormat("en-ET", {
      style: "currency",
      currency: "ETB",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">
          Experience Bookings
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage experience and tour bookings
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-lg p-4 border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Calendar className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Bookings</p>
              <p className="text-2xl font-bold">{bookings.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-lg p-4 border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-500/10 rounded-lg">
              <Compass className="w-5 h-5 text-yellow-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-2xl font-bold">
                {bookings.filter((b) => b.status === "pending").length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-lg p-4 border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <Users className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Confirmed</p>
              <p className="text-2xl font-bold">
                {bookings.filter((b) => b.status === "confirmed").length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-lg p-4 border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Users className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Participants</p>
              <p className="text-2xl font-bold">
                {bookings.reduce((sum, b) => sum + b.num_participants, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {bookings.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-lg border">
          <Compass className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
          <p className="text-muted-foreground">No experience bookings yet</p>
        </div>
      ) : (
        <div className="bg-card rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Experience</TableHead>
                <TableHead>Guest</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Participants</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">
                        {booking.experience?.name || "Unknown"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {booking.experience?.category}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{booking.guest_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {booking.guest_email}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p>{format(new Date(booking.booking_date), "MMM d, yyyy")}</p>
                      <p className="text-sm text-muted-foreground">
                        {booking.booking_time}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      {booking.num_participants}
                    </div>
                  </TableCell>
                  <TableCell>{formatCurrency(booking.total_amount)}</TableCell>
                  <TableCell>
                    <Badge className={getPaymentStatusColor(booking.payment_status)}>
                      {booking.payment_status || "unpaid"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(booking.status)}>
                      {booking.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={booking.status}
                      onValueChange={(value) => updateBookingStatus(booking.id, value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default AdminExperienceBookings;
