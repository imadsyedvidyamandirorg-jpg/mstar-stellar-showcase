import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import OnlineStore from "@/components/OnlineStore";
import ReelsSection from "@/components/ReelsSection";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import ContactButton from "@/components/ContactButton";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <Services />
      <OnlineStore />
      <ReelsSection />
      <Contact />
      <Footer />
      <ContactButton />
    </div>
  );
};

export default Index;
