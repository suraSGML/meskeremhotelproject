import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone, User, LogOut, Settings, CalendarDays, ChevronDown, Utensils, Sparkles, Plane, UtensilsCrossed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";
  const { user, isAdmin, signOut, isLoading } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const mainNavLinks = [
    { name: "Accommodations", href: "/accommodations" },
    { name: "Dining", href: "/dining" },
    { name: "Events", href: "/events" },
    { name: "Experiences", href: "/experiences" },
    { name: "About", href: "/about" },
  ];

  const serviceLinks = [
    { name: "Reserve a Table", href: "/table-booking", icon: Utensils, description: "Book a table at our restaurant" },
    { name: "Room Service", href: "/room-service", icon: UtensilsCrossed, description: "Order food to your room" },
    { name: "Spa & Wellness", href: "/spa", icon: Sparkles, description: "Relaxing spa treatments" },
    { name: "Airport Transfer", href: "/airport-transfer", icon: Plane, description: "Pickup & drop-off service" },
  ];

  const showTransparent = isHome && !isScrolled;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        showTransparent
          ? "bg-transparent py-5"
          : "bg-background/95 backdrop-blur-md shadow-soft py-3"
      }`}
    >
      <nav className="container mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-full bg-gradient-gold flex items-center justify-center">
            <span className="font-display text-lg font-bold text-primary-foreground">M</span>
          </div>
          <div className="flex flex-col">
            <span className={`font-display text-xl font-semibold tracking-wide transition-colors ${
              showTransparent ? "text-cream" : "text-foreground"
            }`}>
              Meskerem
            </span>
            <span className={`text-[10px] uppercase tracking-[0.2em] -mt-1 transition-colors ${
              showTransparent ? "text-cream/70" : "text-muted-foreground"
            }`}>
              Hotel & Events
            </span>
          </div>
        </Link>

        <div className="hidden lg:flex items-center gap-6">
          {mainNavLinks.slice(0, 2).map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className={`text-sm font-medium tracking-wide transition-all duration-300 hover:text-gold relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-gold after:transition-all after:duration-300 hover:after:w-full ${
                showTransparent ? "text-cream" : "text-foreground"
              } ${location.pathname === link.href ? "text-gold after:w-full" : ""}`}
            >
              {link.name}
            </Link>
          ))}

          {/* Services Dropdown */}
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className={cn(
                  "bg-transparent text-sm font-medium tracking-wide transition-all duration-300 hover:text-gold hover:bg-transparent focus:bg-transparent data-[state=open]:bg-transparent",
                  showTransparent ? "text-cream" : "text-foreground"
                )}>
                  Services
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                    {serviceLinks.map((service) => (
                      <li key={service.name}>
                        <NavigationMenuLink asChild>
                          <Link
                            to={service.href}
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="flex items-center gap-2">
                              <service.icon className="w-4 h-4 text-secondary" />
                              <div className="text-sm font-medium leading-none">{service.name}</div>
                            </div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground mt-1">
                              {service.description}
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {mainNavLinks.slice(2).map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className={`text-sm font-medium tracking-wide transition-all duration-300 hover:text-gold relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-gold after:transition-all after:duration-300 hover:after:w-full ${
                showTransparent ? "text-cream" : "text-foreground"
              } ${location.pathname === link.href ? "text-gold after:w-full" : ""}`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-4">
          <a
            href="tel:+251912345678"
            className={`flex items-center gap-2 text-sm transition-colors ${
              showTransparent ? "text-cream" : "text-foreground"
            }`}
          >
            <Phone className="w-4 h-4" />
            <span className="font-medium">+251 912 345 678</span>
          </a>
          
          {!isLoading && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant={showTransparent ? "hero" : "outline"} size="default" className="gap-2">
                  <User className="w-4 h-4" />
                  {user.email?.split('@')[0]}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link to="/my-bookings" className="flex items-center gap-2 cursor-pointer">
                    <CalendarDays className="w-4 h-4" />
                    My Bookings
                  </Link>
                </DropdownMenuItem>
                {isAdmin && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="flex items-center gap-2 cursor-pointer">
                        <Settings className="w-4 h-4" />
                        Admin Dashboard
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => signOut()} 
                  className="flex items-center gap-2 cursor-pointer text-destructive"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/auth">
              <Button variant={showTransparent ? "hero" : "gold"} size="default">
                Sign In
              </Button>
            </Link>
          )}
        </div>

        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className={`lg:hidden p-2 transition-colors ${
            showTransparent ? "text-cream" : "text-foreground"
          }`}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      <div
        className={`lg:hidden fixed inset-0 top-[72px] bg-background/98 backdrop-blur-lg transition-all duration-500 overflow-y-auto ${
          isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="container mx-auto px-6 py-8 flex flex-col gap-6">
          {mainNavLinks.map((link, index) => (
            <Link
              key={link.name}
              to={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-xl font-display text-foreground hover:text-gold transition-colors animate-fade-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {link.name}
            </Link>
          ))}
          
          <div className="border-t border-border pt-4">
            <p className="text-sm font-semibold text-muted-foreground mb-4">Services</p>
            <div className="grid grid-cols-2 gap-3">
              {serviceLinks.map((service) => (
                <Link
                  key={service.name}
                  to={service.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <service.icon className="w-5 h-5 text-secondary" />
                  <span className="text-sm font-medium">{service.name}</span>
                </Link>
              ))}
            </div>
          </div>
          
          <div className="pt-4 border-t border-border flex flex-col gap-4">
            <a href="tel:+251912345678" className="flex items-center gap-2 text-muted-foreground">
              <Phone className="w-5 h-5" />
              <span>+251 912 345 678</span>
            </a>
            {!isLoading && user ? (
              <>
                <Link to="/my-bookings" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="outline" size="lg" className="w-full gap-2">
                    <CalendarDays className="w-4 h-4" />
                    My Bookings
                  </Button>
                </Link>
                {isAdmin && (
                  <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="outline" size="lg" className="w-full gap-2">
                      <Settings className="w-4 h-4" />
                      Admin Dashboard
                    </Button>
                  </Link>
                )}
                <Button 
                  variant="destructive" 
                  size="lg" 
                  className="w-full gap-2"
                  onClick={() => {
                    signOut();
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </Button>
              </>
            ) : (
              <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="gold" size="lg" className="w-full">Sign In</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;