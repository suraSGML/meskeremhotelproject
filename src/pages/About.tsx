import { Link } from "react-router-dom";
import { ArrowRight, Award, Users, Calendar, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import heroImage from "@/assets/hero-hotel.jpg";

const stats = [
  { icon: Calendar, value: "15+", label: "Years of Excellence" },
  { icon: Users, value: "500+", label: "Weddings Hosted" },
  { icon: Award, value: "50+", label: "Awards Received" },
  { icon: Heart, value: "10K+", label: "Happy Guests" },
];

const values = [
  {
    title: "Ethiopian Heritage",
    description: "We celebrate and preserve the rich cultural traditions of Gojjam, weaving them into every aspect of our hospitality.",
  },
  {
    title: "Exceptional Service",
    description: "Our dedicated team anticipates your needs, ensuring every moment of your stay exceeds expectations.",
  },
  {
    title: "Sustainable Luxury",
    description: "We're committed to environmentally responsible practices while maintaining the highest standards of luxury.",
  },
  {
    title: "Community Connection",
    description: "We support local artisans, farmers, and communities, creating meaningful economic impact in Debre Markos.",
  },
];

const timeline = [
  { year: "2009", event: "Meskerem Hotel opens its doors with 30 rooms and a vision to redefine hospitality in Gojjam." },
  { year: "2012", event: "Grand Ballroom added, becoming the region's premier wedding and event venue." },
  { year: "2015", event: "Awarded 'Best Boutique Hotel' by Ethiopian Tourism Organization." },
  { year: "2018", event: "Expanded to 80 rooms with the addition of the Presidential Suite." },
  { year: "2021", event: "Launched cultural experience programs and Bunna Bet coffee house." },
  { year: "2024", event: "Celebrating 15 years of Ethiopian hospitality excellence." },
];

const About = () => {
  return (
    <main className="min-h-screen">
      <Navbar />
      
      <PageHeader
        title="Our Story"
        subtitle="About Meskerem"
        description="Named after the Ethiopian month of spring—a time of renewal, celebration, and new beginnings."
        backgroundImage={heroImage}
      />

      {/* Stats Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-6 h-6 text-gold" />
                </div>
                <p className="font-display text-4xl mb-1">{stat.value}</p>
                <p className="text-sm text-primary-foreground/70">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Image */}
            <div className="relative">
              <div className="aspect-[4/5] rounded-lg overflow-hidden shadow-elevated">
                <img
                  src={heroImage}
                  alt="Meskerem Hotel"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-8 -right-8 bg-gold text-espresso p-6 rounded-lg shadow-gold hidden lg:block">
                <p className="font-display text-3xl mb-1">Since</p>
                <p className="font-display text-4xl">2009</p>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-8">
              <div>
                <p className="text-gold uppercase tracking-[0.3em] text-sm mb-4">
                  The Spirit of Meskerem
                </p>
                <h2 className="font-display text-4xl md:text-5xl text-foreground mb-6">
                  A Legacy of Hospitality
                </h2>
              </div>

              <div className="space-y-6 text-muted-foreground leading-relaxed">
                <p>
                  Named after the Ethiopian month of spring—a time of renewal, celebration, 
                  and new beginnings—Meskerem Hotel embodies the vibrant spirit of Gojjam's 
                  rich cultural heritage.
                </p>
                <p>
                  For over 15 years, we have been the guardian of traditions, hosting 
                  countless weddings, reunions, and milestone celebrations. Our walls echo 
                  with laughter, music, and the warmth of Ethiopian hospitality.
                </p>
                <p>
                  Every corner of our hotel tells a story—from the traditional Habesha 
                  artwork adorning our halls to the aromatic bunna ceremonies that welcome 
                  our guests each morning. Here, luxury meets authenticity, and every guest 
                  becomes part of our extended family.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-card">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-gold uppercase tracking-[0.3em] text-sm mb-4">
              What We Believe
            </p>
            <h2 className="font-display text-4xl md:text-5xl text-foreground mb-6">
              Our Values
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-background p-8 rounded-lg shadow-soft hover:shadow-elevated transition-all duration-300"
              >
                <div className="w-8 h-1 bg-gold mb-6" />
                <h3 className="font-display text-2xl text-foreground mb-4">{value.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-24 bg-muted">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-gold uppercase tracking-[0.3em] text-sm mb-4">
              Our Journey
            </p>
            <h2 className="font-display text-4xl md:text-5xl text-foreground mb-6">
              Milestones
            </h2>
          </div>

          <div className="max-w-3xl mx-auto">
            {timeline.map((item, index) => (
              <div key={index} className="flex gap-6 mb-8 last:mb-0">
                <div className="flex flex-col items-center">
                  <div className="w-4 h-4 rounded-full bg-gold" />
                  {index < timeline.length - 1 && (
                    <div className="w-0.5 h-full bg-border mt-2" />
                  )}
                </div>
                <div className="pb-8">
                  <p className="font-display text-2xl text-gold mb-2">{item.year}</p>
                  <p className="text-muted-foreground leading-relaxed">{item.event}</p>
                </div>
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
            Experience Our Hospitality
          </h2>
          <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto mb-10">
            We invite you to become part of our story. Visit us and discover why Meskerem 
            has become the destination of choice in Debre Markos.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/contact">
              <Button variant="hero" size="xl" className="group">
                Get in Touch
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/accommodations">
              <Button variant="heroOutline" size="xl">
                View Rooms
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default About;