import { useState } from 'react';
import { useAuth } from '../../lib/AuthContext';
import { Navbar } from '../../components/layout/Navbar';
import { motion } from 'framer-motion';
import { LayoutDashboard, Settings, Layout, Code2, Briefcase, User as UserIcon } from 'lucide-react';

import { SettingsForm } from '../../components/admin/SettingsForm';
import { ProjectsManager } from '../../components/admin/ProjectsManager';
import { SkillsManager } from '../../components/admin/SkillsManager';
import { ServicesManager } from '../../components/admin/ServicesManager';
import { AboutForm } from '../../components/admin/AboutForm';
import { ExperienceManager } from '../../components/admin/ExperienceManager';

export function Dashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('settings');

  const tabs = [
    { id: 'settings', label: 'Site Settings', icon: Settings },
    { id: 'projects', label: 'Projects', icon: Layout },
    { id: 'skills', label: 'Skills', icon: Code2 },
    { id: 'experience', label: 'Experience', icon: UserIcon },
    { id: 'services', label: 'Services', icon: Briefcase },
    { id: 'about', label: 'About', icon: UserIcon },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-12 flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar Navigation */}
        <div className="w-full lg:w-64 flex-shrink-0 flex flex-col gap-2">
          <div className="mb-6 px-4">
            <h2 className="font-display font-bold text-xl tracking-widest uppercase">Admin Panel</h2>
            <p className="font-mono text-xs text-primary mt-1 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              SESSION ACTIVE
            </p>
            <p className="font-mono text-[10px] text-muted-foreground mt-1 truncate" title={user?.email}>
              {user?.email}
            </p>
          </div>

          <div className="flex-1 space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-300 font-mono text-sm tracking-widest uppercase ${
                    isActive 
                      ? 'bg-primary/10 text-primary border border-primary/30 shadow-glow-primary' 
                      : 'text-muted-foreground hover:bg-card hover:text-white border border-transparent'
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              );
            })}
          </div>

        </div>

        {/* Main Content Area */}
        <div className="flex-1 bg-background-secondary border border-border rounded-xl shadow-elevated p-6 min-h-[500px]">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center gap-3 mb-8 pb-4 border-b border-border/50">
              <LayoutDashboard className="text-primary" />
              <h3 className="font-display text-2xl font-bold">{tabs.find(t => t.id === activeTab)?.label}</h3>
            </div>
            
            {/* Dynamic Content Based on Tab */}
            {activeTab === 'settings' && <SettingsForm />}
            {activeTab === 'projects' && <ProjectsManager />}
            {activeTab === 'skills' && <SkillsManager />}
            {activeTab === 'experience' && <ExperienceManager />}
            {activeTab === 'services' && <ServicesManager />}
            {activeTab === 'about' && <AboutForm />}

          </motion.div>
        </div>
      </main>
    </div>
  );
}
