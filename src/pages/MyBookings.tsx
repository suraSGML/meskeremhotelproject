import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Calendar, MapPin, Users, Clock, Loader2, Hotel, PartyPopper } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

interface RoomBooking {
  id: string;
  room_id: string;
  check_in: string;
  check_out: string;
  num_guests: number;
  total_price: number;
  status: string;
  special_requests: string | null;
  created_at: string;
  rooms: { name: string; featured_image: string | null } | null;
}

interface EventBooking {
  id: string;
  event_space_id: string;
  event_type: string;
  event_date: string;
  start_time: string | null;
  end_time: string | null;
  expected_guests: number | null;
  total_price: number | null;
  status: string;
  special_requirements: string | null;
  created_at: string;
  event_spaces: { name: string; featured_image: string | null } | null;
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  confirmed: "bg-green-500/20 text-green-400 border-green-500/30",
  cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
  completed: "bg-blue-500/20 text-blue-400 border-blue-500/30",
};

const MyBookings = () => {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [roomBookings, setRoomBookings] = useState<RoomBooking[]>([]);
  const [eventBookings, setEventBookings] = useState<EventBooking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user]);

  const fetchBookings = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Fetch room bookings by email
      const { data: roomData, error: roomError } = await supabase
        .from("room_bookings")
        .select("*, rooms(name, featured_image)")
        .eq("guest_email", user.email)
        .order("created_at", { ascending: false });

      if (roomError) throw roomError;
      setRoomBookings(roomData || []);

      // Fetch event bookings by email
      const { data: eventData, error: eventError } = await supabase
        .from("event_bookings")
        .select("*, event_spaces(name, featured_image)")
        .eq("client_email", user.email)
        .order("created_at", { ascending: false });

      if (eventError) throw eventError;
      setEventBookings(eventData || []);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gold" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          <div className="mb-8">
            <h1 className="font-display text-4xl text-foreground mb-2">My Bookings</h1>
            <p className="text-muted-foreground">View and manage your reservations</p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-gold" />
            </div>
          ) : (
            <Tabs defaultValue="rooms" className="w-full">
              <TabsList className="mb-6 bg-muted/50">
                <TabsTrigger value="rooms" className="gap-2">
                  <Hotel className="w-4 h-4" />
                  Room Bookings ({roomBookings.length})
                </TabsTrigger>
                <TabsTrigger value="events" className="gap-2">
                  <PartyPopper className="w-4 h-4" />
                  Event Bookings ({eventBookings.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="rooms">
                {roomBookings.length === 0 ? (
                  <Card className="bg-card border-border">
                    <CardContent className="py-16 text-center">
                      <Hotel className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-xl font-display text-foreground mb-2">No Room Bookings</h3>
                      <p className="text-muted-foreground mb-6">You haven't made any room reservations yet.</p>
                      <Button variant="gold" onClick={() => navigate("/accommodations")}>
                        Browse Rooms
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-4">
                    {roomBookings.map((booking) => (
                      <Card key={booking.id} className="bg-card border-border hover:border-gold/30 transition-colors">
                        <CardContent className="p-6">
                          <div className="flex flex-col md:flex-row gap-6">
                            {booking.rooms?.featured_image && (
                              <div className="w-full md:w-48 h-32 rounded-lg overflow-hidden flex-shrink-0">
                                <img 
                                  src={booking.rooms.featured_image} 
                                  alt={booking.rooms.name || "Room"} 
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                            <div className="flex-1 space-y-3">
                              <div className="flex items-start justify-between gap-4">
                                <div>
                                  <h3 className="font-display text-xl text-foreground">
                                    {booking.rooms?.name || "Room"}
                                  </h3>
                                  <p className="text-sm text-muted-foreground">
                                    Booked on {format(new Date(booking.created_at), "MMM d, yyyy")}
                                  </p>
                                </div>
                                <Badge className={statusColors[booking.status] || statusColors.pending}>
                                  {booking.status}
                                </Badge>
                              </div>
                              
                              <div className="flex flex-wrap gap-4 text-sm">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  <Calendar className="w-4 h-4 text-gold" />
                                  <span>{format(new Date(booking.check_in), "MMM d")} - {format(new Date(booking.check_out), "MMM d, yyyy")}</span>
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  <Users className="w-4 h-4 text-gold" />
                                  <span>{booking.num_guests} guests</span>
                                </div>
                              </div>

                              {booking.special_requests && (
                                <p className="text-sm text-muted-foreground italic">
                                  "{booking.special_requests}"
                                </p>
                              )}

                              <div className="pt-2 border-t border-border">
                                <span className="text-gold font-semibold text-lg">
                                  ${booking.total_price?.toFixed(2)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="events">
                {eventBookings.length === 0 ? (
                  <Card className="bg-card border-border">
                    <CardContent className="py-16 text-center">
                      <PartyPopper className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-xl font-display text-foreground mb-2">No Event Bookings</h3>
                      <p className="text-muted-foreground mb-6">You haven't booked any event spaces yet.</p>
                      <Button variant="gold" onClick={() => navigate("/events")}>
                        Browse Event Spaces
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-4">
                    {eventBookings.map((booking) => (
                      <Card key={booking.id} className="bg-card border-border hover:border-gold/30 transition-colors">
                        <CardContent className="p-6">
                          <div className="flex flex-col md:flex-row gap-6">
                            {booking.event_spaces?.featured_image && (
                              <div className="w-full md:w-48 h-32 rounded-lg overflow-hidden flex-shrink-0">
                                <img 
                                  src={booking.event_spaces.featured_image} 
                                  alt={booking.event_spaces.name || "Event Space"} 
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                            <div className="flex-1 space-y-3">
                              <div className="flex items-start justify-between gap-4">
                                <div>
                                  <h3 className="font-display text-xl text-foreground">
                                    {booking.event_spaces?.name || "Event Space"}
                                  </h3>
                                  <p className="text-sm text-gold">{booking.event_type}</p>
                                </div>
                                <Badge className={statusColors[booking.status] || statusColors.pending}>
                                  {booking.status}
                                </Badge>
                              </div>
                              
                              <div className="flex flex-wrap gap-4 text-sm">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  <Calendar className="w-4 h-4 text-gold" />
                                  <span>{format(new Date(booking.event_date), "MMM d, yyyy")}</span>
                                </div>
                                {booking.start_time && booking.end_time && (
                                  <div className="flex items-center gap-2 text-muted-foreground">
                                    <Clock className="w-4 h-4 text-gold" />
                                    <span>{booking.start_time} - {booking.end_time}</span>
                                  </div>
                                )}
                                {booking.expected_guests && (
                                  <div className="flex items-center gap-2 text-muted-foreground">
                                    <Users className="w-4 h-4 text-gold" />
                                    <span>{booking.expected_guests} guests</span>
                                  </div>
                                )}
                              </div>

                              {booking.special_requirements && (
                                <p className="text-sm text-muted-foreground italic">
                                  "{booking.special_requirements}"
                                </p>
                              )}

                              {booking.total_price && (
                                <div className="pt-2 border-t border-border">
                                  <span className="text-gold font-semibold text-lg">
                                    ${booking.total_price.toFixed(2)}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MyBookings;
