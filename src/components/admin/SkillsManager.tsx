import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Edit2, Trash2, Loader2, Save, X } from 'lucide-react';

interface Skill {
  id: string;
  category: string;
  score: number;
  skills_list: string[];
  sort_order: number;
}

export function SkillsManager() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [readError, setReadError] = useState('');
  const [busy, setBusy] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<Partial<Skill>>({
    category: '', score: 0, skills_list: [], sort_order: 0
  });

  const [revision, setRevision] = useState(0);
  const fetchSkills = () => setRevision(value => value + 1);
  useEffect(() => {
    let active = true;
    supabase.from('skills').select('*').order('sort_order', { ascending: true }).then(({ data, error }) => {
      if (!active) return;
      setReadError(error?.message ?? '');
      if (data) setSkills(data);
      setIsLoading(false);
    });
    return () => { active = false; };
  }, [revision]);

  const handleEdit = (skill: Skill) => {
    setFormData(skill);
    setEditingId(skill.id);
    setIsEditing(true);
  };

  const handleAddNew = () => {
    setFormData({ category: '', score: 0, skills_list: [], sort_order: Math.max(-1, ...skills.map(item => item.sort_order)) + 1 });
    setEditingId(null);
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this skill group?')) {
      setBusy(true);
      const { error } = await supabase.from('skills').delete().eq('id', id).select('id').single();
      setBusy(false);
      if (error) { alert(error.message); return; }
      fetchSkills();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const collection = supabase.from('skills');
    const query = editingId ? collection.update(formData).eq('id', editingId) : collection.insert(formData);
    const { error } = await query.select('id').single();
    setBusy(false);
    if (error) { alert(error.message); return; }
    setIsEditing(false);
    fetchSkills();
  };

  if (readError) return <p role="alert">{readError} <button onClick={fetchSkills}>Retry</button></p>;

  if (isLoading && !isEditing) {
    return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-primary" /></div>;
  }

  if (isEditing) {
    return (
      <form onSubmit={handleSubmit} className="space-y-4 max-w-xl bg-card p-6 rounded-lg border border-border">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-display font-bold text-lg">{editingId ? 'Edit Skill Group' : 'New Skill Group'}</h4>
          <button aria-label="Close editor" type="button" onClick={() => setIsEditing(false)} className="text-muted-foreground hover:text-white"><X size={20}/></button>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="SkillsManager-category-name" className="font-mono text-xs text-muted-foreground">Category Name</label>
          <input id="SkillsManager-category-name" type="text" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} required className="w-full bg-background border border-border rounded-md px-3 py-2 text-white font-body focus:border-primary focus:outline-none"/>
        </div>

        <div className="space-y-2">
          <label htmlFor="SkillsManager-skills-comma-separated" className="font-mono text-xs text-muted-foreground">Skills (comma separated)</label>
          <textarea id="SkillsManager-skills-comma-separated" value={formData.skills_list?.join(', ')} onChange={e => setFormData({...formData, skills_list: e.target.value.split(',').map(t=>t.trim())})} required rows={3} className="w-full bg-background border border-border rounded-md px-3 py-2 text-white font-body focus:border-primary focus:outline-none"/>
        </div>

        <button disabled={busy} type="submit" className="btn-mechanical bg-primary text-background font-bold px-6 py-2 rounded-md flex items-center gap-2 mt-4">
          <Save size={18} /> SAVE SKILLS
        </button>
      </form>
    );
  }

  return (
    <div>
      <div className="flex justify-end mb-6">
        <button onClick={handleAddNew} className="btn-mechanical bg-background border border-primary text-primary px-4 py-2 rounded-md hover:bg-primary/10 flex items-center gap-2">
          <Plus size={18} /> ADD SKILL GROUP
        </button>
      </div>

      <div className="grid gap-4">
        {skills.length === 0 ? (
          <p className="text-muted-foreground font-mono text-sm">No skills found. Add one above.</p>
        ) : (
          skills.map((skill) => (
            <div key={skill.id} className="bg-card border border-border rounded-lg p-4 flex items-center justify-between group hover:border-primary/50 transition-colors">
              <div>
                <h4 className="font-display font-bold text-lg flex items-center gap-3">
                  {skill.category} 
                </h4>
                <div className="flex flex-wrap gap-2 mt-2">
                  {skill.skills_list.map(t => <span key={t} className="font-mono text-[10px] px-1.5 py-0.5 bg-background border border-border rounded text-muted-foreground">{t}</span>)}
                </div>
              </div>
              <div className="flex gap-2 md:opacity-0 group-focus-within:opacity-100 group-hover:opacity-100 transition-opacity">
                <button aria-label="Edit entry" onClick={() => handleEdit(skill)} className="p-2 text-muted-foreground hover:text-white bg-background rounded-md border border-border hover:border-white transition-colors">
                  <Edit2 size={16} />
                </button>
                <button disabled={busy} aria-label="Delete entry" onClick={() => handleDelete(skill.id)} className="p-2 text-muted-foreground hover:text-red-500 bg-background rounded-md border border-border hover:border-red-500 transition-colors">
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
