import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  const navLinks = [
    { name: "Events & Weddings", href: "/events" },
    { name: "Accommodations", href: "/accommodations" },
    { name: "Dining", href: "/dining" },
    { name: "Experiences", href: "/experiences" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-gradient-gold flex items-center justify-center">
                <span className="font-display text-lg font-bold text-espresso">M</span>
              </div>
              <div className="flex flex-col">
                <span className="font-display text-xl font-semibold tracking-wide">Meskerem</span>
                <span className="text-[10px] uppercase tracking-[0.2em] -mt-1 text-primary-foreground/60">Hotel & Events</span>
              </div>
            </div>
            <p className="text-primary-foreground/70 text-sm leading-relaxed">
              Where Ethiopian heritage meets modern luxury. The premier destination for unforgettable celebrations in Debre Markos.
            </p>
          </div>

          <div>
            <h3 className="font-display text-lg mb-6">Quick Links</h3>
            <div className="space-y-3">
              {navLinks.map((link) => (
                <Link key={link.name} to={link.href} className="block text-sm text-primary-foreground/70 hover:text-gold transition-colors">
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-display text-lg mb-6">Contact</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-gold mt-1 flex-shrink-0" />
                <p className="text-sm text-primary-foreground/70">Main Street, Debre Markos, Gojjam, Ethiopia</p>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gold flex-shrink-0" />
                <p className="text-sm text-primary-foreground/70">+251 912 345 678</p>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gold flex-shrink-0" />
                <p className="text-sm text-primary-foreground/70">reservations@meskeremhotel.com</p>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-gold flex-shrink-0" />
                <p className="text-sm text-primary-foreground/70">24/7 Reception</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-display text-lg mb-6">Newsletter</h3>
            <p className="text-sm text-primary-foreground/70 mb-4">Subscribe for exclusive offers and updates.</p>
            <Link to="/contact">
              <Button variant="hero" size="sm" className="w-full">Get in Touch</Button>
            </Link>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            {[Facebook, Instagram, Twitter].map((Icon, i) => (
              <a key={i} href="#" className="w-10 h-10 rounded-full border border-primary-foreground/20 flex items-center justify-center hover:bg-gold hover:border-gold hover:text-espresso transition-all">
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
          <p className="text-sm text-primary-foreground/50">© {new Date().getFullYear()} Meskerem Hotel. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;