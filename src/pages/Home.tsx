import { Navbar } from '../components/layout/Navbar';
import { HeroSection } from '../components/HeroSection';
import { Footer } from '../components/layout/Footer';

import { ProjectsSection } from '../components/ProjectsSection';
import { SkillsSection } from '../components/SkillsSection';
import { AboutSection, ServicesSection, ContactSection } from '../components/AboutServicesContact';

export function Home() {
  return (
    <div className="relative w-full">
      <Navbar />
      <main>
        <HeroSection />
        <ProjectsSection />
        <SkillsSection />
        <AboutSection />
        <ServicesSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
