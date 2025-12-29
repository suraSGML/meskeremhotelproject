import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Events & Weddings", href: "#events" },
    { name: "Accommodations", href: "#suites" },
    { name: "Dining", href: "#dining" },
    { name: "Experiences", href: "#experiences" },
    { name: "About", href: "#about" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-md shadow-soft py-3"
          : "bg-transparent py-5"
      }`}
    >
      <nav className="container mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-gold flex items-center justify-center">
              <span className="font-display text-lg font-bold text-espresso">M</span>
            </div>
          </div>
          <div className="flex flex-col">
            <span
              className={`font-display text-xl font-semibold tracking-wide transition-colors ${
                isScrolled ? "text-foreground" : "text-cream"
              }`}
            >
              Meskerem
            </span>
            <span
              className={`text-[10px] uppercase tracking-[0.2em] -mt-1 transition-colors ${
                isScrolled ? "text-muted-foreground" : "text-cream/70"
              }`}
            >
              Hotel & Events
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className={`text-sm font-medium tracking-wide transition-all duration-300 hover:text-gold relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-gold after:transition-all after:duration-300 hover:after:w-full ${
                isScrolled ? "text-foreground" : "text-cream"
              }`}
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden lg:flex items-center gap-4">
          <a
            href="tel:+251912345678"
            className={`flex items-center gap-2 text-sm transition-colors ${
              isScrolled ? "text-foreground" : "text-cream"
            }`}
          >
            <Phone className="w-4 h-4" />
            <span className="font-medium">+251 912 345 678</span>
          </a>
          <Button variant={isScrolled ? "gold" : "hero"} size="default">
            Reserve Now
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className={`lg:hidden p-2 transition-colors ${
            isScrolled ? "text-foreground" : "text-cream"
          }`}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden fixed inset-0 top-[72px] bg-background/98 backdrop-blur-lg transition-all duration-500 ${
          isMobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="container mx-auto px-6 py-8 flex flex-col gap-6">
          {navLinks.map((link, index) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-xl font-display text-foreground hover:text-gold transition-colors animate-fade-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {link.name}
            </a>
          ))}
          <div className="pt-6 border-t border-border flex flex-col gap-4">
            <a
              href="tel:+251912345678"
              className="flex items-center gap-2 text-muted-foreground"
            >
              <Phone className="w-5 h-5" />
              <span>+251 912 345 678</span>
            </a>
            <Button variant="gold" size="lg" className="w-full">
              Reserve Now
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
