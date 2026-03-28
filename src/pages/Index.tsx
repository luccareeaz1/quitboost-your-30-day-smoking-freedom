import NavBar from "@/components/landing/NavBar";
import HeroSection from "@/components/landing/HeroSection";
import SocialProofSection from "@/components/landing/SocialProofSection";
import BenefitsSection from "@/components/landing/BenefitsSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import CalculatorSection from "@/components/landing/CalculatorSection";
import PricingSection from "@/components/landing/PricingSection";
import FooterSection from "@/components/landing/FooterSection";
import SpaceBackground from "@/components/landing/SpaceBackground";

const Index = () => (
  <div className="min-h-screen bg-background text-foreground relative">
    <SpaceBackground />
    <div className="relative z-10">
      <NavBar />
      <HeroSection />
      <SocialProofSection />
      <BenefitsSection />
      <HowItWorksSection />
      <CalculatorSection />
      <PricingSection />
      <FooterSection />
    </div>
  </div>
);

export default Index;
