import { Link } from "react-router-dom";
import { ArrowRight, Compass, Music, Utensils, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";

const experiences = [
  { icon: Compass, title: "Heritage Tours", description: "Guided excursions to Debre Markos landmarks, ancient monasteries, and the breathtaking Blue Nile Gorge." },
  { icon: Music, title: "Cultural Nights", description: "Weekly performances featuring traditional Azmari musicians and Eskista dancers in our grand courtyard." },
  { icon: Utensils, title: "Cooking Classes", description: "Master the art of Ethiopian cuisine with our chefs—from injera preparation to berbere spice blending." },
  { icon: Camera, title: "Photography Tours", description: "Capture the stunning landscapes and vibrant culture of Gojjam with professional photography guides." },
];

const ExperiencesSection = () => {
  return (
    <section id="experiences" className="py-24 bg-muted relative overflow-hidden">
      <div className="absolute inset-0 ethiopian-pattern opacity-30" />
      <div className="container mx-auto px-6 relative">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-gold uppercase tracking-[0.3em] text-sm mb-4">Beyond The Stay</p>
          <h2 className="font-display text-4xl md:text-5xl text-foreground mb-6">Curated Experiences</h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Immerse yourself in the rich tapestry of Ethiopian culture through our carefully crafted experiences.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {experiences.map((experience, index) => (
            <div key={index} className="group bg-background p-8 rounded-lg shadow-soft hover:shadow-elevated transition-all duration-500 hover:-translate-y-2">
              <div className="w-14 h-14 rounded-full bg-gold/10 flex items-center justify-center mb-6 group-hover:bg-gold/20 transition-colors">
                <experience.icon className="w-7 h-7 text-gold" />
              </div>
              <h3 className="font-display text-xl text-foreground mb-3">{experience.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">{experience.description}</p>
              <Link to="/experiences" className="inline-flex items-center gap-2 text-gold text-sm font-medium group-hover:gap-3 transition-all">
                Learn More
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-primary text-primary-foreground p-8 md:p-12 rounded-lg flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-display text-2xl md:text-3xl mb-2">Plan Your Ethiopian Adventure</h3>
            <p className="text-primary-foreground/70">Our concierge team is ready to craft your perfect itinerary.</p>
          </div>
          <Link to="/contact">
            <Button variant="hero" size="lg" className="whitespace-nowrap">Contact Concierge</Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ExperiencesSection;