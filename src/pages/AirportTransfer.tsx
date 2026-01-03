import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Plane, Car, Users, Luggage, CheckCircle, ArrowRight } from "lucide-react";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import PaymentDialog from "@/components/PaymentDialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  guestName: z.string().min(2, "Name is required"),
  guestEmail: z.string().email("Valid email required"),
  guestPhone: z.string().min(9, "Phone number required"),
  transferType: z.enum(["pickup", "dropoff"]),
  flightNumber: z.string().optional(),
  pickupDate: z.date({ required_error: "Please select a date" }),
  pickupTime: z.string().min(1, "Please select a time"),
  passengers: z.string().min(1, "Number of passengers required"),
  luggageCount: z.string().min(1, "Luggage count required"),
  vehicleType: z.string().min(1, "Please select a vehicle"),
  specialRequests: z.string().optional(),
});

const vehicles = [
  { id: "sedan", name: "Sedan", capacity: 3, price: 800, description: "Toyota Corolla or similar" },
  { id: "suv", name: "SUV", capacity: 5, price: 1200, description: "Toyota Land Cruiser or similar" },
  { id: "van", name: "Van", capacity: 8, price: 1800, description: "Toyota Hiace or similar" },
  { id: "luxury", name: "Luxury", capacity: 3, price: 2500, description: "Mercedes E-Class or similar" },
];

const timeSlots = Array.from({ length: 24 }, (_, i) => {
  const hour = i.toString().padStart(2, "0");
  return [`${hour}:00`, `${hour}:30`];
}).flat();

const AirportTransfer = () => {
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
      transferType: "pickup",
      flightNumber: "",
      passengers: "1",
      luggageCount: "1",
      vehicleType: "sedan",
      specialRequests: "",
    },
  });

  const selectedVehicle = vehicles.find(v => v.id === form.watch("vehicleType"));
  const transferType = form.watch("transferType");

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-ET', {
      style: 'currency',
      currency: 'ETB',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setPendingBooking(values);
    setShowPayment(true);
  };

  const handlePaymentComplete = async (paymentMethod: string, transactionRef: string) => {
    if (!pendingBooking) return;

    setIsSubmitting(true);

    try {
      const pickupDatetime = new Date(pendingBooking.pickupDate);
      const [hours, minutes] = pendingBooking.pickupTime.split(":");
      pickupDatetime.setHours(parseInt(hours), parseInt(minutes));

      const pickupLocation = pendingBooking.transferType === "pickup" 
        ? "Addis Ababa Bole International Airport"
        : "Meskerem Hotel, Addis Ababa";
      
      const dropoffLocation = pendingBooking.transferType === "pickup"
        ? "Meskerem Hotel, Addis Ababa"
        : "Addis Ababa Bole International Airport";

      const { error } = await supabase.from("airport_transfers").insert({
        guest_name: pendingBooking.guestName,
        guest_email: pendingBooking.guestEmail,
        guest_phone: pendingBooking.guestPhone,
        transfer_type: pendingBooking.transferType,
        flight_number: pendingBooking.flightNumber || null,
        pickup_datetime: pickupDatetime.toISOString(),
        pickup_location: pickupLocation,
        dropoff_location: dropoffLocation,
        passengers: parseInt(pendingBooking.passengers),
        luggage_count: parseInt(pendingBooking.luggageCount),
        vehicle_type: pendingBooking.vehicleType,
        special_requests: pendingBooking.specialRequests || null,
        status: "confirmed",
        payment_status: paymentMethod === "cash" ? "pending" : "paid",
        payment_method: paymentMethod,
        total_amount: selectedVehicle?.price || 0,
      });

      if (error) throw error;

      setBookingSuccess(true);
      form.reset();
      toast.success("Airport transfer booked successfully!");
    } catch (error) {
      console.error("Booking error:", error);
      toast.error("Failed to complete booking");
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
                    Transfer Confirmed!
                  </h2>
                  <p className="text-muted-foreground">
                    Your airport transfer has been booked. Our driver will be waiting for you.
                  </p>
                </div>
                <Button variant="gold" onClick={() => setBookingSuccess(false)}>
                  Book Another Transfer
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
        title="Airport Transfer"
        subtitle="Comfortable and reliable transportation to and from Bole International Airport"
        backgroundImage="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80"
      />

      <section className="py-20">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Booking Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="font-display text-2xl">Book Your Transfer</CardTitle>
                  <CardDescription>
                    Fill in the details for your airport transfer service
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      {/* Transfer Type */}
                      <FormField
                        control={form.control}
                        name="transferType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Transfer Type</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="grid grid-cols-2 gap-4"
                              >
                                <Label
                                  htmlFor="pickup"
                                  className={cn(
                                    "flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all",
                                    field.value === "pickup"
                                      ? "border-primary bg-primary/5"
                                      : "border-border hover:border-primary/50"
                                  )}
                                >
                                  <RadioGroupItem value="pickup" id="pickup" />
                                  <div className="flex items-center gap-2">
                                    <Plane className="w-5 h-5" />
                                    <ArrowRight className="w-4 h-4" />
                                    <Car className="w-5 h-5" />
                                  </div>
                                  <span className="font-medium">Airport Pickup</span>
                                </Label>
                                <Label
                                  htmlFor="dropoff"
                                  className={cn(
                                    "flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all",
                                    field.value === "dropoff"
                                      ? "border-primary bg-primary/5"
                                      : "border-border hover:border-primary/50"
                                  )}
                                >
                                  <RadioGroupItem value="dropoff" id="dropoff" />
                                  <div className="flex items-center gap-2">
                                    <Car className="w-5 h-5" />
                                    <ArrowRight className="w-4 h-4" />
                                    <Plane className="w-5 h-5" />
                                  </div>
                                  <span className="font-medium">Airport Drop-off</span>
                                </Label>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Personal Details */}
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
                          name="guestPhone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl>
                                <Input type="tel" placeholder="+251 9XX XXX XXX" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

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
                        name="flightNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Flight Number {transferType === "pickup" ? "(Recommended)" : "(Optional)"}
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., ET 500" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Date & Time */}
                      <div className="grid sm:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="pickupDate"
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel>
                                {transferType === "pickup" ? "Arrival Date" : "Departure Date"}
                              </FormLabel>
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
                          name="pickupTime"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                {transferType === "pickup" ? "Arrival Time" : "Pickup Time"}
                              </FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select time" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className="max-h-60">
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

                      {/* Passengers & Luggage */}
                      <div className="grid sm:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="passengers"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2">
                                <Users className="w-4 h-4" /> Passengers
                              </FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                                    <SelectItem key={num} value={num.toString()}>
                                      {num} {num === 1 ? "Person" : "People"}
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
                          name="luggageCount"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2">
                                <Luggage className="w-4 h-4" /> Luggage
                              </FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                                    <SelectItem key={num} value={num.toString()}>
                                      {num} {num === 1 ? "Bag" : "Bags"}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Vehicle Selection */}
                      <FormField
                        control={form.control}
                        name="vehicleType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Select Vehicle</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="grid sm:grid-cols-2 gap-4"
                              >
                                {vehicles.map((vehicle) => (
                                  <Label
                                    key={vehicle.id}
                                    htmlFor={vehicle.id}
                                    className={cn(
                                      "flex flex-col p-4 rounded-lg border-2 cursor-pointer transition-all",
                                      field.value === vehicle.id
                                        ? "border-primary bg-primary/5"
                                        : "border-border hover:border-primary/50"
                                    )}
                                  >
                                    <div className="flex items-center gap-2 mb-2">
                                      <RadioGroupItem value={vehicle.id} id={vehicle.id} />
                                      <span className="font-semibold">{vehicle.name}</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground mb-1">
                                      {vehicle.description}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      Up to {vehicle.capacity} passengers
                                    </p>
                                    <p className="text-lg font-bold text-primary mt-2">
                                      {formatCurrency(vehicle.price)}
                                    </p>
                                  </Label>
                                ))}
                              </RadioGroup>
                            </FormControl>
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
                                placeholder="Child seat, wheelchair access, meet & greet service..."
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button type="submit" variant="gold" size="lg" className="w-full" disabled={isSubmitting}>
                        Book Transfer - {formatCurrency(selectedVehicle?.price || 0)}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>

            {/* Info Sidebar */}
            <div className="space-y-6">
              <Card className="bg-primary text-primary-foreground">
                <CardContent className="p-6 space-y-4">
                  <Plane className="w-10 h-10 text-secondary" />
                  <h3 className="text-xl font-display font-semibold">Why Book With Us?</h3>
                  <ul className="space-y-2 text-primary-foreground/80 text-sm">
                    <li>✓ Meet & greet at the airport</li>
                    <li>✓ Flight tracking included</li>
                    <li>✓ Free waiting time (60 min)</li>
                    <li>✓ Professional drivers</li>
                    <li>✓ 24/7 availability</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 space-y-4">
                  <h3 className="font-semibold">Distance to Hotel</h3>
                  <p className="text-sm text-muted-foreground">
                    Bole International Airport is approximately <strong>8 km</strong> from Meskerem Hotel. 
                    Travel time is typically 20-40 minutes depending on traffic.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 space-y-4">
                  <h3 className="font-semibold">Contact Us</h3>
                  <p className="text-sm text-muted-foreground">
                    Need assistance with your booking?
                  </p>
                  <p className="text-sm font-medium">+251 912 345 678</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <PaymentDialog
        open={showPayment}
        onOpenChange={setShowPayment}
        amount={selectedVehicle?.price || 0}
        bookingType="airport transfer"
        onPaymentComplete={handlePaymentComplete}
      />

      <Footer />
    </div>
  );
};

export default AirportTransfer;