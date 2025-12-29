import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import EventsSection from "@/components/EventsSection";
import AccommodationsSection from "@/components/AccommodationsSection";
import DiningSection from "@/components/DiningSection";
import ExperiencesSection from "@/components/ExperiencesSection";
import EventInquiryForm from "@/components/EventInquiryForm";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <EventsSection />
      <AccommodationsSection />
      <DiningSection />
      <ExperiencesSection />
      <EventInquiryForm />
      <Footer />
    </main>
  );
};

export default Index;
