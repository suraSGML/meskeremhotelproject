import { Link } from "react-router-dom";
import { ArrowRight, Wifi, Coffee, Bath, Mountain, Tv, Wind, Users, Check, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import suiteImage from "@/assets/suite-presidential.jpg";

const rooms = [
  {
    id: "deluxe",
    name: "Deluxe Room",
    description: "A comfortable retreat featuring traditional Ethiopian textiles and modern comforts. Wake to garden views and the aroma of fresh coffee.",
    price: 120,
    size: "35 sqm",
    guests: 2,
    features: ["King Bed", "Garden View", "Rain Shower", "Work Desk", "Mini Bar", "Smart TV"],
    image: suiteImage,
  },
  {
    id: "executive",
    name: "Executive Suite",
    description: "Elevated luxury with a separate living area. Perfect for business travelers or couples seeking extra space and premium amenities.",
    price: 180,
    size: "55 sqm",
    guests: 2,
    features: ["King Bed", "Living Room", "Bathtub & Shower", "Nespresso Machine", "Executive Lounge Access", "Mountain View"],
    image: suiteImage,
  },
  {
    id: "presidential",
    name: "Presidential Suite",
    description: "Our most distinguished accommodation featuring handcrafted Ethiopian furnishings, a private terrace, and butler service.",
    price: 350,
    size: "120 sqm",
    guests: 4,
    features: ["Master Bedroom", "Private Terrace", "Dining Area", "Butler Service", "Jacuzzi", "Panoramic Views"],
    image: suiteImage,
    featured: true,
  },
];

const amenities = [
  { icon: Wifi, label: "High-Speed WiFi" },
  { icon: Coffee, label: "Ethiopian Coffee Set" },
  { icon: Bath, label: "Luxury Bathroom" },
  { icon: Mountain, label: "Scenic Views" },
  { icon: Tv, label: "Smart TV" },
  { icon: Wind, label: "Climate Control" },
];

const Accommodations = () => {
  return (
    <main className="min-h-screen">
      <Navbar />
      
      <PageHeader
        title="Luxury Accommodations"
        subtitle="Refined Comfort"
        description="Each suite is a sanctuary of comfort, blending Ethiopian craftsmanship with modern luxury."
        backgroundImage={suiteImage}
      />

      {/* Rooms Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-gold uppercase tracking-[0.3em] text-sm mb-4">
              Our Rooms
            </p>
            <h2 className="font-display text-4xl md:text-5xl text-foreground mb-6">
              Choose Your Sanctuary
            </h2>
          </div>

          <div className="space-y-16">
            {rooms.map((room, index) => (
              <div
                key={room.id}
                className={`grid lg:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? "lg:grid-flow-dense" : ""
                }`}
              >
                {/* Image */}
                <div className={`relative group ${index % 2 === 1 ? "lg:col-start-2" : ""}`}>
                  <div className="aspect-[4/3] rounded-lg overflow-hidden shadow-elevated">
                    <img
                      src={room.image}
                      alt={room.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  {room.featured && (
                    <div className="absolute top-6 left-6 bg-gold text-espresso px-4 py-2 rounded-full flex items-center gap-2">
                      <Star className="w-4 h-4" />
                      <span className="text-sm font-medium">Featured</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center gap-4 mb-3">
                      <span className="text-sm text-muted-foreground">{room.size}</span>
                      <span className="text-border">•</span>
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        Up to {room.guests} guests
                      </span>
                    </div>
                    <h3 className="font-display text-3xl text-foreground mb-4">
                      {room.name}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {room.description}
                    </p>
                  </div>

                  {/* Features */}
                  <div className="grid grid-cols-2 gap-3">
                    {room.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-foreground">
                        <Check className="w-4 h-4 text-gold flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Price & CTA */}
                  <div className="flex flex-wrap items-center gap-6 pt-4">
                    <div>
                      <p className="text-sm text-muted-foreground">From</p>
                      <p className="font-display text-3xl text-foreground">
                        ${room.price}
                        <span className="text-lg text-muted-foreground font-body"> /night</span>
                      </p>
                    </div>
                    <Link to="/contact">
                      <Button variant="gold" size="lg" className="group">
                        Reserve Now
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Amenities Section */}
      <section className="py-24 bg-card">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-gold uppercase tracking-[0.3em] text-sm mb-4">
              In Every Room
            </p>
            <h2 className="font-display text-4xl md:text-5xl text-foreground mb-6">
              Premium Amenities
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {amenities.map((amenity, index) => (
              <div
                key={index}
                className="bg-background p-6 rounded-lg text-center hover:shadow-soft transition-shadow"
              >
                <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-4">
                  <amenity.icon className="w-6 h-6 text-gold" />
                </div>
                <p className="text-sm text-foreground font-medium">{amenity.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 geometric-pattern opacity-20" />
        <div className="container mx-auto px-6 relative text-center">
          <h2 className="font-display text-4xl md:text-5xl mb-6">
            Experience Ethiopian Hospitality
          </h2>
          <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto mb-10">
            Book directly for the best rates and exclusive benefits including welcome amenities and late checkout.
          </p>
          <Link to="/contact">
            <Button variant="hero" size="xl" className="group">
              Check Availability
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Accommodations;