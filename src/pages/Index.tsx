import NavBar from "@/components/landing/NavBar";
import HeroSection from "@/components/landing/HeroSection";
import TrustBar from "@/components/landing/TrustBar";
import FeaturesSection from "@/components/landing/FeaturesSection";
import TestimonialsSection from "@/components/landing/SocialProofSection";
import CtaSection from "@/components/landing/CtaSection";
import FaqSection from "@/components/landing/FaqSection";
import FooterSection from "@/components/landing/FooterSection";
import SEO from "@/components/common/SEO";
import { useTranslation } from "react-i18next";

const Index = () => {
  const { t } = useTranslation();
  
  return (
    <div style={{ minHeight: "100vh", background: "#FFFFFF" }}>
      <SEO 
        title="QuitBoost | Ar Puro. Nova Vida."
        description={t('hero.subtitle')}
      />
    <NavBar />
    <HeroSection />
    <TrustBar />
    <FeaturesSection />
    <TestimonialsSection />
    <CtaSection />
    <FaqSection />
    <FooterSection />
    </div>
  );
};

export default Index;
