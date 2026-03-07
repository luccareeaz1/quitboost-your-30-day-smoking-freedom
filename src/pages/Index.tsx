import NavBar from "@/components/landing/NavBar";
import HeroSection from "@/components/landing/HeroSection";
import SocialProofSection from "@/components/landing/SocialProofSection";
import BenefitsSection from "@/components/landing/BenefitsSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import CalculatorSection from "@/components/landing/CalculatorSection";
import PricingSection from "@/components/landing/PricingSection";
import FooterSection from "@/components/landing/FooterSection";

const Index = () => (
  <div className="min-h-screen bg-background">
    <NavBar />
    <HeroSection />
    <SocialProofSection />
    <BenefitsSection />
    <HowItWorksSection />
    <CalculatorSection />
    <PricingSection />
    <FooterSection />
  </div>
);

export default Index;
