import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Code2, ExternalLink } from 'lucide-react';
import { supabase } from '../lib/supabase';

function ProjectCard({ project, index }: { project: any; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.1 }}
      className="w-80 flex-shrink-0 card-metallic dashboard-highlight group relative h-96 flex flex-col"
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={project.image_url} 
          alt={project.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 bg-background-secondary"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent"></div>
        
        {/* Quick Action Overlay */}
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
          {project.github_url && (
            <a 
              href={project.github_url}
              onClick={(e) => e.stopPropagation()}
              target="_blank"
              rel="noreferrer"
              className="p-3 bg-card rounded-full text-white hover:text-primary hover:shadow-glow-primary transition-all"
            >
              <Code2 size={20} />
            </a>
          )}
          {project.live_url && (
            <a 
              href={project.live_url}
              onClick={(e) => e.stopPropagation()}
              target="_blank"
              rel="noreferrer"
              className="p-3 bg-card rounded-full text-white hover:text-primary hover:shadow-glow-primary transition-all"
            >
              <ExternalLink size={20} />
            </a>
          )}
        </div>
      </div>
      
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-display text-xl font-bold group-hover:text-primary transition-colors duration-300">
            {project.title}
          </h3>
          {project.status === 'In Progress' && (
            <span className="font-mono text-[9px] uppercase tracking-widest text-primary bg-primary/10 border border-primary/30 px-2 py-1 rounded flex-shrink-0">
              In Progress
            </span>
          )}
        </div>
        <p className="text-sm text-muted-foreground flex-1 font-body">
          {project.description}
        </p>
        
        <div className="flex flex-wrap gap-2 mt-4">
          {project.tags?.slice(0, 3).map((tag: string, i: number) => (
            <span key={i} className="tech-badge">
              {tag}
            </span>
          ))}
          {project.tags?.length > 3 && (
            <span className="tech-badge">+{project.tags.length - 3}</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export function ProjectsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      const { data } = await supabase.from('projects').select('*').order('sort_order', { ascending: true });
      if (data) setProjects(data);
    };
    fetchProjects();
  }, []);

  const half = Math.ceil(projects.length / 2);
  const row1 = projects.slice(0, half);
  const row2 = projects.slice(half);

  // Seamless loop trick: duplicate exactly twice
  const topRow = [...row1, ...row1];
  const bottomRow = [...row2, ...row2].reverse();

  if (projects.length === 0) return null;

  return (
    <section id="projects" className="py-24 bg-background border-t border-border overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight mb-4">
            MY <span className="text-gradient-primary">WORK</span>
          </h2>
          <div className="racing-stripe mb-8"></div>
        </motion.div>
      </div>

      <div className="relative w-full overflow-hidden flex flex-col gap-8 pb-12 mask-edges">
        {/* Top Row - Moves Left */}
        {topRow.length > 0 && (
          <div className="flex w-[fit-content]">
            <motion.div
              animate={{ x: ['0%', '-50%'] }}
              transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
              className="flex gap-6 pr-6"
            >
              {topRow.map((project, index) => (
                <ProjectCard key={`top-${index}`} project={project} index={index} />
              ))}
            </motion.div>
          </div>
        )}

        {/* Bottom Row - Moves Right */}
        {bottomRow.length > 0 && (
          <div className="flex w-[fit-content] self-end">
            <motion.div
              animate={{ x: ['-50%', '0%'] }}
              transition={{ duration: 35, repeat: Infinity, ease: 'linear' }}
              className="flex gap-6 pr-6"
            >
              {bottomRow.map((project, index) => (
                <ProjectCard key={`bottom-${index}`} project={project} index={index} />
              ))}
            </motion.div>
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 flex justify-center">
        <motion.button
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="btn-mechanical bg-transparent border border-primary text-primary px-8 py-3 rounded-md hover:bg-primary/10 shadow-glow-primary hover:shadow-[0_0_20px_hsl(var(--primary-glow))]"
        >
          View All Projects
        </motion.button>
      </div>
    </section>
  );
}
