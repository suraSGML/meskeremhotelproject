import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Clock, Users, Compass, Music, Utensils, Camera, Mountain, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import { supabase } from "@/integrations/supabase/client";
import eventGarden from "@/assets/event-garden.jpg";

interface Experience {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  short_description: string | null;
  category: string | null;
  image_url: string | null;
  price: number | null;
  duration: string | null;
  is_active: boolean;
}

// Icon mapping for categories
const categoryIcons: Record<string, typeof Compass> = {
  'Tours': Compass,
  'Heritage': Compass,
  'Cultural': Music,
  'Dining': Utensils,
  'Photography': Camera,
  'Adventure': Mountain,
  'Wellness': Heart,
};

const getIconForCategory = (category: string | null) => {
  if (!category) return Compass;
  for (const [key, icon] of Object.entries(categoryIcons)) {
    if (category.toLowerCase().includes(key.toLowerCase())) {
      return icon;
    }
  }
  return Compass;
};

const Experiences = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const { data, error } = await supabase
          .from('experiences')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setExperiences(data || []);
      } catch (error) {
        console.error('Error fetching experiences:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  const formatPrice = (price: number | null) => {
    if (!price) return 'Complimentary';
    return `From $${price}`;
  };

  return (
    <main className="min-h-screen">
      <Navbar />
      
      <PageHeader
        title="Curated Experiences"
        subtitle="Beyond The Stay"
        description="Immerse yourself in the rich tapestry of Ethiopian culture through carefully crafted experiences."
      />

      {/* Experiences Grid */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6">
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-card rounded-lg overflow-hidden shadow-soft">
                  <Skeleton className="aspect-[16/10]" />
                  <div className="p-6 space-y-4">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : experiences.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>No experiences available at the moment. Please check back later.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {experiences.map((experience) => {
                const IconComponent = getIconForCategory(experience.category);
                
                return (
                  <div
                    key={experience.id}
                    className="group bg-card rounded-lg overflow-hidden shadow-soft hover:shadow-elevated transition-all duration-500"
                  >
                    {/* Image */}
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <img
                        src={experience.image_url || eventGarden}
                        alt={experience.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = eventGarden;
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-transparent to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <p className="text-gold text-xs uppercase tracking-wider">{experience.category || 'Experience'}</p>
                        <h3 className="font-display text-2xl text-cream">{experience.name}</h3>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-4">
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {experience.short_description || experience.description}
                      </p>

                      {/* Meta */}
                      <div className="flex flex-wrap gap-4 text-sm">
                        {experience.duration && (
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Clock className="w-4 h-4 text-gold" />
                            <span>{experience.duration}</span>
                          </div>
                        )}
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        <span className="font-display text-xl text-gold">
                          {formatPrice(experience.price)}
                        </span>
                        <Link to="/contact">
                          <Button variant="ghost" size="sm" className="group/btn text-foreground hover:text-gold">
                            Book Now
                            <ArrowRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Custom Experiences CTA */}
      <section className="py-24 bg-muted">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto bg-background rounded-lg shadow-elevated overflow-hidden">
            <div className="grid md:grid-cols-2">
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <p className="text-gold uppercase tracking-[0.3em] text-sm mb-4">
                  Bespoke Experiences
                </p>
                <h2 className="font-display text-3xl md:text-4xl text-foreground mb-4">
                  Create Your Own Adventure
                </h2>
                <p className="text-muted-foreground mb-8">
                  Our concierge team can craft personalized experiences tailored to your interests, 
                  from private tours to exclusive cultural events.
                </p>
                <Link to="/contact">
                  <Button variant="gold" size="lg" className="group w-fit">
                    Contact Concierge
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
              <div className="aspect-square md:aspect-auto">
                <img
                  src={eventGarden}
                  alt="Custom experiences"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Experiences;
