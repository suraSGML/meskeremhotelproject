import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar, Users, Mail, Phone, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const eventTypes = ["Wedding Reception", "Corporate Conference", "Birthday Celebration", "Anniversary Party", "Engagement Ceremony", "Traditional Ceremony", "Other"];
const guestRanges = ["Less than 50", "50 - 100", "100 - 200", "200 - 350", "350 - 500", "More than 500"];

const EventInquiryForm = () => {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ eventType: "", guestCount: "", eventDate: "", name: "", email: "", phone: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Inquiry Received!", description: "Our events team will contact you within 24 hours." });
    setStep(1);
    setFormData({ eventType: "", guestCount: "", eventDate: "", name: "", email: "", phone: "", message: "" });
  };

  return (
    <section id="inquiry" className="py-24 bg-card relative">
      <div className="absolute inset-0 meskel-pattern opacity-50" />
      <div className="container mx-auto px-6 relative">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-gold uppercase tracking-[0.3em] text-sm mb-4">Plan Your Event</p>
            <h2 className="font-display text-4xl md:text-5xl text-foreground mb-6">Let's Create Magic Together</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Share your vision with us, and our dedicated events team will craft an unforgettable experience.
            </p>
          </div>

          <div className="flex items-center justify-center gap-4 mb-12">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-display text-lg transition-all ${step >= s ? "bg-gold text-espresso" : "bg-muted text-muted-foreground"}`}>{s}</div>
                {s < 3 && <div className={`w-16 h-0.5 transition-all ${step > s ? "bg-gold" : "bg-muted"}`} />}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="bg-background p-8 md:p-12 rounded-lg shadow-elevated">
            {step === 1 && (
              <div className="space-y-8 animate-fade-up">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-4">What type of event are you planning?</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {eventTypes.map((type) => (
                      <button key={type} type="button" onClick={() => setFormData({ ...formData, eventType: type })}
                        className={`p-4 text-sm border rounded-lg transition-all ${formData.eventType === type ? "border-gold bg-gold/10 text-foreground" : "border-border text-muted-foreground hover:border-gold/50"}`}>
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-4"><Users className="w-4 h-4 inline mr-2" />Expected number of guests</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {guestRanges.map((range) => (
                      <button key={range} type="button" onClick={() => setFormData({ ...formData, guestCount: range })}
                        className={`p-4 text-sm border rounded-lg transition-all ${formData.guestCount === range ? "border-gold bg-gold/10 text-foreground" : "border-border text-muted-foreground hover:border-gold/50"}`}>
                        {range}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-4"><Calendar className="w-4 h-4 inline mr-2" />Preferred event date</label>
                  <Input type="date" value={formData.eventDate} onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })} className="max-w-xs" />
                </div>
                <div className="flex justify-end">
                  <Button type="button" variant="gold" size="lg" onClick={() => setStep(2)} disabled={!formData.eventType || !formData.guestCount} className="group">
                    Continue<ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-8 animate-fade-up">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Your Full Name</label>
                    <Input type="text" placeholder="Enter your name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2"><Mail className="w-4 h-4 inline mr-1" />Email Address</label>
                    <Input type="email" placeholder="your@email.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2"><Phone className="w-4 h-4 inline mr-1" />Phone Number</label>
                  <Input type="tel" placeholder="+251 9XX XXX XXX" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="max-w-xs" required />
                </div>
                <div className="flex justify-between">
                  <Button type="button" variant="outline" size="lg" onClick={() => setStep(1)}>Back</Button>
                  <Button type="button" variant="gold" size="lg" onClick={() => setStep(3)} disabled={!formData.name || !formData.email || !formData.phone} className="group">
                    Continue<ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-8 animate-fade-up">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2"><MessageSquare className="w-4 h-4 inline mr-1" />Tell us about your vision</label>
                  <Textarea placeholder="Share any specific requirements, themes, or questions..." value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} rows={5} />
                </div>
                <div className="p-6 bg-muted rounded-lg">
                  <p className="text-sm font-medium text-foreground mb-4">Event Summary</p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><p className="text-muted-foreground">Event Type</p><p className="text-foreground font-medium">{formData.eventType}</p></div>
                    <div><p className="text-muted-foreground">Guest Count</p><p className="text-foreground font-medium">{formData.guestCount}</p></div>
                    <div><p className="text-muted-foreground">Preferred Date</p><p className="text-foreground font-medium">{formData.eventDate || "Flexible"}</p></div>
                    <div><p className="text-muted-foreground">Contact</p><p className="text-foreground font-medium">{formData.name}</p></div>
                  </div>
                </div>
                <div className="flex justify-between">
                  <Button type="button" variant="outline" size="lg" onClick={() => setStep(2)}>Back</Button>
                  <Button type="submit" variant="gold" size="lg" className="group">Submit Inquiry<ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></Button>
                </div>
              </div>
            )}
          </form>

          <p className="text-center text-muted-foreground text-sm mt-8">
            Prefer to speak directly? <Link to="/contact" className="text-gold hover:underline">Contact us</Link> or call +251 912 345 678
          </p>
        </div>
      </div>
    </section>
  );
};

export default EventInquiryForm;