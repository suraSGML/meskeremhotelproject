import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer id="about" className="bg-primary text-primary-foreground">
      {/* About Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-16">
          {/* Story */}
          <div className="space-y-6">
            <p className="text-gold uppercase tracking-[0.3em] text-sm">Our Story</p>
            <h2 className="font-display text-4xl md:text-5xl">
              The Spirit of Meskerem
            </h2>
            <div className="space-y-4 text-primary-foreground/80 leading-relaxed">
              <p>
                Named after the Ethiopian month of spring—a time of renewal, celebration, 
                and new beginnings—Meskerem Hotel embodies the vibrant spirit of Gojjam's 
                rich cultural heritage.
              </p>
              <p>
                For over 15 years, we have been the guardian of traditions, hosting 
                countless weddings, reunions, and milestone celebrations. Our walls echo 
                with laughter, music, and the warmth of Ethiopian hospitality.
              </p>
              <p>
                Every corner of our hotel tells a story—from the traditional Habesha 
                artwork adorning our halls to the aromatic bunna ceremonies that welcome 
                our guests each morning.
              </p>
            </div>
          </div>

          {/* Contact Card */}
          <div className="bg-primary-foreground/5 p-8 rounded-sm border border-primary-foreground/10">
            <h3 className="font-display text-2xl mb-6">Visit Us</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <MapPin className="w-5 h-5 text-gold mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium">Meskerem Hotel</p>
                  <p className="text-primary-foreground/70 text-sm">
                    Main Street, Debre Markos<br />
                    Gojjam Region, Ethiopia
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Phone className="w-5 h-5 text-gold flex-shrink-0" />
                <div>
                  <p className="font-medium">+251 912 345 678</p>
                  <p className="text-primary-foreground/70 text-sm">
                    +251 587 123 456
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Mail className="w-5 h-5 text-gold flex-shrink-0" />
                <p className="font-medium">reservations@meskeremhotel.com</p>
              </div>
              <div className="flex items-center gap-4">
                <Clock className="w-5 h-5 text-gold flex-shrink-0" />
                <div>
                  <p className="font-medium">24/7 Reception</p>
                  <p className="text-primary-foreground/70 text-sm">
                    Check-in: 14:00 • Check-out: 12:00
                  </p>
                </div>
              </div>
            </div>
            <Button variant="hero" size="lg" className="w-full mt-6">
              Get Directions
            </Button>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-primary-foreground/10 pt-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-gold flex items-center justify-center">
                <span className="font-display text-lg font-bold text-espresso">M</span>
              </div>
              <div className="flex flex-col">
                <span className="font-display text-xl font-semibold tracking-wide">
                  Meskerem
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] -mt-1 text-primary-foreground/60">
                  Hotel & Events
                </span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full border border-primary-foreground/20 flex items-center justify-center hover:bg-gold hover:border-gold hover:text-espresso transition-all"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full border border-primary-foreground/20 flex items-center justify-center hover:bg-gold hover:border-gold hover:text-espresso transition-all"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full border border-primary-foreground/20 flex items-center justify-center hover:bg-gold hover:border-gold hover:text-espresso transition-all"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>

            {/* Copyright */}
            <p className="text-sm text-primary-foreground/50">
              © {new Date().getFullYear()} Meskerem Hotel. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
