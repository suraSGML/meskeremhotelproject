import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

interface PageHeaderProps {
  title: string;
  subtitle: string;
  description?: string;
  backgroundImage?: string;
}

const PageHeader = ({ title, subtitle, description, backgroundImage }: PageHeaderProps) => {
  return (
    <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
      {/* Background */}
      {backgroundImage && (
        <div className="absolute inset-0">
          <img
            src={backgroundImage}
            alt={title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-hero" />
        </div>
      )}
      
      {!backgroundImage && (
        <div className="absolute inset-0 bg-primary">
          <div className="absolute inset-0 geometric-pattern opacity-30" />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center py-20">
        {/* Back Link */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gold-light hover:text-gold transition-colors mb-8 text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <p className="text-gold uppercase tracking-[0.3em] text-sm mb-4 animate-fade-up opacity-0">
          {subtitle}
        </p>
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-cream font-medium leading-tight mb-6 animate-fade-up opacity-0 animation-delay-100">
          {title}
        </h1>
        {description && (
          <p className="text-cream/80 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed animate-fade-up opacity-0 animation-delay-200">
            {description}
          </p>
        )}
      </div>
    </section>
  );
};

export default PageHeader;