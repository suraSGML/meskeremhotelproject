import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Wifi, Coffee, Bath, Mountain, Tv, Wind, Users, Check, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import { supabase } from "@/integrations/supabase/client";
import suiteImage from "@/assets/suite-presidential.jpg";

interface Room {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  short_description: string | null;
  room_type: string;
  price_per_night: number;
  max_guests: number;
  size_sqm: number | null;
  amenities: string[] | null;
  featured_image: string | null;
  images: string[] | null;
  is_active: boolean;
}

const amenityIcons = [
  { icon: Wifi, label: "High-Speed WiFi" },
  { icon: Coffee, label: "Ethiopian Coffee Set" },
  { icon: Bath, label: "Luxury Bathroom" },
  { icon: Mountain, label: "Scenic Views" },
  { icon: Tv, label: "Smart TV" },
  { icon: Wind, label: "Climate Control" },
];

const Accommodations = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const { data, error } = await supabase
          .from('rooms')
          .select('*')
          .eq('is_active', true)
          .order('price_per_night', { ascending: true });

        if (error) throw error;
        setRooms(data || []);
      } catch (error) {
        console.error('Error fetching rooms:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRooms();
  }, []);

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

          {isLoading ? (
            <div className="space-y-16">
              {[1, 2, 3].map((i) => (
                <div key={i} className="grid lg:grid-cols-2 gap-12 items-center">
                  <Skeleton className="aspect-[4/3] rounded-lg" />
                  <div className="space-y-4">
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : rooms.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>No rooms available at the moment. Please check back later.</p>
            </div>
          ) : (
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
                        src={room.featured_image || suiteImage}
                        alt={room.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = suiteImage;
                        }}
                      />
                    </div>
                    {room.room_type === 'presidential' && (
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
                        {room.size_sqm && (
                          <>
                            <span className="text-sm text-muted-foreground">{room.size_sqm} sqm</span>
                            <span className="text-border">•</span>
                          </>
                        )}
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          Up to {room.max_guests} guests
                        </span>
                      </div>
                      <h3 className="font-display text-3xl text-foreground mb-4">
                        {room.name}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {room.description || room.short_description}
                      </p>
                    </div>

                    {/* Features */}
                    {room.amenities && room.amenities.length > 0 && (
                      <div className="grid grid-cols-2 gap-3">
                        {room.amenities.slice(0, 6).map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm text-foreground">
                            <Check className="w-4 h-4 text-gold flex-shrink-0" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Price & CTA */}
                    <div className="flex flex-wrap items-center gap-6 pt-4">
                      <div>
                        <p className="text-sm text-muted-foreground">From</p>
                        <p className="font-display text-3xl text-foreground">
                          ${room.price_per_night}
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
          )}
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
            {amenityIcons.map((amenity, index) => (
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
