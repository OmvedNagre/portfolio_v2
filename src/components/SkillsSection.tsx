import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { supabase } from '../lib/supabase';



export function SkillsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [skills, setSkills] = useState<any[]>([]);

  useEffect(() => {
    const fetchSkills = async () => {
      const { data } = await supabase.from('skills').select('*').order('sort_order', { ascending: true });
      if (data) setSkills(data);
    };
    fetchSkills();
  }, []);

  return (
    <section id="skills" className="py-24 bg-background-secondary border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div ref={ref} className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight mb-4">
              PERFORMANCE <span className="text-gradient-primary">METRICS</span>
            </h2>
            <div className="racing-stripe mb-8"></div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8">
          {skills.map((group, index) => (
            <motion.div
              key={group.category}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="card-metallic glass-panel p-8"
            >
              <div className="mb-6">
                <h3 className="font-display text-xl font-bold text-white mb-2">{group.category}</h3>
                <div className="w-12 h-1 bg-primary/30 rounded"></div>
              </div>
              
              <div className="mt-6">
                <div className="flex flex-wrap gap-2">
                  {group.skills_list?.map((skill: string, idx: number) => {
                    const popDelay = (index * 0.2) + 0.1 + (idx * 0.1);
                    return (
                      <motion.span
                        key={skill}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.4, delay: popDelay }}
                        className="tech-badge bg-background"
                      >
                        {skill}
                      </motion.span>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
