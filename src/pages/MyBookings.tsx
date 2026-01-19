import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Calendar, MapPin, Users, Clock, Loader2, Hotel, PartyPopper, Utensils, Sparkles, Plane, ShoppingCart } from "lucide-react";
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

interface TableBooking {
  id: string;
  booking_date: string;
  booking_time: string;
  party_size: number;
  status: string;
  total_amount: number | null;
  special_requests: string | null;
  created_at: string;
}

interface SpaBooking {
  id: string;
  booking_date: string;
  booking_time: string;
  status: string;
  total_amount: number | null;
  special_requests: string | null;
  created_at: string;
  spa_services: { name: string; duration_minutes: number } | null;
}

interface RoomServiceOrder {
  id: string;
  room_number: string;
  items: any;
  status: string;
  total_amount: number | null;
  special_instructions: string | null;
  created_at: string;
}

interface AirportTransfer {
  id: string;
  transfer_type: string;
  pickup_datetime: string;
  pickup_location: string;
  dropoff_location: string;
  passengers: number;
  vehicle_type: string;
  status: string;
  total_amount: number | null;
  created_at: string;
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  confirmed: "bg-green-500/20 text-green-400 border-green-500/30",
  cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
  completed: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  preparing: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  delivered: "bg-green-500/20 text-green-400 border-green-500/30",
};

const MyBookings = () => {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [roomBookings, setRoomBookings] = useState<RoomBooking[]>([]);
  const [eventBookings, setEventBookings] = useState<EventBooking[]>([]);
  const [tableBookings, setTableBookings] = useState<TableBooking[]>([]);
  const [spaBookings, setSpaBookings] = useState<SpaBooking[]>([]);
  const [roomServiceOrders, setRoomServiceOrders] = useState<RoomServiceOrder[]>([]);
  const [airportTransfers, setAirportTransfers] = useState<AirportTransfer[]>([]);
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
      const [roomData, eventData, tableData, spaData, roomServiceData, transferData] = await Promise.all([
        supabase
          .from("room_bookings")
          .select("*, rooms(name, featured_image)")
          .eq("guest_email", user.email)
          .order("created_at", { ascending: false }),
        supabase
          .from("event_bookings")
          .select("*, event_spaces(name, featured_image)")
          .eq("client_email", user.email)
          .order("created_at", { ascending: false }),
        supabase
          .from("table_bookings")
          .select("*")
          .eq("guest_email", user.email)
          .order("created_at", { ascending: false }),
        supabase
          .from("spa_bookings")
          .select("*, spa_services(name, duration_minutes)")
          .eq("guest_email", user.email)
          .order("created_at", { ascending: false }),
        supabase
          .from("room_service_orders")
          .select("*")
          .eq("guest_email", user.email)
          .order("created_at", { ascending: false }),
        supabase
          .from("airport_transfers")
          .select("*")
          .eq("guest_email", user.email)
          .order("created_at", { ascending: false }),
      ]);

      setRoomBookings(roomData.data || []);
      setEventBookings(eventData.data || []);
      setTableBookings(tableData.data || []);
      setSpaBookings(spaData.data || []);
      setRoomServiceOrders(roomServiceData.data || []);
      setAirportTransfers(transferData.data || []);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => `ETB ${value.toLocaleString()}`;

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
              <TabsList className="mb-6 bg-muted/50 flex-wrap h-auto gap-1">
                <TabsTrigger value="rooms" className="gap-2">
                  <Hotel className="w-4 h-4" />
                  Rooms ({roomBookings.length})
                </TabsTrigger>
                <TabsTrigger value="events" className="gap-2">
                  <PartyPopper className="w-4 h-4" />
                  Events ({eventBookings.length})
                </TabsTrigger>
                <TabsTrigger value="tables" className="gap-2">
                  <Utensils className="w-4 h-4" />
                  Tables ({tableBookings.length})
                </TabsTrigger>
                <TabsTrigger value="spa" className="gap-2">
                  <Sparkles className="w-4 h-4" />
                  Spa ({spaBookings.length})
                </TabsTrigger>
                <TabsTrigger value="roomservice" className="gap-2">
                  <ShoppingCart className="w-4 h-4" />
                  Room Service ({roomServiceOrders.length})
                </TabsTrigger>
                <TabsTrigger value="transfers" className="gap-2">
                  <Plane className="w-4 h-4" />
                  Transfers ({airportTransfers.length})
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

              {/* Table Bookings */}
              <TabsContent value="tables">
                {tableBookings.length === 0 ? (
                  <Card className="bg-card border-border">
                    <CardContent className="py-16 text-center">
                      <Utensils className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-xl font-display text-foreground mb-2">No Table Reservations</h3>
                      <p className="text-muted-foreground mb-6">You haven't made any table reservations yet.</p>
                      <Button variant="gold" onClick={() => navigate("/table-booking")}>
                        Reserve a Table
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-4">
                    {tableBookings.map((booking) => (
                      <Card key={booking.id} className="bg-card border-border hover:border-gold/30 transition-colors">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between gap-4">
                            <div className="space-y-3">
                              <div>
                                <h3 className="font-display text-xl text-foreground">Restaurant Reservation</h3>
                                <p className="text-sm text-muted-foreground">
                                  Booked on {format(new Date(booking.created_at), "MMM d, yyyy")}
                                </p>
                              </div>
                              <div className="flex flex-wrap gap-4 text-sm">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  <Calendar className="w-4 h-4 text-gold" />
                                  <span>{format(new Date(booking.booking_date), "MMM d, yyyy")}</span>
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  <Clock className="w-4 h-4 text-gold" />
                                  <span>{booking.booking_time}</span>
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  <Users className="w-4 h-4 text-gold" />
                                  <span>{booking.party_size} guests</span>
                                </div>
                              </div>
                              {booking.special_requests && (
                                <p className="text-sm text-muted-foreground italic">"{booking.special_requests}"</p>
                              )}
                              {booking.total_amount && (
                                <div className="pt-2 border-t border-border">
                                  <span className="text-gold font-semibold">{formatCurrency(booking.total_amount)}</span>
                                </div>
                              )}
                            </div>
                            <Badge className={statusColors[booking.status] || statusColors.pending}>
                              {booking.status}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Spa Bookings */}
              <TabsContent value="spa">
                {spaBookings.length === 0 ? (
                  <Card className="bg-card border-border">
                    <CardContent className="py-16 text-center">
                      <Sparkles className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-xl font-display text-foreground mb-2">No Spa Bookings</h3>
                      <p className="text-muted-foreground mb-6">You haven't booked any spa treatments yet.</p>
                      <Button variant="gold" onClick={() => navigate("/spa")}>
                        Browse Treatments
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-4">
                    {spaBookings.map((booking) => (
                      <Card key={booking.id} className="bg-card border-border hover:border-gold/30 transition-colors">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between gap-4">
                            <div className="space-y-3">
                              <div>
                                <h3 className="font-display text-xl text-foreground">
                                  {booking.spa_services?.name || "Spa Treatment"}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  {booking.spa_services?.duration_minutes} minutes
                                </p>
                              </div>
                              <div className="flex flex-wrap gap-4 text-sm">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  <Calendar className="w-4 h-4 text-gold" />
                                  <span>{format(new Date(booking.booking_date), "MMM d, yyyy")}</span>
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  <Clock className="w-4 h-4 text-gold" />
                                  <span>{booking.booking_time}</span>
                                </div>
                              </div>
                              {booking.special_requests && (
                                <p className="text-sm text-muted-foreground italic">"{booking.special_requests}"</p>
                              )}
                              {booking.total_amount && (
                                <div className="pt-2 border-t border-border">
                                  <span className="text-gold font-semibold">{formatCurrency(booking.total_amount)}</span>
                                </div>
                              )}
                            </div>
                            <Badge className={statusColors[booking.status] || statusColors.pending}>
                              {booking.status}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Room Service Orders */}
              <TabsContent value="roomservice">
                {roomServiceOrders.length === 0 ? (
                  <Card className="bg-card border-border">
                    <CardContent className="py-16 text-center">
                      <ShoppingCart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-xl font-display text-foreground mb-2">No Room Service Orders</h3>
                      <p className="text-muted-foreground mb-6">You haven't placed any room service orders yet.</p>
                      <Button variant="gold" onClick={() => navigate("/room-service")}>
                        Order Room Service
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-4">
                    {roomServiceOrders.map((order) => {
                      const items = Array.isArray(order.items) ? order.items : [];
                      return (
                        <Card key={order.id} className="bg-card border-border hover:border-gold/30 transition-colors">
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between gap-4">
                              <div className="space-y-3">
                                <div>
                                  <h3 className="font-display text-xl text-foreground">Room Service Order</h3>
                                  <p className="text-sm text-muted-foreground">
                                    Room {order.room_number} • {format(new Date(order.created_at), "MMM d, yyyy 'at' h:mm a")}
                                  </p>
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {items.map((item: any, idx: number) => (
                                    <span key={idx}>
                                      {item.quantity}x {item.name}{idx < items.length - 1 ? ", " : ""}
                                    </span>
                                  ))}
                                </div>
                                {order.special_instructions && (
                                  <p className="text-sm text-muted-foreground italic">"{order.special_instructions}"</p>
                                )}
                                {order.total_amount && (
                                  <div className="pt-2 border-t border-border">
                                    <span className="text-gold font-semibold">{formatCurrency(order.total_amount)}</span>
                                  </div>
                                )}
                              </div>
                              <Badge className={statusColors[order.status] || statusColors.pending}>
                                {order.status}
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </TabsContent>

              {/* Airport Transfers */}
              <TabsContent value="transfers">
                {airportTransfers.length === 0 ? (
                  <Card className="bg-card border-border">
                    <CardContent className="py-16 text-center">
                      <Plane className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-xl font-display text-foreground mb-2">No Airport Transfers</h3>
                      <p className="text-muted-foreground mb-6">You haven't booked any airport transfers yet.</p>
                      <Button variant="gold" onClick={() => navigate("/airport-transfer")}>
                        Book Transfer
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-4">
                    {airportTransfers.map((transfer) => (
                      <Card key={transfer.id} className="bg-card border-border hover:border-gold/30 transition-colors">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between gap-4">
                            <div className="space-y-3">
                              <div>
                                <h3 className="font-display text-xl text-foreground">
                                  Airport {transfer.transfer_type === "pickup" ? "Pickup" : "Drop-off"}
                                </h3>
                                <p className="text-sm text-muted-foreground capitalize">
                                  {transfer.vehicle_type} • {transfer.passengers} passengers
                                </p>
                              </div>
                              <div className="flex flex-wrap gap-4 text-sm">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  <Calendar className="w-4 h-4 text-gold" />
                                  <span>{format(new Date(transfer.pickup_datetime), "MMM d, yyyy 'at' h:mm a")}</span>
                                </div>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                <p><span className="text-foreground">From:</span> {transfer.pickup_location}</p>
                                <p><span className="text-foreground">To:</span> {transfer.dropoff_location}</p>
                              </div>
                              {transfer.total_amount && (
                                <div className="pt-2 border-t border-border">
                                  <span className="text-gold font-semibold">{formatCurrency(transfer.total_amount)}</span>
                                </div>
                              )}
                            </div>
                            <Badge className={statusColors[transfer.status] || statusColors.pending}>
                              {transfer.status}
                            </Badge>
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
