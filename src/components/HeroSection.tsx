import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-hotel.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Meskerem Hotel exterior at golden hour"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-hero" />
      </div>

      {/* Ethiopian Pattern Overlay */}
      <div className="absolute inset-0 ethiopian-pattern opacity-30" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Tagline */}
          <p className="text-gold-light text-sm uppercase tracking-[0.3em] mb-6 animate-fade-up opacity-0 animation-delay-100">
            Debre Markos, Ethiopia
          </p>

          {/* Main Heading */}
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-cream font-medium leading-tight mb-6 animate-fade-up opacity-0 animation-delay-200">
            Where Ethiopian Heritage
            <span className="block text-gradient-gold mt-2">Meets Modern Luxury</span>
          </h1>

          {/* Subtitle */}
          <p className="text-cream/80 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-light leading-relaxed animate-fade-up opacity-0 animation-delay-300">
            Experience the warmth of Gojjam hospitality in our award-winning hotel, 
            the premier destination for unforgettable weddings, distinguished events, 
            and extraordinary stays.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up opacity-0 animation-delay-400">
            <Button variant="hero" size="xl" className="group">
              Inquire for Events
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="heroOutline" size="xl">
              Reserve Your Suite
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-cream/60 text-sm animate-fade-up opacity-0 animation-delay-500">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-gold" />
              <span>5-Star Luxury</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-gold" />
              <span>500+ Weddings Hosted</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-gold" />
              <span>Award-Winning Cuisine</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
        <div className="w-6 h-10 rounded-full border-2 border-cream/30 flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-cream/50 rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
