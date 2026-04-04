import NavBar from "@/components/landing/NavBar";
import HeroSection from "@/components/landing/HeroSection";
import TrustBar from "@/components/landing/TrustBar";
import FeaturesSection from "@/components/landing/FeaturesSection";
import TestimonialsSection from "@/components/landing/SocialProofSection";
import CtaSection from "@/components/landing/CtaSection";
import FaqSection from "@/components/landing/FaqSection";
import FooterSection from "@/components/landing/FooterSection";

const Index = () => (
  <div style={{ minHeight: "100vh", background: "#050505" }}>
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

export default Index;
