import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Clock, Flame, Star, Coffee, Wine, UtensilsCrossed, Leaf, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import { supabase } from "@/integrations/supabase/client";
import diningImage from "@/assets/dining-restaurant.jpg";

interface MenuCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  display_order: number;
}

interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category_id: string | null;
  is_vegetarian: boolean;
  is_vegan: boolean;
  is_spicy: boolean;
  image_url: string | null;
}

const restaurants = [
  {
    id: "meskel",
    name: "Meskel Restaurant",
    type: "Main Restaurant",
    description: "Our flagship dining venue celebrates the rich culinary heritage of Ethiopia with authentic Gojjam and Amhara dishes, alongside international favorites.",
    hours: "6:30 AM - 10:30 PM",
    cuisine: "Ethiopian & International",
    icon: UtensilsCrossed,
  },
  {
    id: "bunna",
    name: "Bunna Bet",
    type: "Coffee House",
    description: "Experience the traditional Ethiopian coffee ceremony in our dedicated coffee house. Freshly roasted beans, traditional preparation, and cultural ambiance.",
    hours: "7:00 AM - 9:00 PM",
    cuisine: "Coffee & Light Bites",
    icon: Coffee,
  },
  {
    id: "terrace",
    name: "Sunset Terrace Bar",
    type: "Rooftop Bar",
    description: "Enjoy handcrafted cocktails and premium wines while watching the sun set over the Gojjam highlands. Live music on weekends.",
    hours: "5:00 PM - 12:00 AM",
    cuisine: "Cocktails & Tapas",
    icon: Wine,
  },
];

const Dining = () => {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const [categoriesResult, itemsResult] = await Promise.all([
          supabase
            .from('menu_categories')
            .select('*')
            .eq('is_active', true)
            .order('display_order', { ascending: true }),
          supabase
            .from('menu_items')
            .select('*')
            .eq('is_available', true)
            .order('display_order', { ascending: true }),
        ]);

        if (categoriesResult.error) throw categoriesResult.error;
        if (itemsResult.error) throw itemsResult.error;

        setCategories(categoriesResult.data || []);
        setMenuItems(itemsResult.data || []);
      } catch (error) {
        console.error('Error fetching menu data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenuData();
  }, []);

  const getItemsByCategory = (categoryId: string) => {
    return menuItems.filter(item => item.category_id === categoryId);
  };

  const formatPrice = (price: number) => {
    return `${price.toLocaleString()} ETB`;
  };

  return (
    <main className="min-h-screen">
      <Navbar />
      
      <PageHeader
        title="Dining & Cuisine"
        subtitle="Culinary Excellence"
        description="A feast for the senses, celebrating Ethiopia's rich culinary heritage alongside international favorites."
        backgroundImage={diningImage}
      />

      {/* Restaurants Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-gold uppercase tracking-[0.3em] text-sm mb-4">
              Our Venues
            </p>
            <h2 className="font-display text-4xl md:text-5xl text-foreground mb-6">
              Dining Experiences
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {restaurants.map((restaurant) => (
              <div
                key={restaurant.id}
                className="bg-card p-8 rounded-lg shadow-soft hover:shadow-elevated transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-14 h-14 rounded-full bg-gold/10 flex items-center justify-center mb-6">
                  <restaurant.icon className="w-7 h-7 text-gold" />
                </div>
                <p className="text-gold uppercase tracking-wider text-xs mb-2">{restaurant.type}</p>
                <h3 className="font-display text-2xl text-foreground mb-4">{restaurant.name}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">{restaurant.description}</p>
                <div className="space-y-2 pt-4 border-t border-border">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-gold" />
                    <span className="text-muted-foreground">{restaurant.hours}</span>
                  </div>
                  <p className="text-sm text-foreground font-medium">{restaurant.cuisine}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 ethiopian-pattern" />
        </div>

        <div className="container mx-auto px-6 relative">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Image */}
            <div className="relative">
              <div className="aspect-square rounded-lg overflow-hidden shadow-elevated">
                <img
                  src={diningImage}
                  alt="Ethiopian cuisine"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-gold text-espresso px-6 py-4 rounded-lg shadow-gold hidden lg:flex items-center gap-2">
                <Flame className="w-5 h-5" />
                <span className="font-medium">Chef's Specials</span>
              </div>
            </div>

            {/* Menu Highlights */}
            <div className="space-y-10">
              <div>
                <p className="text-gold uppercase tracking-[0.3em] text-sm mb-4">
                  Menu Highlights
                </p>
                <h2 className="font-display text-4xl md:text-5xl mb-6">
                  Taste of Ethiopia
                </h2>
              </div>

              {isLoading ? (
                <div className="space-y-8">
                  {[1, 2].map((i) => (
                    <div key={i} className="space-y-4">
                      <Skeleton className="h-6 w-1/3 bg-primary-foreground/10" />
                      <div className="space-y-3">
                        {[1, 2, 3].map((j) => (
                          <Skeleton key={j} className="h-20 w-full bg-primary-foreground/10" />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : categories.length === 0 ? (
                <p className="text-primary-foreground/60">Menu coming soon...</p>
              ) : (
                categories.slice(0, 2).map((category) => {
                  const items = getItemsByCategory(category.id);
                  if (items.length === 0) return null;
                  
                  return (
                    <div key={category.id} className="space-y-4">
                      <h3 className="font-display text-xl text-gold">{category.name}</h3>
                      <div className="space-y-3">
                        {items.slice(0, 4).map((item) => (
                          <div
                            key={item.id}
                            className="flex items-start justify-between p-4 bg-primary-foreground/5 rounded-lg hover:bg-primary-foreground/10 transition-colors"
                          >
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <span className="font-display text-lg">{item.name}</span>
                                {item.is_spicy && (
                                  <span className="flex items-center gap-1 text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">
                                    <Zap className="w-3 h-3" />
                                    Spicy
                                  </span>
                                )}
                                {item.is_vegetarian && (
                                  <span className="flex items-center gap-1 text-xs bg-green-600 text-white px-2 py-0.5 rounded-full">
                                    <Leaf className="w-3 h-3" />
                                    Veg
                                  </span>
                                )}
                              </div>
                              {item.description && (
                                <p className="text-sm text-primary-foreground/60">{item.description}</p>
                              )}
                            </div>
                            <span className="text-gold font-medium ml-4 whitespace-nowrap">
                              {formatPrice(item.price)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })
              )}

              <div className="flex gap-4 pt-4">
                <Link to="/table-booking">
                  <Button variant="hero" size="lg" className="group">
                    Reserve a Table
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Coffee Ceremony Section */}
      <section className="py-24 bg-card">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-20 h-20 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-8">
              <Coffee className="w-10 h-10 text-gold" />
            </div>
            <p className="text-gold uppercase tracking-[0.3em] text-sm mb-4">
              A Sacred Tradition
            </p>
            <h2 className="font-display text-4xl md:text-5xl text-foreground mb-6">
              The Ethiopian Coffee Ceremony
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
              Experience the ancient ritual of Ethiopian coffee preparation in our Bunna Bet. 
              Watch as green beans are roasted, ground, and brewed in the traditional jebena, 
              filling the air with the intoxicating aroma that has defined Ethiopian hospitality for centuries.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <div className="text-center">
                <p className="font-display text-3xl text-gold">3</p>
                <p className="text-sm text-muted-foreground">Rounds Served</p>
              </div>
              <div className="w-px h-12 bg-border hidden sm:block"></div>
              <div className="text-center">
                <p className="font-display text-3xl text-gold">45</p>
                <p className="text-sm text-muted-foreground">Minutes Experience</p>
              </div>
              <div className="w-px h-12 bg-border hidden sm:block"></div>
              <div className="text-center">
                <p className="font-display text-3xl text-gold">150</p>
                <p className="text-sm text-muted-foreground">ETB per Person</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Dining;
