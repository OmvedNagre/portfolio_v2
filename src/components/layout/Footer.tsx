import { useState, useEffect } from 'react';
import { Code2, Briefcase, FileText, Mail } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export function Footer() {
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase.from('site_settings').select('*').limit(1).single();
      if (data) setSettings(data);
    };
    fetchSettings();
  }, []);
  return (
    <footer className="bg-background-secondary border-t border-border mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          {/* Logo & Status */}
          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="group flex items-center gap-2 cursor-pointer">
              <div className="w-8 h-8 bg-card border border-border rounded flex items-center justify-center transition-all duration-300 group-hover:border-primary group-hover:shadow-glow-primary">
                <span className="font-display font-bold text-primary">H</span>
              </div>
              <span className="font-display font-bold text-lg tracking-wider">
                HYPER<span className="text-primary">CAR</span>
              </span>
            </div>
            
            <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span>SYSTEMS OPERATIONAL</span>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-6">
            {settings?.github_url && (
              <a href={settings.github_url} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary hover:shadow-glow-primary transition-all duration-300 rounded-full p-2 hover:bg-card">
                <Code2 size={20} />
              </a>
            )}
            {settings?.linkedin_url && (
              <a href={settings.linkedin_url} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-[#0A66C2] transition-all duration-300 rounded-full p-2 hover:bg-card">
                <Briefcase size={20} />
              </a>
            )}
            {settings?.resume_url && (
              <a href={settings.resume_url} target="_blank" rel="noreferrer" download title="Download Resume" className="text-muted-foreground hover:text-white transition-all duration-300 rounded-full p-2 hover:bg-card">
                <FileText size={20} />
              </a>
            )}
            {settings?.email && (
              <a href={`mailto:${settings.email}`} className="text-muted-foreground hover:text-primary transition-all duration-300 rounded-full p-2 hover:bg-card">
                <Mail size={20} />
              </a>
            )}
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-4 font-mono text-xs text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} HYPERCAR PORTFOLIO. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-4">
            <span>UPTIME: 99.9%</span>
            <span>BUILD: v1.0.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
