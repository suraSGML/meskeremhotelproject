import { Link } from "react-router-dom";
import { Utensils, UtensilsCrossed, Sparkles, Plane, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const services = [
  {
    name: "Restaurant Reservation",
    description: "Experience authentic Ethiopian cuisine in our elegant restaurant. Reserve your table for lunch or dinner.",
    icon: Utensils,
    href: "/table-booking",
    color: "from-amber-500 to-orange-600",
  },
  {
    name: "Room Service",
    description: "Order delicious meals delivered directly to your room. Available 24/7 for your convenience.",
    icon: UtensilsCrossed,
    href: "/room-service",
    color: "from-rose-500 to-pink-600",
  },
  {
    name: "Spa & Wellness",
    description: "Rejuvenate with our signature Ethiopian spa treatments. Massages, facials, and more await you.",
    icon: Sparkles,
    href: "/spa",
    color: "from-teal-500 to-cyan-600",
  },
  {
    name: "Airport Transfer",
    description: "Comfortable transportation to and from Bole International Airport. Meet & greet service included.",
    icon: Plane,
    href: "/airport-transfer",
    color: "from-blue-500 to-indigo-600",
  },
];

const ServicesSection = () => {
  return (
    <section className="py-24 bg-muted/30 ethiopian-pattern">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-sm font-medium tracking-widest text-secondary uppercase mb-4">
            Guest Services
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-6">
            Elevate Your Stay
          </h2>
          <p className="text-muted-foreground text-lg">
            From dining reservations to airport transfers, we offer a complete range of services 
            to make your experience truly exceptional.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <Link key={service.name} to={service.href}>
              <Card 
                className="group h-full overflow-hidden hover:shadow-elevated transition-all duration-500 cursor-pointer"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-0">
                  <div className={`h-32 bg-gradient-to-br ${service.color} flex items-center justify-center`}>
                    <service.icon className="w-12 h-12 text-white opacity-90 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div className="p-6">
                    <h3 className="font-display font-semibold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
                      {service.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                      {service.description}
                    </p>
                    <div className="flex items-center text-sm font-medium text-primary group-hover:text-secondary transition-colors">
                      <span>Learn More</span>
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            All services can be paid using Ethiopian payment methods
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm font-medium">
            <span className="px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
              Telebirr
            </span>
            <span className="px-4 py-2 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
              CBE Birr
            </span>
            <span className="px-4 py-2 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300">
              Amole
            </span>
            <span className="px-4 py-2 rounded-full bg-primary/10 text-primary">
              Bank Transfer
            </span>
            <span className="px-4 py-2 rounded-full bg-muted text-muted-foreground">
              Pay at Hotel
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;