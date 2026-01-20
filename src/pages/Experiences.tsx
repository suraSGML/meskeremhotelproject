import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  CheckCircle, 
  MapPin, 
  Users, 
  Compass, 
  Music, 
  Utensils, 
  Camera, 
  Mountain, 
  Heart,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";
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
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import PaymentDialog from "@/components/PaymentDialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import eventGarden from "@/assets/event-garden.jpg";

const formSchema = z.object({
  guestName: z.string().min(2, "Name is required"),
  guestEmail: z.string().email("Valid email required"),
  guestPhone: z.string().optional(),
  bookingDate: z.date({ required_error: "Please select a date" }),
  bookingTime: z.string().min(1, "Please select a time"),
  numParticipants: z.string().min(1, "Number of participants required"),
  specialRequests: z.string().optional(),
});

const timeSlots = [
  "06:00", "07:00", "08:00", "09:00", "10:00", "14:00", "15:00"
];

// Icon mapping for categories
const categoryIcons: Record<string, typeof Compass> = {
  'Tours': Compass,
  'Heritage': Compass,
  'Cultural': Music,
  'Culinary': Utensils,
  'Photography': Camera,
  'Adventure': Mountain,
  'Nature': Mountain,
  'Wellness': Heart,
};

const getIconForCategory = (category: string | null) => {
  if (!category) return Compass;
  for (const [key, icon] of Object.entries(categoryIcons)) {
    if (category.toLowerCase().includes(key.toLowerCase())) {
      return icon;
    }
  }
  return Compass;
};

const getCategoryColor = (category: string | null) => {
  const colors: Record<string, string> = {
    cultural: "bg-amber-500 text-white",
    adventure: "bg-emerald-500 text-white",
    culinary: "bg-orange-500 text-white",
    nature: "bg-green-500 text-white",
    wellness: "bg-pink-500 text-white",
  };
  if (!category) return "bg-secondary text-secondary-foreground";
  return colors[category.toLowerCase()] || "bg-secondary text-secondary-foreground";
};

const Experiences = () => {
  const [selectedExperience, setSelectedExperience] = useState<any>(null);
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
      numParticipants: "1",
      specialRequests: "",
    },
  });

  const { data: experiences, isLoading } = useQuery({
    queryKey: ["experiences"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("experiences")
        .select("*")
        .eq("is_active", true)
        .order("created_at");
      if (error) throw error;
      return data;
    },
  });

  const formatCurrency = (value: number | null) => {
    if (!value) return "Complimentary";
    return new Intl.NumberFormat('en-ET', {
      style: 'currency',
      currency: 'ETB',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const openBooking = (experience: any) => {
    setSelectedExperience(experience);
    setShowBookingDialog(true);
    form.reset();
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setPendingBooking(values);
    setShowBookingDialog(false);
    setShowPayment(true);
  };

  const calculateTotal = () => {
    if (!selectedExperience?.price || !pendingBooking) return selectedExperience?.price || 0;
    return selectedExperience.price * parseInt(pendingBooking.numParticipants || "1");
  };

  const handlePaymentComplete = async (paymentMethod: string, transactionRef: string) => {
    if (!pendingBooking || !selectedExperience) return;

    const numParticipants = parseInt(pendingBooking.numParticipants);
    const totalAmount = (selectedExperience.price || 0) * numParticipants;

    try {
      const { error } = await supabase.from("experience_bookings").insert({
        guest_name: pendingBooking.guestName,
        guest_email: pendingBooking.guestEmail,
        guest_phone: pendingBooking.guestPhone || null,
        experience_id: selectedExperience.id,
        booking_date: format(pendingBooking.bookingDate, "yyyy-MM-dd"),
        booking_time: pendingBooking.bookingTime,
        num_participants: numParticipants,
        special_requests: pendingBooking.specialRequests || null,
        status: "confirmed",
        payment_status: paymentMethod === "cash" ? "pending" : "paid",
        payment_method: paymentMethod,
        total_amount: totalAmount,
      });

      if (error) throw error;

      setBookingSuccess(true);
      form.reset();
      toast.success("Experience booking confirmed!");
    } catch (error) {
      console.error("Booking error:", error);
      toast.error("Failed to complete booking");
    }
    setPendingBooking(null);
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
                    Adventure Awaits!
                  </h2>
                  <p className="text-muted-foreground">
                    Your experience has been booked. Get ready for an unforgettable journey!
                  </p>
                </div>
                <Button variant="gold" onClick={() => setBookingSuccess(false)}>
                  Book Another Experience
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
        title="Curated Experiences"
        subtitle="Beyond The Stay"
        description="Immerse yourself in the rich tapestry of Ethiopian culture through carefully crafted experiences."
      />

      {/* Intro Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <Compass className="w-12 h-12 mx-auto text-secondary mb-6" />
          <h2 className="text-3xl font-display font-bold text-foreground mb-4">
            Discover Ethiopia's Wonders
          </h2>
          <p className="text-muted-foreground text-lg">
            From ancient monasteries to breathtaking mountain trails, our curated experiences 
            offer authentic glimpses into Ethiopia's rich heritage, stunning landscapes, and 
            vibrant culture. Let us guide you on an unforgettable journey.
          </p>
        </div>
      </section>

      {/* Experiences Grid */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-foreground mb-4">Our Experiences</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Choose from our selection of carefully crafted adventures and cultural immersions
            </p>
          </div>

          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-card rounded-lg overflow-hidden shadow-soft">
                  <Skeleton className="aspect-[16/10]" />
                  <div className="p-6 space-y-4">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : (!experiences || experiences.length === 0) ? (
            <div className="text-center py-12">
              <Compass className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">Experiences coming soon...</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {experiences.map((experience) => {
                const IconComponent = getIconForCategory(experience.category);
                
                return (
                  <Card 
                    key={experience.id} 
                    className="group hover:shadow-lg transition-all duration-300 overflow-hidden"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <img
                        src={experience.image_url || eventGarden}
                        alt={experience.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = eventGarden;
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-transparent to-transparent" />
                      <Badge className={`absolute top-3 left-3 ${getCategoryColor(experience.category)}`}>
                        {experience.category || "Experience"}
                      </Badge>
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="font-display text-2xl text-white">{experience.name}</h3>
                      </div>
                    </div>
                    
                    <CardContent className="p-5">
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {experience.short_description || experience.description}
                      </p>
                      
                      <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                        {experience.duration && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4 text-gold" />
                            <span>{experience.duration}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <IconComponent className="w-4 h-4 text-gold" />
                          <span>{experience.category}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        <span className="text-xl font-bold text-primary">
                          {formatCurrency(experience.price)}
                        </span>
                        <Button
                          variant="gold"
                          onClick={() => openBooking(experience)}
                        >
                          Book Now
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Highlights Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <h3 className="text-xl font-display font-semibold mb-2">Expert Local Guides</h3>
              <p className="text-primary-foreground/80">Knowledgeable guides who share authentic stories</p>
            </div>
            <div>
              <h3 className="text-xl font-display font-semibold mb-2">Small Groups</h3>
              <p className="text-primary-foreground/80">Intimate experiences with personalized attention</p>
            </div>
            <div>
              <h3 className="text-xl font-display font-semibold mb-2">All-Inclusive</h3>
              <p className="text-primary-foreground/80">Transport, meals, and entrance fees included</p>
            </div>
          </div>
        </div>
      </section>

      {/* Custom Experiences CTA */}
      <section className="py-24 bg-muted">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto bg-background rounded-lg shadow-elevated overflow-hidden">
            <div className="grid md:grid-cols-2">
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <p className="text-gold uppercase tracking-[0.3em] text-sm mb-4">
                  Bespoke Experiences
                </p>
                <h2 className="font-display text-3xl md:text-4xl text-foreground mb-4">
                  Create Your Own Adventure
                </h2>
                <p className="text-muted-foreground mb-8">
                  Our concierge team can craft personalized experiences tailored to your interests, 
                  from private tours to exclusive cultural events.
                </p>
                <Link to="/contact">
                  <Button variant="gold" size="lg" className="group w-fit">
                    Contact Concierge
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
              <div className="aspect-square md:aspect-auto">
                <img
                  src={eventGarden}
                  alt="Custom experiences"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Dialog */}
      <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">
              Book {selectedExperience?.name}
            </DialogTitle>
          </DialogHeader>

          {selectedExperience && (
            <div className="space-y-6 py-4">
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">{selectedExperience.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedExperience.duration}
                    </p>
                    {selectedExperience.category && (
                      <Badge className={`mt-2 ${getCategoryColor(selectedExperience.category)}`}>
                        {selectedExperience.category}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xl font-bold text-primary">
                    {formatCurrency(selectedExperience.price)}
                    <span className="text-sm font-normal text-muted-foreground">/person</span>
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

                  <FormField
                    control={form.control}
                    name="numParticipants"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of Participants</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                              <SelectItem key={num} value={num.toString()}>
                                {num} {num === 1 ? "person" : "people"}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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
                          <FormLabel>Start Time</FormLabel>
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
                            placeholder="Dietary requirements, mobility considerations..."
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
        amount={calculateTotal()}
        bookingType="experience"
        onPaymentComplete={handlePaymentComplete}
      />

      <Footer />
    </div>
  );
};

export default Experiences;
