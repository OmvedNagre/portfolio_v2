import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Code2, Briefcase, FileText } from 'lucide-react';
import { supabase } from '../lib/supabase';

export function HeroSection() {
  const [isIgnited, setIsIgnited] = useState(false);
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase.from('site_settings').select('*').limit(1).single();
      if (data) setSettings(data);
    };
    fetchSettings();

    const t = setTimeout(() => setIsIgnited(true), 500);
    return () => clearTimeout(t);
  }, []);

  const handleScrollDown = () => {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background pt-16">
      {/* Background Elements */}
      <div className="absolute inset-0 grid-bg opacity-30 bg-gradient-to-b from-transparent to-background z-0"></div>
      <div className="absolute inset-0 speed-lines z-0"></div>
      
      {/* Radial Ignition Glow */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isIgnited ? 0.1 : 0 }}
        transition={{ duration: 2, ease: 'easeOut' }}
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, hsl(var(--primary)) 0%, transparent 60%)',
        }}
      />

      {/* Left HUD Telemetry */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: isIgnited ? 0.5 : 0, x: isIgnited ? 0 : -20 }}
        transition={{ duration: 0.8, delay: 1.5 }}
        className="hidden lg:flex absolute left-8 top-1/2 -translate-y-1/2 flex-col gap-6 font-mono text-xs text-muted-foreground z-10"
      >
        <div className="flex flex-col gap-1">
          <span className="text-primary border-b border-primary/30 pb-1 w-24">SYS_STATUS</span>
          <span>ONLINE</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-primary border-b border-primary/30 pb-1 w-24">CORE_TEMP</span>
          <span>OPTIMAL</span>
        </div>
      </motion.div>

      {/* Right HUD Telemetry */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: isIgnited ? 0.5 : 0, x: isIgnited ? 0 : 20 }}
        transition={{ duration: 0.8, delay: 1.5 }}
        className="hidden lg:flex absolute right-8 top-1/2 -translate-y-1/2 flex-col gap-6 font-mono text-xs text-muted-foreground text-right z-10 items-end"
      >
        <div className="flex flex-col gap-1 items-end">
          <span className="text-primary border-b border-primary/30 pb-1 w-24 text-right">UPTIME</span>
          <span>99.99%</span>
        </div>
        <div className="flex flex-col gap-1 items-end">
          <span className="text-primary border-b border-primary/30 pb-1 w-24 text-right">BUILD</span>
          <span>v1.0.0</span>
        </div>
      </motion.div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 flex flex-col items-center text-center">
        
        {/* SYSTEM ONLINE Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: isIgnited ? 1 : 0, scale: isIgnited ? 1 : 0.8 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8 flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary font-mono text-xs backdrop-blur-sm shadow-glow-primary"
        >
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
          SYSTEM ONLINE
        </motion.div>

        {/* Name */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isIgnited ? 1 : 0, y: isIgnited ? 0 : 30 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-5xl md:text-7xl font-display font-black tracking-tight mb-4 uppercase"
        >
          {settings ? settings.name.split(' ')[0] : 'JOHN'} <span className="text-gradient-primary">{settings ? settings.name.split(' ').slice(1).join(' ') : 'DOE'}</span>
        </motion.h1>

        {/* Role Line */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isIgnited ? 1 : 0, y: isIgnited ? 0 : 20 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-xl md:text-2xl font-body text-white/80 tracking-widest uppercase mb-6"
        >
          {settings ? settings.role : 'Full-Stack Performance Engineer'}
        </motion.h2>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isIgnited ? 1 : 0, y: isIgnited ? 0 : 20 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-lg text-muted-foreground max-w-2xl mb-10 font-body"
        >
          {settings ? settings.tagline : 'Building high-performance, precision-engineered web applications.'}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isIgnited ? 1 : 0, y: isIgnited ? 0 : 20 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="flex flex-col sm:flex-row gap-4 mb-12"
        >
          <button 
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="btn-mechanical bg-primary text-background font-bold px-8 py-3 rounded-md shadow-glow-primary hover:shadow-[0_0_30px_hsl(var(--primary-glow))]"
          >
            Deploy Project
          </button>
          <button 
            onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
            className="btn-mechanical bg-transparent border border-border text-white px-8 py-3 rounded-md hover:border-primary/50 hover:bg-card-glass transition-colors"
          >
            View Telemetry
          </button>
        </motion.div>

        {/* Social Icons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isIgnited ? 1 : 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="flex gap-6"
        >
          {settings?.github_url && (
            <a href={settings.github_url} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
              <Code2 size={24} />
            </a>
          )}
          {settings?.linkedin_url && (
            <a href={settings.linkedin_url} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
              <Briefcase size={24} />
            </a>
          )}
          {settings?.resume_url && (
            <a href={settings.resume_url} target="_blank" rel="noreferrer" download className="text-muted-foreground hover:text-primary transition-colors" title="Download Resume">
              <FileText size={24} />
            </a>
          )}
        </motion.div>
      </div>

      {/* Scroll Down Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isIgnited ? 1 : 0 }}
        transition={{ duration: 0.6, delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer z-20 group"
        onClick={handleScrollDown}
      >
        <span className="font-mono text-[10px] text-muted-foreground group-hover:text-primary transition-colors tracking-widest">SCROLL</span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="text-primary" size={20} />
        </motion.div>
      </motion.div>
    </section>
  );
}
