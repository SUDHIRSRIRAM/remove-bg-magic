import { Hero } from "@/components/Hero";
import { Stats } from "@/components/Stats";
import { HowItWorks } from "@/components/HowItWorks";
import { Features } from "@/components/Features";
import { ImageProcessor } from "@/components/ImageProcessor";
import { Testimonials } from "@/components/Testimonials";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <Stats />
      <ImageProcessor />
      <HowItWorks />
      <Features />
      <Testimonials />
      <Footer />
    </div>
  );
};

export default Index;