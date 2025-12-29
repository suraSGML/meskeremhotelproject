import { useState } from "react";
import { ArrowRight, Users, Calendar, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import ballroomImage from "@/assets/event-ballroom.jpg";
import gardenImage from "@/assets/event-garden.jpg";

const eventSpaces = [
  {
    id: 1,
    name: "Grand Ballroom",
    subtitle: "The Crown Jewel",
    description:
      "An opulent 800 sqm ballroom adorned with crystal chandeliers and traditional Ethiopian motifs. Perfect for grand weddings and galas accommodating up to 500 guests.",
    capacity: "Up to 500 Guests",
    features: ["Crystal Chandeliers", "Built-in Stage", "Private Bridal Suite"],
    image: ballroomImage,
  },
  {
    id: 2,
    name: "Garden Terrace",
    subtitle: "Under the Stars",
    description:
      "A breathtaking outdoor venue with panoramic views of the Gojjam highlands. Ideal for romantic sunset ceremonies and intimate celebrations.",
    capacity: "Up to 200 Guests",
    features: ["Mountain Views", "String Lighting", "Garden Backdrop"],
    image: gardenImage,
  },
];

const EventsSection = () => {
  const [activeSpace, setActiveSpace] = useState(eventSpaces[0]);

  return (
    <section id="events" className="py-24 bg-card relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 meskel-pattern" />

      <div className="container mx-auto px-6 relative">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-gold uppercase tracking-[0.3em] text-sm mb-4">
            Celebrate With Us
          </p>
          <h2 className="font-display text-4xl md:text-5xl text-foreground mb-6">
            Extraordinary Event Spaces
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            From intimate gatherings to grand celebrations, our meticulously designed 
            venues provide the perfect canvas for your most cherished moments.
          </p>
        </div>

        {/* Event Spaces Showcase */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="relative group">
            <div className="aspect-[4/3] rounded-sm overflow-hidden shadow-elevated">
              <img
                src={activeSpace.image}
                alt={activeSpace.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            {/* Floating Badge */}
            <div className="absolute -bottom-6 -right-6 bg-primary text-primary-foreground px-6 py-4 rounded-sm shadow-elevated">
              <p className="text-sm font-medium">{activeSpace.capacity}</p>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-8">
            {/* Tabs */}
            <div className="flex gap-4">
              {eventSpaces.map((space) => (
                <button
                  key={space.id}
                  onClick={() => setActiveSpace(space)}
                  className={`px-6 py-3 text-sm font-medium transition-all duration-300 border-b-2 ${
                    activeSpace.id === space.id
                      ? "border-gold text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {space.name}
                </button>
              ))}
            </div>

            {/* Active Space Details */}
            <div className="space-y-6">
              <div>
                <p className="text-gold uppercase tracking-wider text-sm mb-2">
                  {activeSpace.subtitle}
                </p>
                <h3 className="font-display text-3xl text-foreground mb-4">
                  {activeSpace.name}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {activeSpace.description}
                </p>
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-4">
                {activeSpace.features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 text-sm text-foreground"
                  >
                    <Sparkles className="w-4 h-4 text-gold" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              {/* Stats */}
              <div className="flex gap-8 pt-6 border-t border-border">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-gold" />
                  <div>
                    <p className="font-display text-xl text-foreground">500+</p>
                    <p className="text-xs text-muted-foreground">Weddings Hosted</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gold" />
                  <div>
                    <p className="font-display text-xl text-foreground">15+</p>
                    <p className="text-xs text-muted-foreground">Years of Excellence</p>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="flex gap-4 pt-4">
                <Button variant="gold" size="lg" className="group">
                  Request Event Brochure
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button variant="outline" size="lg">
                  Schedule a Tour
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventsSection;
