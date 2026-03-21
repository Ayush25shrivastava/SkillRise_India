/**
 * LandingPage — Full landing page assembly
 * Composes all sections: Navbar, Hero, Features, How It Works, Testimonials, CTA, Footer
 * Includes the particle background for the futuristic feel
 */
import ParticleField from '../components/landing/ParticleField';
import LandingNavbar from '../components/landing/LandingNavbar';
import HeroSection from '../components/landing/HeroSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import HowItWorksSection from '../components/landing/HowItWorksSection';
import TestimonialsSection from '../components/landing/TestimonialsSection';
import CTASection from '../components/landing/CTASection';
import LandingFooter from '../components/landing/LandingFooter';

export default function LandingPage() {
  return (
    <div className="relative min-h-[calc(100vh-100px)] bg-[#06060a] text-white overflow-x-hidden">
      {/* Animated particle canvas (full-screen, behind everything) */}
      <ParticleField />

      {/* Fixed navbar */}
      <LandingNavbar />

      {/* Page content (above particles) */}
      <main className="relative z-10">
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <CTASection />
      </main>

      {/* Footer */}
      <LandingFooter />
    </div>
  );
}