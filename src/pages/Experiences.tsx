import { Link } from "react-router-dom";
import { ArrowRight, Compass, Music, Utensils, Camera, Mountain, Heart, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import eventGarden from "@/assets/event-garden.jpg";

const experiences = [
  {
    id: "heritage-tour",
    icon: Compass,
    title: "Heritage Tours",
    subtitle: "Discover Gojjam",
    description: "Journey through the historic landscapes of Debre Markos with our expert guides. Visit ancient monasteries, explore local markets, and witness the breathtaking Blue Nile Gorge.",
    duration: "Full Day",
    groupSize: "2-8 guests",
    price: "From $75",
    highlights: ["Ancient Monasteries", "Blue Nile Gorge", "Local Markets", "Traditional Villages"],
    image: eventGarden,
  },
  {
    id: "cultural-nights",
    icon: Music,
    title: "Cultural Nights",
    subtitle: "Weekly Performances",
    description: "Every Saturday evening, our courtyard transforms into a celebration of Ethiopian culture. Traditional Azmari musicians and Eskista dancers create an unforgettable atmosphere.",
    duration: "3 Hours",
    groupSize: "Open to all guests",
    price: "Complimentary",
    highlights: ["Azmari Musicians", "Eskista Dance", "Traditional Drinks", "Cultural Stories"],
    image: eventGarden,
  },
  {
    id: "cooking-class",
    icon: Utensils,
    title: "Cooking Classes",
    subtitle: "Culinary Journey",
    description: "Learn the secrets of Ethiopian cuisine from our master chefs. From making injera to blending berbere spices, take home recipes and skills to recreate the magic.",
    duration: "4 Hours",
    groupSize: "2-6 guests",
    price: "From $60",
    highlights: ["Injera Making", "Spice Blending", "Wot Preparation", "Recipe Book"],
    image: eventGarden,
  },
  {
    id: "photography-tour",
    icon: Camera,
    title: "Photography Tours",
    subtitle: "Capture Ethiopia",
    description: "Accompanied by professional photographers, capture the stunning landscapes and vibrant culture of Gojjam. Perfect for both amateurs and seasoned photographers.",
    duration: "Half Day",
    groupSize: "2-4 guests",
    price: "From $90",
    highlights: ["Golden Hour Shoots", "Portrait Sessions", "Landscape Guidance", "Photo Editing Tips"],
    image: eventGarden,
  },
  {
    id: "hiking",
    icon: Mountain,
    title: "Highland Hiking",
    subtitle: "Nature Trails",
    description: "Explore the scenic trails around Debre Markos with experienced guides. From gentle walks to challenging hikes, discover the natural beauty of the Ethiopian highlands.",
    duration: "3-6 Hours",
    groupSize: "2-10 guests",
    price: "From $45",
    highlights: ["Scenic Viewpoints", "Bird Watching", "Picnic Lunch", "Nature Guide"],
    image: eventGarden,
  },
  {
    id: "wellness",
    icon: Heart,
    title: "Wellness Retreat",
    subtitle: "Mind & Body",
    description: "Rejuvenate with our holistic wellness experiences. Traditional massage techniques, yoga sessions overlooking the gardens, and meditation in serene surroundings.",
    duration: "2-4 Hours",
    groupSize: "1-4 guests",
    price: "From $50",
    highlights: ["Traditional Massage", "Yoga Sessions", "Meditation", "Herbal Treatments"],
    image: eventGarden,
  },
];

const Experiences = () => {
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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {experiences.map((experience) => (
              <div
                key={experience.id}
                className="group bg-card rounded-lg overflow-hidden shadow-soft hover:shadow-elevated transition-all duration-500"
              >
                {/* Image */}
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={experience.image}
                    alt={experience.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-gold text-xs uppercase tracking-wider">{experience.subtitle}</p>
                    <h3 className="font-display text-2xl text-cream">{experience.title}</h3>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {experience.description}
                  </p>

                  {/* Meta */}
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="w-4 h-4 text-gold" />
                      <span>{experience.duration}</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Users className="w-4 h-4 text-gold" />
                      <span>{experience.groupSize}</span>
                    </div>
                  </div>

                  {/* Highlights */}
                  <div className="flex flex-wrap gap-2">
                    {experience.highlights.slice(0, 3).map((highlight, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <span className="font-display text-xl text-gold">{experience.price}</span>
                    <Link to="/contact">
                      <Button variant="ghost" size="sm" className="group/btn text-foreground hover:text-gold">
                        Book Now
                        <ArrowRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
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