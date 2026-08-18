import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Edit2, Trash2, Loader2, Save, X } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  description: string;
  image_url: string;
  tags: string[];
  github_url: string;
  live_url: string;
  status: string;
  sort_order: number;
}

export function ProjectsManager() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<Partial<Project>>({
    title: '', description: '', image_url: '', tags: [], github_url: '', live_url: '', status: 'Completed', sort_order: 0
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setIsLoading(true);
    const { data } = await supabase.from('projects').select('*').order('sort_order', { ascending: true });
    if (data) setProjects(data);
    setIsLoading(false);
  };

  const handleEdit = (project: Project) => {
    setFormData(project);
    setEditingId(project.id);
    setIsEditing(true);
  };

  const handleAddNew = () => {
    setFormData({ title: '', description: '', image_url: '', tags: [], github_url: '', live_url: '', status: 'Completed', sort_order: projects.length });
    setEditingId(null);
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      await supabase.from('projects').delete().eq('id', id);
      fetchProjects();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await supabase.from('projects').update(formData).eq('id', editingId);
    } else {
      await supabase.from('projects').insert([formData]);
    }
    setIsEditing(false);
    fetchProjects();
  };

  if (isLoading && !isEditing) {
    return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-primary" /></div>;
  }

  if (isEditing) {
    return (
      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl bg-card p-6 rounded-lg border border-border">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-display font-bold text-lg">{editingId ? 'Edit Project' : 'New Project'}</h4>
          <button type="button" onClick={() => setIsEditing(false)} className="text-muted-foreground hover:text-white"><X size={20}/></button>
        </div>
        
        <div className="space-y-2">
          <label className="font-mono text-xs text-muted-foreground">Title</label>
          <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required className="w-full bg-background border border-border rounded-md px-3 py-2 text-white font-body focus:border-primary focus:outline-none"/>
        </div>
        
        <div className="space-y-2">
          <label className="font-mono text-xs text-muted-foreground">Description</label>
          <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required rows={3} className="w-full bg-background border border-border rounded-md px-3 py-2 text-white font-body focus:border-primary focus:outline-none"/>
        </div>

        <div className="space-y-2">
          <label className="font-mono text-xs text-muted-foreground">Image URL</label>
          <input type="text" value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})} className="w-full bg-background border border-border rounded-md px-3 py-2 text-white font-body focus:border-primary focus:outline-none"/>
        </div>

        <div className="space-y-2">
          <label className="font-mono text-xs text-muted-foreground">Tags (comma separated)</label>
          <input type="text" value={formData.tags?.join(', ')} onChange={e => setFormData({...formData, tags: e.target.value.split(',').map(t=>t.trim())})} required className="w-full bg-background border border-border rounded-md px-3 py-2 text-white font-body focus:border-primary focus:outline-none"/>
        </div>

        <div className="space-y-2">
          <label className="font-mono text-xs text-muted-foreground">Project Status</label>
          <select 
            value={formData.status} 
            onChange={e => setFormData({...formData, status: e.target.value})} 
            className="w-full bg-background border border-border rounded-md px-3 py-2 text-white font-body focus:border-primary focus:outline-none"
          >
            <option value="Completed">Completed</option>
            <option value="In Progress">In Progress</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="font-mono text-xs text-muted-foreground">GitHub URL</label>
            <input type="url" value={formData.github_url} onChange={e => setFormData({...formData, github_url: e.target.value})} className="w-full bg-background border border-border rounded-md px-3 py-2 text-white font-body focus:border-primary focus:outline-none"/>
          </div>
          <div className="space-y-2">
            <label className="font-mono text-xs text-muted-foreground">Live URL</label>
            <input type="url" value={formData.live_url} onChange={e => setFormData({...formData, live_url: e.target.value})} className="w-full bg-background border border-border rounded-md px-3 py-2 text-white font-body focus:border-primary focus:outline-none"/>
          </div>
        </div>

        <button type="submit" className="btn-mechanical bg-primary text-background font-bold px-6 py-2 rounded-md flex items-center gap-2 mt-4">
          <Save size={18} /> SAVE PROJECT
        </button>
      </form>
    );
  }

  return (
    <div>
      <div className="flex justify-end mb-6">
        <button onClick={handleAddNew} className="btn-mechanical bg-background border border-primary text-primary px-4 py-2 rounded-md hover:bg-primary/10 flex items-center gap-2">
          <Plus size={18} /> ADD PROJECT
        </button>
      </div>

      <div className="grid gap-4">
        {projects.length === 0 ? (
          <p className="text-muted-foreground font-mono text-sm">No projects found. Add one above.</p>
        ) : (
          projects.map((project) => (
            <div key={project.id} className="bg-card border border-border rounded-lg p-4 flex items-center justify-between group hover:border-primary/50 transition-colors">
              <div className="flex items-center gap-4">
                <img src={project.image_url} alt="" className="w-16 h-16 object-cover rounded-md bg-background-secondary" />
                <div>
                  <h4 className="font-display font-bold text-lg flex items-center gap-2">
                    {project.title}
                    {project.status === 'In Progress' && (
                      <span className="font-mono text-[9px] uppercase tracking-widest text-primary bg-primary/10 border border-primary/30 px-1.5 py-0.5 rounded">In Progress</span>
                    )}
                  </h4>
                  <div className="flex gap-2 mt-1">
                    {project.tags.map(t => <span key={t} className="font-mono text-[10px] px-1.5 py-0.5 bg-background border border-border rounded text-muted-foreground">{t}</span>)}
                  </div>
                </div>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleEdit(project)} className="p-2 text-muted-foreground hover:text-white bg-background rounded-md border border-border hover:border-white transition-colors">
                  <Edit2 size={16} />
                </button>
                <button onClick={() => handleDelete(project.id)} className="p-2 text-muted-foreground hover:text-red-500 bg-background rounded-md border border-border hover:border-red-500 transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
