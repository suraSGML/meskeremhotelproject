import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import type { Tables } from '@/integrations/supabase/types';

type EventBooking = Tables<'event_bookings'>;

const AdminEventBookings = () => {
  const [bookings, setBookings] = useState<EventBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { toast } = useToast();

  const fetchBookings = async () => {
    let query = supabase
      .from('event_bookings')
      .select('*')
      .order('created_at', { ascending: false });

    if (statusFilter !== 'all') {
      query = query.eq('status', statusFilter);
    }

    const { data, error } = await query;

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return;
    }

    setBookings(data ?? []);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchBookings();
  }, [statusFilter]);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from('event_bookings')
      .update({ status })
      .eq('id', id);

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return;
    }

    toast({ title: 'Success', description: 'Booking status updated' });
    fetchBookings();
  };

  const getStatusBadge = (status: string | null) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      pending: 'secondary',
      confirmed: 'default',
      cancelled: 'destructive',
      completed: 'outline',
    };
    return <Badge variant={variants[status ?? 'pending']}>{status ?? 'pending'}</Badge>;
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl text-foreground">Event Bookings</h1>
          <p className="text-muted-foreground">Manage event reservations</p>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-card rounded-lg border border-border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead>Event Type</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Guests</TableHead>
              <TableHead>Catering</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8">Loading...</TableCell>
              </TableRow>
            ) : bookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                  No event bookings found.
                </TableCell>
              </TableRow>
            ) : (
              bookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{booking.client_name}</p>
                      <p className="text-xs text-muted-foreground">{booking.client_email}</p>
                    </div>
                  </TableCell>
                  <TableCell>{booking.event_type}</TableCell>
                  <TableCell>{format(new Date(booking.event_date), 'MMM d, yyyy')}</TableCell>
                  <TableCell>
                    {booking.start_time && booking.end_time 
                      ? `${booking.start_time} - ${booking.end_time}`
                      : '-'}
                  </TableCell>
                  <TableCell>{booking.expected_guests ?? '-'}</TableCell>
                  <TableCell>{booking.catering_required ? 'Yes' : 'No'}</TableCell>
                  <TableCell>${booking.total_price ?? '-'}</TableCell>
                  <TableCell>{getStatusBadge(booking.status)}</TableCell>
                  <TableCell>
                    <Select
                      value={booking.status ?? 'pending'}
                      onValueChange={(value) => updateStatus(booking.id, value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="confirmed">Confirm</SelectItem>
                        <SelectItem value="cancelled">Cancel</SelectItem>
                        <SelectItem value="completed">Complete</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminEventBookings;
