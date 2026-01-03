import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock, Sparkles, CheckCircle } from "lucide-react";
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import PaymentDialog from "@/components/PaymentDialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  guestName: z.string().min(2, "Name is required"),
  guestEmail: z.string().email("Valid email required"),
  guestPhone: z.string().optional(),
  bookingDate: z.date({ required_error: "Please select a date" }),
  bookingTime: z.string().min(1, "Please select a time"),
  specialRequests: z.string().optional(),
});

const timeSlots = [
  "09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00", "18:00"
];

const Spa = () => {
  const [selectedService, setSelectedService] = useState<any>(null);
  const [showBookingDialog, setShowBookingDialog] = useState(false);
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

  const { data: services } = useQuery({
    queryKey: ["spa-services"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("spa_services")
        .select("*")
        .eq("is_active", true)
        .order("created_at");
      if (error) throw error;
      return data;
    },
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-ET', {
      style: 'currency',
      currency: 'ETB',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const openBooking = (service: any) => {
    setSelectedService(service);
    setShowBookingDialog(true);
    form.reset();
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setPendingBooking(values);
    setShowBookingDialog(false);
    setShowPayment(true);
  };

  const handlePaymentComplete = async (paymentMethod: string, transactionRef: string) => {
    if (!pendingBooking || !selectedService) return;

    try {
      const { error } = await supabase.from("spa_bookings").insert({
        guest_name: pendingBooking.guestName,
        guest_email: pendingBooking.guestEmail,
        guest_phone: pendingBooking.guestPhone || null,
        spa_service_id: selectedService.id,
        booking_date: format(pendingBooking.bookingDate, "yyyy-MM-dd"),
        booking_time: pendingBooking.bookingTime,
        special_requests: pendingBooking.specialRequests || null,
        status: "confirmed",
        payment_status: paymentMethod === "cash" ? "pending" : "paid",
        payment_method: paymentMethod,
        total_amount: selectedService.price,
      });

      if (error) throw error;

      setBookingSuccess(true);
      form.reset();
      toast.success("Spa appointment confirmed!");
    } catch (error) {
      console.error("Booking error:", error);
      toast.error("Failed to complete booking");
    }
    setPendingBooking(null);
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      signature: "bg-gradient-gold text-white",
      massage: "bg-primary text-primary-foreground",
      facial: "bg-pink-500 text-white",
      couples: "bg-rose-500 text-white",
      body: "bg-teal-500 text-white",
      beauty: "bg-purple-500 text-white",
    };
    return colors[category] || "bg-secondary text-secondary-foreground";
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
                    Appointment Confirmed!
                  </h2>
                  <p className="text-muted-foreground">
                    Your spa treatment has been booked. We look forward to pampering you!
                  </p>
                </div>
                <Button variant="gold" onClick={() => setBookingSuccess(false)}>
                  Book Another Treatment
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
        title="Spa & Wellness"
        subtitle="Rejuvenate your body and soul with our luxurious spa treatments"
        backgroundImage="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80"
      />

      {/* Intro Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <Sparkles className="w-12 h-12 mx-auto text-secondary mb-6" />
          <h2 className="text-3xl font-display font-bold text-foreground mb-4">
            Experience Ethiopian Wellness
          </h2>
          <p className="text-muted-foreground text-lg">
            Our spa combines traditional Ethiopian healing practices with modern wellness techniques. 
            Indulge in treatments that use locally-sourced natural ingredients, including Ethiopian 
            coffee, honey, and indigenous herbs.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-foreground mb-4">Our Treatments</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Choose from our selection of signature treatments designed to restore balance and vitality
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {services?.map((service) => (
              <Card key={service.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
                <div className="relative aspect-[4/3] bg-gradient-to-br from-primary/20 to-secondary/20">
                  {service.image_url ? (
                    <img
                      src={service.image_url}
                      alt={service.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Sparkles className="w-16 h-16 text-secondary/50" />
                    </div>
                  )}
                  <Badge className={`absolute top-3 left-3 ${getCategoryColor(service.category || "")}`}>
                    {service.category}
                  </Badge>
                </div>
                <CardContent className="p-5">
                  <h3 className="font-display font-semibold text-lg mb-2">{service.name}</h3>
                  {service.description && (
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {service.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>{service.duration_minutes} min</span>
                    </div>
                    <span className="text-xl font-bold text-primary">
                      {formatCurrency(service.price)}
                    </span>
                  </div>
                  <Button
                    variant="gold"
                    className="w-full"
                    onClick={() => openBooking(service)}
                  >
                    Book Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {(!services || services.length === 0) && (
            <div className="text-center py-12">
              <Sparkles className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">Spa services coming soon...</p>
            </div>
          )}
        </div>
      </section>

      {/* Facilities Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <h3 className="text-xl font-display font-semibold mb-2">Steam Room</h3>
              <p className="text-primary-foreground/80">Complimentary with any treatment</p>
            </div>
            <div>
              <h3 className="text-xl font-display font-semibold mb-2">Relaxation Lounge</h3>
              <p className="text-primary-foreground/80">Herbal tea service included</p>
            </div>
            <div>
              <h3 className="text-xl font-display font-semibold mb-2">Private Suites</h3>
              <p className="text-primary-foreground/80">Available for couples</p>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Dialog */}
      <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">
              Book {selectedService?.name}
            </DialogTitle>
          </DialogHeader>

          {selectedService && (
            <div className="space-y-6 py-4">
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{selectedService.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedService.duration_minutes} minutes
                    </p>
                  </div>
                  <p className="text-xl font-bold text-primary">
                    {formatCurrency(selectedService.price)}
                  </p>
                </div>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

                  <FormField
                    control={form.control}
                    name="guestPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone (Optional)</FormLabel>
                        <FormControl>
                          <Input type="tel" placeholder="+251 9XX XXX XXX" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
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
                                  {field.value ? format(field.value, "PP") : "Select"}
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
                                <SelectValue placeholder="Select" />
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
                    name="specialRequests"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Special Requests (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Any preferences or health considerations..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" variant="gold" size="lg" className="w-full">
                    Continue to Payment
                  </Button>
                </form>
              </Form>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <PaymentDialog
        open={showPayment}
        onOpenChange={setShowPayment}
        amount={selectedService?.price || 0}
        bookingType="spa treatment"
        onPaymentComplete={handlePaymentComplete}
      />

      <Footer />
    </div>
  );
};

export default Spa;