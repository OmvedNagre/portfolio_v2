import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Server, Zap, Shield, Component, ChevronRight, Mail, Phone, MapPin, Code2, Briefcase, FileText } from 'lucide-react';
import { supabase } from '../lib/supabase';

const AVAILABLE_ICONS = { Zap, Server, Shield, Component };

export function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [bio, setBio] = useState('');
  const [settings, setSettings] = useState<any>(null);
  const [experienceStats, setExperienceStats] = useState<any[]>([]);

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase.from('site_settings').select('*').limit(1).single();
      if (data) {
        setBio(data.bio);
        setSettings(data);
      }
      const { data: expData } = await supabase.from('experience').select('*').order('sort_order', { ascending: true });
      if (expData) setExperienceStats(expData);
    };
    fetchSettings();
  }, []);

  return (
    <section id="about" className="py-24 bg-background border-t border-border overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div ref={ref} className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight mb-4">
              DRIVER <span className="text-gradient-primary">PROFILE</span>
            </h2>
            <div className="racing-stripe mb-8"></div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Column */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6 text-muted-foreground font-body text-lg"
          >
            <p className="text-muted-foreground font-body leading-relaxed mb-6">
              {bio || 'I build digital engines. My focus is on the intersection of blistering performance, robust architecture, and precision aesthetics. Every millisecond counts, and every pixel matters.'}
            </p>
          </motion.div>

          {/* Right Column */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-2 gap-4"
          >
            {experienceStats.length > 0 ? (
              experienceStats.map((stat, i) => (
                <div key={stat.id || i} className="card-metallic p-6 border-border text-center">
                  <span className="block font-mono text-3xl font-bold text-primary mb-2">{stat.value}</span>
                  <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest">{stat.label}</span>
                </div>
              ))
            ) : (
              <>
                <div className="card-metallic p-6 border-border text-center">
                  <span className="block font-mono text-3xl font-bold text-primary mb-2">5+</span>
                  <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest">Years Exp</span>
                </div>
                <div className="card-metallic p-6 border-border text-center">
                  <span className="block font-mono text-3xl font-bold text-primary mb-2">30+</span>
                  <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest">Projects</span>
                </div>
                <div className="card-metallic p-6 border-border text-center">
                  <span className="block font-mono text-3xl font-bold text-primary mb-2">60</span>
                  <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest">FPS UI</span>
                </div>
                <div className="card-metallic p-6 border-border text-center">
                  <span className="block font-mono text-3xl font-bold text-primary mb-2">99%</span>
                  <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest">Uptime</span>
                </div>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export function ServicesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [services, setServices] = useState<any[]>([]);

  useEffect(() => {
    const fetchServices = async () => {
      const { data } = await supabase.from('services').select('*').order('sort_order', { ascending: true });
      if (data) setServices(data);
    };
    fetchServices();
  }, []);

  return (
    <section id="services" className="py-24 bg-background-secondary border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div ref={ref} className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight mb-4">
              CAPA<span className="text-gradient-primary">BILITIES</span>
            </h2>
            <div className="racing-stripe mb-8"></div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const IconComponent = AVAILABLE_ICONS[service.icon_name as keyof typeof AVAILABLE_ICONS] || Zap;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.6, delay: 0.2 + (index * 0.1) }}
                className="card-metallic p-8 group hover:border-primary/50 transition-colors"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-background transition-all duration-300">
                  <IconComponent size={24} />
                </div>
                <h4 className="font-display font-bold tracking-wider uppercase mb-3 group-hover:text-primary transition-colors">
                  {service.title}
                </h4>
                <p className="text-muted-foreground font-body text-sm leading-relaxed">
                  {service.description}
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  );
}

export function ContactSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase.from('site_settings').select('*').limit(1).single();
      if (data) setSettings(data);
    };
    fetchSettings();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => setIsSubmitting(false), 2000);
  };

  return (
    <section id="contact" className="py-24 bg-background border-t border-border overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div ref={ref} className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight mb-4">
              OPEN <span className="text-gradient-primary">CHANNEL</span>
            </h2>
            <div className="racing-stripe mb-8"></div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Left: Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="card-metallic glass-panel p-8"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="font-mono text-xs text-muted-foreground uppercase tracking-widest">Transmit To:</label>
                <input 
                  type="text" 
                  placeholder="Your Name" 
                  required
                  className="w-full bg-background border border-border rounded-md px-4 py-3 text-white font-body focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-300"
                />
              </div>
              <div className="space-y-2">
                <label className="font-mono text-xs text-muted-foreground uppercase tracking-widest">Return Frequency (Email):</label>
                <input 
                  type="email" 
                  placeholder="name@domain.com" 
                  required
                  className="w-full bg-background border border-border rounded-md px-4 py-3 text-white font-body focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-300"
                />
              </div>
              <div className="space-y-2">
                <label className="font-mono text-xs text-muted-foreground uppercase tracking-widest">Payload Data:</label>
                <textarea 
                  rows={4}
                  placeholder="Your message..." 
                  required
                  className="w-full bg-background border border-border rounded-md px-4 py-3 text-white font-body focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-300 resize-none"
                />
              </div>
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="btn-mechanical w-full bg-primary text-background font-bold px-8 py-4 rounded-md shadow-glow-primary hover:shadow-[0_0_30px_hsl(var(--primary-glow))] flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-2 h-2 rounded-full bg-background animate-pulse"></div>
                    SENDING...
                  </>
                ) : (
                  'INITIATE TRANSMISSION'
                )}
              </button>
            </form>
          </motion.div>

          {/* Right: Info Panel */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col justify-center space-y-8"
          >
            <div>
              <h3 className="font-display text-2xl font-bold mb-4">System Details</h3>
              <p className="font-body text-muted-foreground text-lg">
                Available for freelance opportunities and full-time positions. 
                Whether you have a question or just want to say hi, I'll try my best to get back to you!
              </p>
            </div>

            <div className="space-y-6">
              {[
                { icon: Mail, label: 'Email', value: settings?.email || 'hello@johndoe.com', delay: 0.5 },
                { icon: Phone, label: 'Phone', value: settings?.phone || '+1 (555) 123-4567', delay: 0.6 },
                { icon: MapPin, label: 'Location', value: settings?.location || 'San Francisco, CA', delay: 0.7 }
              ].map((item, i) => (
                item.value && (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                    transition={{ duration: 0.4, delay: item.delay }}
                    className="flex items-center gap-4 group"
                  >
                    <div className="p-3 bg-background-secondary border border-border rounded-lg group-hover:border-primary group-hover:text-primary transition-all duration-300">
                      <item.icon size={20} />
                    </div>
                    <div>
                      <p className="font-mono text-xs text-muted-foreground uppercase">{item.label}</p>
                      <p className="font-body text-lg text-white">{item.value}</p>
                    </div>
                  </motion.div>
                )
              ))}
            </div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="flex gap-4 pt-4 border-t border-border"
            >
              {settings?.github_url && (
                <a href={settings.github_url} target="_blank" rel="noreferrer" className="p-3 bg-background-secondary border border-border rounded-lg hover:border-primary hover:text-primary transition-all duration-300">
                  <Code2 size={20} />
                </a>
              )}
              {settings?.linkedin_url && (
                <a href={settings.linkedin_url} target="_blank" rel="noreferrer" className="p-3 bg-background-secondary border border-border rounded-lg hover:border-[#0A66C2] hover:text-[#0A66C2] transition-all duration-300">
                  <Briefcase size={20} />
                </a>
              )}
              {settings?.resume_url && (
                <a href={settings.resume_url} target="_blank" rel="noreferrer" download title="Download Resume" className="p-3 bg-background-secondary border border-border rounded-lg hover:border-primary hover:text-primary transition-all duration-300">
                  <FileText size={20} />
                </a>
              )}
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
