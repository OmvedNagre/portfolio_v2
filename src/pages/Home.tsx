import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Profile } from '../lib/profile';
import { Navbar } from '../components/layout/Navbar';
import { HeroSection } from '../components/HeroSection';
import { Footer } from '../components/layout/Footer';

import { ProjectsSection } from '../components/ProjectsSection';
import { SkillsSection } from '../components/SkillsSection';
import { AboutSection, ServicesSection, ContactSection } from '../components/AboutServicesContact';

export function Home() {
  const [settings, setSettings] = useState<Profile | null>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let active = true;
    supabase.from('site_settings').select('*').maybeSingle().then(({ data, error }) => {
      if (active) { setSettings(data); setFailed(Boolean(error)); }
    });
    return () => { active = false; };
  }, []);
  return (
    <div className="relative w-full">
      <Navbar />
      <main>
        {failed && <p role="alert" className="pt-20 text-center">Profile details are temporarily unavailable.</p>}
        <HeroSection settings={settings} />
        <ProjectsSection />
        <SkillsSection />
        <AboutSection settings={settings} />
        <ServicesSection />
        <ContactSection settings={settings} />
      </main>
      <Footer settings={settings} />
    </div>
  );
}
