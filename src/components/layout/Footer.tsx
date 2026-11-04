import type { Profile } from '../../lib/profile';
import { Code2, Briefcase, FileText, Mail } from 'lucide-react';

export function Footer({ settings }: { settings: Profile | null }) {
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
              <a aria-label="GitHub" href={settings.github_url} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary hover:shadow-glow-primary transition-all duration-300 rounded-full p-2 hover:bg-card">
                <Code2 size={20} />
              </a>
            )}
            {settings?.linkedin_url && (
              <a aria-label="LinkedIn" href={settings.linkedin_url} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-[#0A66C2] transition-all duration-300 rounded-full p-2 hover:bg-card">
                <Briefcase size={20} />
              </a>
            )}
            {settings?.resume_url && (
              <a aria-label="Résumé" href={settings.resume_url} target="_blank" rel="noreferrer" download title="Download Resume" className="text-muted-foreground hover:text-white transition-all duration-300 rounded-full p-2 hover:bg-card">
                <FileText size={20} />
              </a>
            )}
            {settings?.email && (
              <a aria-label="Email" href={`mailto:${settings.email}`} className="text-muted-foreground hover:text-primary transition-all duration-300 rounded-full p-2 hover:bg-card">
                <Mail size={20} />
              </a>
            )}
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-4 font-mono text-xs text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} HYPERCAR PORTFOLIO. ALL RIGHTS RESERVED.</p>
        </div>
      </div>
    </footer>
  );
}
