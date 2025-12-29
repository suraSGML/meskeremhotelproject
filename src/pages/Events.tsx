import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Users, Maximize2, Music, Camera, UtensilsCrossed, Sparkles, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import eventBallroom from "@/assets/event-ballroom.jpg";
import eventGarden from "@/assets/event-garden.jpg";
import eventConference from "@/assets/event-conference.jpg";

const venues = [
  {
    id: "grand-ballroom",
    name: "Grand Ballroom",
    subtitle: "The Crown Jewel",
    description: "An opulent 800 sqm ballroom adorned with crystal chandeliers and traditional Ethiopian motifs. Our flagship venue transforms every celebration into an unforgettable spectacle.",
    image: eventBallroom,
    capacity: {
      theater: 600,
      banquet: 500,
      cocktail: 700,
      conference: 400,
    },
    size: "800 sqm",
    features: ["Crystal Chandeliers", "Built-in Stage", "Private Bridal Suite", "Professional Sound System", "Climate Control", "Private Entrance"],
  },
  {
    id: "garden-terrace",
    name: "Garden Terrace",
    subtitle: "Under the Stars",
    description: "A breathtaking outdoor venue with panoramic views of the Gojjam highlands. The perfect setting for romantic sunset ceremonies and intimate celebrations under Ethiopian skies.",
    image: eventGarden,
    capacity: {
      theater: 250,
      banquet: 200,
      cocktail: 300,
      conference: 0,
    },
    size: "500 sqm",
    features: ["Mountain Views", "String Lighting", "Garden Backdrop", "Covered Pavilion", "Fire Pit Area", "Sunset Orientation"],
  },
  {
    id: "conference-hall",
    name: "Executive Conference Hall",
    subtitle: "Professional Excellence",
    description: "State-of-the-art meeting facilities designed for corporate excellence. Equipped with the latest technology and elegant Ethiopian design elements.",
    image: eventConference,
    capacity: {
      theater: 150,
      banquet: 80,
      cocktail: 120,
      conference: 60,
    },
    size: "300 sqm",
    features: ["4K Projectors", "Video Conferencing", "Breakout Rooms", "Business Center", "High-Speed WiFi", "Catering Kitchen"],
  },
];

const services = [
  { icon: UtensilsCrossed, name: "Gourmet Catering", description: "Authentic Ethiopian and international cuisine" },
  { icon: Music, name: "Entertainment", description: "Traditional Azmari musicians and modern DJs" },
  { icon: Camera, name: "Photography", description: "Professional photo and video packages" },
  { icon: Sparkles, name: "Decor & Florals", description: "Custom designs for your vision" },
];

const Events = () => {
  const [selectedVenue, setSelectedVenue] = useState(venues[0]);

  return (
    <main className="min-h-screen">
      <Navbar />
      
      <PageHeader
        title="Events & Weddings"
        subtitle="Celebrate With Us"
        description="From intimate gatherings to grand celebrations, create unforgettable moments in our extraordinary venues."
        backgroundImage={eventBallroom}
      />

      {/* Venues Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-gold uppercase tracking-[0.3em] text-sm mb-4">
              Our Venues
            </p>
            <h2 className="font-display text-4xl md:text-5xl text-foreground mb-6">
              Exceptional Spaces
            </h2>
          </div>

          {/* Venue Selector */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {venues.map((venue) => (
              <button
                key={venue.id}
                onClick={() => setSelectedVenue(venue)}
                className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedVenue.id === venue.id
                    ? "bg-primary text-primary-foreground shadow-elevated"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {venue.name}
              </button>
            ))}
          </div>

          {/* Selected Venue Details */}
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Image */}
            <div className="relative group">
              <div className="aspect-[4/3] rounded-lg overflow-hidden shadow-elevated">
                <img
                  src={selectedVenue.image}
                  alt={selectedVenue.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="absolute bottom-6 left-6 right-6 flex gap-4">
                <div className="bg-background/95 backdrop-blur-sm px-4 py-3 rounded-lg shadow-soft">
                  <div className="flex items-center gap-2">
                    <Maximize2 className="w-4 h-4 text-gold" />
                    <span className="text-sm font-medium text-foreground">{selectedVenue.size}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-8">
              <div>
                <p className="text-gold uppercase tracking-wider text-sm mb-2">
                  {selectedVenue.subtitle}
                </p>
                <h3 className="font-display text-3xl md:text-4xl text-foreground mb-4">
                  {selectedVenue.name}
                </h3>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  {selectedVenue.description}
                </p>
              </div>

              {/* Capacity Grid */}
              <div className="bg-card p-6 rounded-lg">
                <p className="text-sm font-medium text-foreground mb-4 flex items-center gap-2">
                  <Users className="w-4 h-4 text-gold" />
                  Seating Capacity
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(selectedVenue.capacity).map(([type, count]) => (
                    count > 0 && (
                      <div key={type} className="flex justify-between items-center p-3 bg-background rounded-md">
                        <span className="text-sm capitalize text-muted-foreground">{type}</span>
                        <span className="font-display text-lg text-foreground">{count}</span>
                      </div>
                    )
                  ))}
                </div>
              </div>

              {/* Features */}
              <div>
                <p className="text-sm font-medium text-foreground mb-4">Features & Amenities</p>
                <div className="grid grid-cols-2 gap-3">
                  {selectedVenue.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-gold flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="flex flex-wrap gap-4">
                <Link to="/contact">
                  <Button variant="gold" size="lg" className="group">
                    Request Quote
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button variant="outline" size="lg">
                    Schedule Tour
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-muted">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-gold uppercase tracking-[0.3em] text-sm mb-4">
              Complete Solutions
            </p>
            <h2 className="font-display text-4xl md:text-5xl text-foreground mb-6">
              Event Services
            </h2>
            <p className="text-muted-foreground text-lg">
              Our dedicated team handles every detail, from catering to entertainment, ensuring your event is flawless.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-background p-8 rounded-lg shadow-soft hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-6">
                  <service.icon className="w-7 h-7 text-gold" />
                </div>
                <h3 className="font-display text-xl text-foreground mb-2">{service.name}</h3>
                <p className="text-muted-foreground text-sm">{service.description}</p>
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
            Ready to Plan Your Event?
          </h2>
          <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto mb-10">
            Our events team is ready to bring your vision to life. Contact us today for a personalized consultation.
          </p>
          <Link to="/contact">
            <Button variant="hero" size="xl" className="group">
              Start Planning
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Events;