import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send, MessageCircle, Calendar, Users, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";

const inquiryTypes = [
  { id: "general", label: "General Inquiry", icon: MessageCircle, description: "Questions about our hotel" },
  { id: "reservation", label: "Room Booking", icon: Calendar, description: "Book or inquire about rooms" },
  { id: "event", label: "Event/Wedding", icon: Users, description: "Plan your special occasion" },
  { id: "dining", label: "Restaurant", icon: Calendar, description: "Table reservations & catering" },
];

const Contact = () => {
  const { toast } = useToast();
  const [selectedType, setSelectedType] = useState("general");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    eventDate: "",
    guestCount: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Build subject based on inquiry type
      const inquiryLabel = inquiryTypes.find(t => t.id === selectedType)?.label || 'General';
      const fullSubject = formData.subject 
        ? `[${inquiryLabel}] ${formData.subject}`
        : `[${inquiryLabel}] New inquiry`;

      // Build message with additional details
      let fullMessage = formData.message;
      if (selectedType === "event" || selectedType === "reservation") {
        if (formData.eventDate) {
          fullMessage += `\n\nPreferred Date: ${formData.eventDate}`;
        }
        if (formData.guestCount) {
          fullMessage += `\nExpected Guests: ${formData.guestCount}`;
        }
      }

      const { error } = await supabase.from('contact_inquiries').insert({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || null,
        subject: fullSubject,
        message: fullMessage.trim(),
        inquiry_type: selectedType,
      });

      if (error) throw error;

      toast({
        title: "Message Sent!",
        description: "Thank you for contacting us. We'll respond within 24 hours.",
      });
      
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
        eventDate: "",
        guestCount: "",
      });
      setSelectedType("general");
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      toast({
        title: "Failed to send",
        description: "Please try again or contact us directly by phone.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen">
      <Navbar />
      
      <PageHeader
        title="Contact Us"
        subtitle="Get in Touch"
        description="We're here to help plan your perfect stay or event. Reach out and let's start a conversation."
      />

      {/* Contact Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h2 className="font-display text-3xl text-foreground mb-6">
                  Visit Us
                </h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-gold" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Meskerem Hotel</p>
                      <p className="text-muted-foreground text-sm">
                        Main Street, Debre Markos<br />
                        Gojjam Region, Ethiopia
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-gold" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Phone</p>
                      <p className="text-muted-foreground text-sm">
                        +251 912 345 678<br />
                        +251 587 123 456
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-gold" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Email</p>
                      <p className="text-muted-foreground text-sm">
                        reservations@meskeremhotel.com<br />
                        events@meskeremhotel.com
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-gold" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Reception</p>
                      <p className="text-muted-foreground text-sm">
                        24/7 Available<br />
                        Check-in: 14:00 • Check-out: 12:00
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Contact */}
              <div className="bg-card p-6 rounded-lg">
                <h3 className="font-display text-xl text-foreground mb-4">Quick Contact</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  For immediate assistance, reach us on WhatsApp:
                </p>
                <a
                  href="https://wa.me/251912345678"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#25D366] text-white px-4 py-2 rounded-lg hover:bg-[#20BD5A] transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span className="font-medium">Chat on WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-card p-8 md:p-12 rounded-lg shadow-soft">
                <h2 className="font-display text-3xl text-foreground mb-8">
                  Send Us a Message
                </h2>

                {/* Inquiry Type Selector */}
                <div className="mb-8">
                  <Label className="block text-sm font-medium text-foreground mb-3">
                    What can we help you with?
                  </Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {inquiryTypes.map((type) => (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setSelectedType(type.id)}
                        className={`p-4 rounded-lg border text-center transition-all ${
                          selectedType === type.id
                            ? "border-gold bg-gold/10 text-foreground shadow-sm"
                            : "border-border text-muted-foreground hover:border-gold/50 hover:bg-muted/50"
                        }`}
                      >
                        <type.icon className={`w-5 h-5 mx-auto mb-2 ${
                          selectedType === type.id ? "text-gold" : ""
                        }`} />
                        <span className="text-xs font-medium block">{type.label}</span>
                        <span className="text-[10px] text-muted-foreground mt-1 block">{type.description}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name <span className="text-destructive">*</span></Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Your full name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        disabled={isSubmitting}
                        maxLength={100}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address <span className="text-destructive">*</span></Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        disabled={isSubmitting}
                        maxLength={255}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+251 9XX XXX XXX"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        disabled={isSubmitting}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        type="text"
                        placeholder="Brief topic of your inquiry"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        disabled={isSubmitting}
                        maxLength={200}
                      />
                    </div>
                  </div>

                  {/* Conditional fields for event/reservation */}
                  {(selectedType === "event" || selectedType === "reservation") && (
                    <div className="grid md:grid-cols-2 gap-6 p-4 bg-muted/50 rounded-lg border border-border/50">
                      <div className="space-y-2">
                        <Label htmlFor="eventDate">Preferred Date</Label>
                        <Input
                          id="eventDate"
                          type="date"
                          value={formData.eventDate}
                          onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                          disabled={isSubmitting}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="guestCount">Number of Guests</Label>
                        <Input
                          id="guestCount"
                          type="number"
                          min="1"
                          placeholder="Expected number of guests"
                          value={formData.guestCount}
                          onChange={(e) => setFormData({ ...formData, guestCount: e.target.value })}
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="message">Message <span className="text-destructive">*</span></Label>
                    <Textarea
                      id="message"
                      placeholder="Please describe your inquiry in detail. Include any specific requirements, questions, or information that would help us assist you better..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={5}
                      required
                      disabled={isSubmitting}
                      maxLength={2000}
                    />
                    <p className="text-xs text-muted-foreground">
                      {formData.message.length}/2000 characters
                    </p>
                  </div>

                  <Button 
                    type="submit" 
                    variant="gold" 
                    size="lg" 
                    className="w-full" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-24 bg-card">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <p className="text-gold uppercase tracking-[0.3em] text-sm mb-4">
              Find Us
            </p>
            <h2 className="font-display text-4xl md:text-5xl text-foreground mb-6">
              Location
            </h2>
            <p className="text-muted-foreground">
              Located in the heart of Debre Markos, we're easily accessible from the main road 
              and just a short drive from the bus station.
            </p>
          </div>

          {/* Map Placeholder */}
          <div className="aspect-[16/9] max-h-[500px] rounded-lg overflow-hidden shadow-elevated bg-muted flex items-center justify-center">
            <div className="text-center p-8">
              <MapPin className="w-12 h-12 text-gold mx-auto mb-4" />
              <p className="font-display text-2xl text-foreground mb-2">Meskerem Hotel</p>
              <p className="text-muted-foreground">Main Street, Debre Markos, Ethiopia</p>
              <a
                href="https://maps.google.com/?q=Debre+Markos+Ethiopia"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-4"
              >
                <Button variant="outline" size="sm">
                  Open in Google Maps
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Contact;