import { ArrowRight, Clock, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import diningImage from "@/assets/dining-restaurant.jpg";

const menuHighlights = [
  {
    name: "Doro Wot",
    description: "Slow-cooked chicken in berbere spice sauce",
    price: "450 ETB",
    isSignature: true,
  },
  {
    name: "Kitfo Special",
    description: "Premium minced beef with mitmita and ayib",
    price: "380 ETB",
    isSignature: false,
  },
  {
    name: "Tibs Firfir",
    description: "Sautéed beef with injera and vegetables",
    price: "320 ETB",
    isSignature: false,
  },
  {
    name: "Bunna Ceremony",
    description: "Traditional Ethiopian coffee experience",
    price: "150 ETB",
    isSignature: true,
  },
];

const DiningSection = () => {
  return (
    <section id="dining" className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 ethiopian-pattern" />
      </div>

      <div className="container mx-auto px-6 relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <div className="relative">
            <div className="aspect-square rounded-sm overflow-hidden shadow-elevated">
              <img
                src={diningImage}
                alt="Ethiopian cuisine and traditional coffee ceremony"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Floating Badge */}
            <div className="absolute -top-6 -right-6 bg-gold text-espresso px-6 py-4 rounded-sm shadow-gold hidden lg:block">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5" />
                <span className="font-medium">Chef's Specials</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-8">
            {/* Section Header */}
            <div>
              <p className="text-gold uppercase tracking-[0.3em] text-sm mb-4">
                Culinary Excellence
              </p>
              <h2 className="font-display text-4xl md:text-5xl mb-6">
                A Feast for the Senses
              </h2>
              <p className="text-primary-foreground/80 text-lg leading-relaxed">
                Our award-winning chefs craft authentic Gojjam and Amhara cuisine 
                alongside international favorites. Every dish tells a story of 
                Ethiopia's rich culinary heritage.
              </p>
            </div>

            {/* Operating Hours */}
            <div className="flex items-center gap-4 p-4 border border-primary-foreground/20 rounded-sm">
              <Clock className="w-5 h-5 text-gold" />
              <div>
                <p className="font-medium">Restaurant Hours</p>
                <p className="text-sm text-primary-foreground/70">
                  Breakfast 6:30–10:30 • Lunch 12:00–15:00 • Dinner 18:00–22:30
                </p>
              </div>
            </div>

            {/* Menu Highlights */}
            <div className="space-y-4">
              <p className="text-sm text-gold uppercase tracking-wider">
                Menu Highlights
              </p>
              <div className="space-y-3">
                {menuHighlights.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start justify-between p-4 bg-primary-foreground/5 rounded-sm hover:bg-primary-foreground/10 transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-display text-lg">{item.name}</span>
                        {item.isSignature && (
                          <span className="text-xs bg-gold text-espresso px-2 py-0.5 rounded-sm">
                            Signature
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-primary-foreground/60 mt-1">
                        {item.description}
                      </p>
                    </div>
                    <span className="text-gold font-medium whitespace-nowrap ml-4">
                      {item.price}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="flex gap-4">
              <Button variant="hero" size="lg" className="group">
                View Full Menu
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="heroOutline" size="lg">
                Book a Table
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DiningSection;
