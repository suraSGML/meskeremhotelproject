import { ArrowRight, Wifi, Coffee, Bath, Mountain } from "lucide-react";
import { Button } from "@/components/ui/button";
import suiteImage from "@/assets/suite-presidential.jpg";

const amenities = [
  { icon: Wifi, label: "High-Speed WiFi" },
  { icon: Coffee, label: "Ethiopian Coffee Set" },
  { icon: Bath, label: "Luxury Bath" },
  { icon: Mountain, label: "Garden View" },
];

const suites = [
  { name: "Deluxe Room", price: "From $120", size: "35 m²" },
  { name: "Executive Suite", price: "From $180", size: "55 m²" },
  { name: "Presidential Suite", price: "From $350", size: "120 m²" },
];

const AccommodationsSection = () => {
  return (
    <section id="suites" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="order-2 lg:order-1 space-y-8">
            {/* Section Header */}
            <div>
              <p className="text-gold uppercase tracking-[0.3em] text-sm mb-4">
                Refined Comfort
              </p>
              <h2 className="font-display text-4xl md:text-5xl text-foreground mb-6">
                Luxury Accommodations
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Each suite is a sanctuary of comfort, blending Ethiopian craftsmanship 
                with modern luxury. Wake to stunning views and retire in the embrace 
                of handwoven textiles and premium amenities.
              </p>
            </div>

            {/* Amenities */}
            <div className="grid grid-cols-2 gap-4">
              {amenities.map((amenity, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-4 bg-card rounded-sm border border-border hover:border-gold/30 transition-colors"
                >
                  <amenity.icon className="w-5 h-5 text-gold" />
                  <span className="text-sm text-foreground">{amenity.label}</span>
                </div>
              ))}
            </div>

            {/* Suite Types */}
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground uppercase tracking-wider">
                Our Suites
              </p>
              <div className="space-y-3">
                {suites.map((suite, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-muted/50 rounded-sm hover:bg-muted transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <span className="font-display text-lg text-foreground group-hover:text-gold transition-colors">
                        {suite.name}
                      </span>
                      <span className="text-sm text-muted-foreground">{suite.size}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-gold font-medium">{suite.price}</span>
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-gold group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <Button variant="gold" size="lg" className="group">
              View All Rooms
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          {/* Image */}
          <div className="order-1 lg:order-2 relative">
            <div className="aspect-[3/4] rounded-sm overflow-hidden shadow-elevated">
              <img
                src={suiteImage}
                alt="Presidential Suite with Ethiopian textile accents"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Floating Card */}
            <div className="absolute -bottom-8 -left-8 bg-primary text-primary-foreground p-6 rounded-sm shadow-elevated max-w-xs hidden lg:block">
              <p className="font-display text-2xl mb-2">Presidential Suite</p>
              <p className="text-sm text-primary-foreground/80">
                Experience unparalleled luxury with 120 m² of refined living space.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AccommodationsSection;
