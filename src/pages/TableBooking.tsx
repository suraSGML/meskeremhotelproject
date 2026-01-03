import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock, Users, Utensils, CheckCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import PaymentDialog from "@/components/PaymentDialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  guestName: z.string().min(2, "Name must be at least 2 characters"),
  guestEmail: z.string().email("Invalid email address"),
  guestPhone: z.string().optional(),
  bookingDate: z.date({ required_error: "Please select a date" }),
  bookingTime: z.string().min(1, "Please select a time"),
  partySize: z.string().min(1, "Please select party size"),
  specialRequests: z.string().optional(),
});

const timeSlots = [
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
  "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00"
];

const RESERVATION_FEE = 200; // ETB reservation fee

const TableBooking = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [pendingBooking, setPendingBooking] = useState<z.infer<typeof formSchema> | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      guestName: "",
      guestEmail: "",
      guestPhone: "",
      specialRequests: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setPendingBooking(values);
    setShowPayment(true);
  };

  const handlePaymentComplete = async (paymentMethod: string, transactionRef: string) => {
    if (!pendingBooking) return;

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("table_bookings").insert({
        guest_name: pendingBooking.guestName,
        guest_email: pendingBooking.guestEmail,
        guest_phone: pendingBooking.guestPhone || null,
        booking_date: format(pendingBooking.bookingDate, "yyyy-MM-dd"),
        booking_time: pendingBooking.bookingTime,
        party_size: parseInt(pendingBooking.partySize),
        special_requests: pendingBooking.specialRequests || null,
        status: "confirmed",
        payment_status: paymentMethod === "cash" ? "pending" : "paid",
        payment_method: paymentMethod,
        total_amount: RESERVATION_FEE,
      });

      if (error) throw error;

      setBookingSuccess(true);
      form.reset();
      toast.success("Table reservation confirmed!");
    } catch (error) {
      console.error("Booking error:", error);
      toast.error("Failed to complete booking. Please try again.");
    } finally {
      setIsSubmitting(false);
      setPendingBooking(null);
    }
  };

  if (bookingSuccess) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-20">
          <div className="container mx-auto px-6 max-w-2xl">
            <Card className="text-center py-12">
              <CardContent className="space-y-6">
                <div className="w-24 h-24 mx-auto rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <CheckCircle className="w-14 h-14 text-green-600" />
                </div>
                <div>
                  <h2 className="text-3xl font-display font-bold text-foreground mb-2">
                    Reservation Confirmed!
                  </h2>
                  <p className="text-muted-foreground">
                    Thank you for your reservation. A confirmation email has been sent to your inbox.
                  </p>
                </div>
                <Button variant="gold" onClick={() => setBookingSuccess(false)}>
                  Make Another Reservation
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <PageHeader
        title="Reserve Your Table"
        subtitle="Experience authentic Ethiopian cuisine in our elegant restaurant"
        backgroundImage="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80"
      />

      <section className="py-20">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Booking Form */}
            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <CardTitle className="font-display text-2xl">Reservation Details</CardTitle>
                  <CardDescription>
                    Fill in your details to reserve a table at our restaurant
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="guestName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Your name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="guestEmail"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="your@email.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="guestPhone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number (Optional)</FormLabel>
                            <FormControl>
                              <Input type="tel" placeholder="+251 9XX XXX XXX" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid sm:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="bookingDate"
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel>Date</FormLabel>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant="outline"
                                      className={cn(
                                        "w-full pl-3 text-left font-normal",
                                        !field.value && "text-muted-foreground"
                                      )}
                                    >
                                      {field.value ? format(field.value, "PPP") : "Select date"}
                                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                  <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    disabled={(date) => date < new Date()}
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="bookingTime"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Time</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select time" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {timeSlots.map((time) => (
                                    <SelectItem key={time} value={time}>
                                      {time}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="partySize"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Number of Guests</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select party size" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 15, 20].map((size) => (
                                  <SelectItem key={size} value={size.toString()}>
                                    {size} {size === 1 ? "Guest" : "Guests"}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="specialRequests"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Special Requests (Optional)</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Any dietary requirements, special occasions, seating preferences..."
                                className="min-h-[100px]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button type="submit" variant="gold" size="lg" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? "Processing..." : "Reserve Table"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>

            {/* Info Sidebar */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-primary text-primary-foreground">
                <CardContent className="p-6 space-y-4">
                  <Utensils className="w-10 h-10 text-secondary" />
                  <h3 className="text-xl font-display font-semibold">Dining Experience</h3>
                  <p className="text-primary-foreground/80 text-sm">
                    Our restaurant offers an authentic Ethiopian dining experience with traditional dishes 
                    prepared by expert chefs. Enjoy injera with various wots in a warm, welcoming atmosphere.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 space-y-4">
                  <Clock className="w-8 h-8 text-secondary" />
                  <h3 className="font-semibold">Opening Hours</h3>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p><strong>Lunch:</strong> 12:00 PM - 3:00 PM</p>
                    <p><strong>Dinner:</strong> 6:00 PM - 10:00 PM</p>
                    <p className="text-xs mt-2">Closed on Mondays</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 space-y-4">
                  <Users className="w-8 h-8 text-secondary" />
                  <h3 className="font-semibold">Group Bookings</h3>
                  <p className="text-sm text-muted-foreground">
                    For parties larger than 20 guests, please contact us directly for special arrangements.
                  </p>
                </CardContent>
              </Card>

              <div className="bg-muted/50 rounded-lg p-4 text-center">
                <p className="text-sm text-muted-foreground">Reservation Fee</p>
                <p className="text-2xl font-display font-bold text-primary">ETB {RESERVATION_FEE}</p>
                <p className="text-xs text-muted-foreground mt-1">Deducted from your final bill</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <PaymentDialog
        open={showPayment}
        onOpenChange={setShowPayment}
        amount={RESERVATION_FEE}
        bookingType="table reservation"
        onPaymentComplete={handlePaymentComplete}
      />

      <Footer />
    </div>
  );
};

export default TableBooking;