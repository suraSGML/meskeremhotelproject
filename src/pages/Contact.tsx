import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send, MessageCircle, Calendar, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";

const inquiryTypes = [
  { id: "general", label: "General Inquiry", icon: MessageCircle },
  { id: "reservation", label: "Room Reservation", icon: Calendar },
  { id: "event", label: "Event/Wedding", icon: Users },
  { id: "dining", label: "Restaurant Booking", icon: Calendar },
];

const Contact = () => {
  const { toast } = useToast();
  const [selectedType, setSelectedType] = useState("general");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    eventDate: "",
    guestCount: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
                  <label className="block text-sm font-medium text-foreground mb-4">
                    What can we help you with?
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {inquiryTypes.map((type) => (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setSelectedType(type.id)}
                        className={`p-4 rounded-lg border text-center transition-all ${
                          selectedType === type.id
                            ? "border-gold bg-gold/10 text-foreground"
                            : "border-border text-muted-foreground hover:border-gold/50"
                        }`}
                      >
                        <type.icon className={`w-5 h-5 mx-auto mb-2 ${
                          selectedType === type.id ? "text-gold" : ""
                        }`} />
                        <span className="text-xs font-medium">{type.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Full Name *
                      </label>
                      <Input
                        type="text"
                        placeholder="Your name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Email Address *
                      </label>
                      <Input
                        type="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Phone Number
                      </label>
                      <Input
                        type="tel"
                        placeholder="+251 9XX XXX XXX"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Subject
                      </label>
                      <Input
                        type="text"
                        placeholder="How can we help?"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Conditional fields for event/reservation */}
                  {(selectedType === "event" || selectedType === "reservation") && (
                    <div className="grid md:grid-cols-2 gap-6 p-4 bg-muted rounded-lg">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Preferred Date
                        </label>
                        <Input
                          type="date"
                          value={formData.eventDate}
                          onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Number of Guests
                        </label>
                        <Input
                          type="number"
                          placeholder="Expected guests"
                          value={formData.guestCount}
                          onChange={(e) => setFormData({ ...formData, guestCount: e.target.value })}
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Message *
                    </label>
                    <Textarea
                      placeholder="Tell us more about your inquiry..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={5}
                      required
                    />
                  </div>

                  <Button type="submit" variant="gold" size="lg" className="w-full group">
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
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