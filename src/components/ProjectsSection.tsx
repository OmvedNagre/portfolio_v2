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
      className="w-full card-metallic dashboard-highlight group relative flex flex-col"
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={project.image_url} 
          alt={project.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 bg-background-secondary"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent"></div>
        
        {/* Quick Action Overlay */}
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm opacity-100 md:opacity-0 group-focus-within:opacity-100 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
          {project.github_url && (
            <a 
              aria-label={`GitHub repository for ${project.title}`} href={project.github_url}
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
              aria-label={`Live site for ${project.title}`} href={project.live_url}
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
  const [expanded, setExpanded] = useState(false);
  const [notice, setNotice] = useState("Loading projects…");
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      const { data, error } = await supabase.from('projects').select('*').order('sort_order', { ascending: true });
      setNotice(error ? 'Projects are temporarily unavailable.' : data?.length ? '' : 'No projects published yet.');
      if (data) setProjects(data);
    };
    fetchProjects();
  }, []);

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

      <div className="max-w-7xl mx-auto px-4">
        <p role="status">{notice}</p>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {(expanded ? projects : projects.slice(0, 3)).map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
        {projects.length > 3 && <button className="btn-mechanical mt-8 p-3 border" aria-expanded={expanded} onClick={() => setExpanded(!expanded)}>
          {expanded ? 'Show fewer projects' : 'View all projects'}
        </button>}
      </div>
    </section>
  );
}
