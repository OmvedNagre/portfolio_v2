import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Edit2, Trash2, Loader2, Save, X } from 'lucide-react';

interface ExperienceStat {
  id: string;
  value: string;
  label: string;
  sort_order: number;
}

export function ExperienceManager() {
  const [stats, setStats] = useState<ExperienceStat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<Partial<ExperienceStat>>({
    value: '', label: '', sort_order: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setIsLoading(true);
    const { data } = await supabase.from('experience').select('*').order('sort_order', { ascending: true });
    if (data) setStats(data);
    setIsLoading(false);
  };

  const handleEdit = (stat: ExperienceStat) => {
    setFormData(stat);
    setEditingId(stat.id);
    setIsEditing(true);
  };

  const handleAddNew = () => {
    setFormData({ value: '', label: '', sort_order: stats.length });
    setEditingId(null);
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this stat?')) {
      await supabase.from('experience').delete().eq('id', id);
      fetchStats();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await supabase.from('experience').update(formData).eq('id', editingId);
    } else {
      await supabase.from('experience').insert([formData]);
    }
    setIsEditing(false);
    fetchStats();
  };

  if (isLoading && !isEditing) {
    return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-primary" /></div>;
  }

  if (isEditing) {
    return (
      <form onSubmit={handleSubmit} className="space-y-4 max-w-xl bg-card p-6 rounded-lg border border-border">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-display font-bold text-lg">{editingId ? 'Edit Stat' : 'New Stat'}</h4>
          <button type="button" onClick={() => setIsEditing(false)} className="text-muted-foreground hover:text-white"><X size={20}/></button>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="font-mono text-xs text-muted-foreground uppercase tracking-widest">Value (e.g. 5+)</label>
            <input 
              type="text" 
              value={formData.value} 
              onChange={e => setFormData({...formData, value: e.target.value})} 
              required 
              className="w-full bg-background border border-border rounded-md px-3 py-2 text-white font-body focus:border-primary focus:outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="font-mono text-xs text-muted-foreground uppercase tracking-widest">Label (e.g. Years Exp)</label>
            <input 
              type="text" 
              value={formData.label} 
              onChange={e => setFormData({...formData, label: e.target.value})} 
              required 
              className="w-full bg-background border border-border rounded-md px-3 py-2 text-white font-body focus:border-primary focus:outline-none"
            />
          </div>
        </div>

        <button type="submit" className="btn-mechanical bg-primary text-background font-bold px-6 py-2 rounded-md flex items-center gap-2 mt-4">
          <Save size={18} /> SAVE STAT
        </button>
      </form>
    );
  }

  return (
    <div>
      <div className="flex justify-end mb-6">
        <button onClick={handleAddNew} className="btn-mechanical bg-background border border-primary text-primary px-4 py-2 rounded-md hover:bg-primary/10 flex items-center gap-2">
          <Plus size={18} /> ADD STAT
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.length === 0 ? (
          <p className="text-muted-foreground font-mono text-sm col-span-4 text-center py-8">No experience stats found. Add one above.</p>
        ) : (
          stats.map((stat) => (
            <div key={stat.id} className="card-metallic p-6 border-border text-center relative group">
              <span className="block font-mono text-3xl font-bold text-primary mb-2">{stat.value}</span>
              <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest">{stat.label}</span>
              
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleEdit(stat)} className="p-1.5 text-muted-foreground hover:text-white bg-background rounded-md border border-border hover:border-white transition-colors">
                  <Edit2 size={12} />
                </button>
                <button onClick={() => handleDelete(stat.id)} className="p-1.5 text-muted-foreground hover:text-red-500 bg-background rounded-md border border-border hover:border-red-500 transition-colors">
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
