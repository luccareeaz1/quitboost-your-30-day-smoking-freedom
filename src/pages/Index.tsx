import NavBar from "@/components/landing/NavBar";
import HeroSection from "@/components/landing/HeroSection";
import TestimonialsSection from "@/components/landing/SocialProofSection";
import AppContentSection from "@/components/landing/BenefitsSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import CalculatorSection from "@/components/landing/CalculatorSection";
import PricingSection from "@/components/landing/PricingSection";
import FooterSection from "@/components/landing/FooterSection";

const Index = () => (
  <div className="min-h-screen bg-background">
    <NavBar />
    <HeroSection />
    <TestimonialsSection />
    <AppContentSection />
    <HowItWorksSection />
    <CalculatorSection />
    <PricingSection />
    <FooterSection />
  </div>
);

export default Index;
