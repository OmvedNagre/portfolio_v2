import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Edit2, Trash2, Loader2, Save, X, Server, Zap, Shield, Component } from 'lucide-react';

interface Service {
  id: string;
  title: string;
  description: string;
  icon_name: string;
  sort_order: number;
}

const AVAILABLE_ICONS = [
  { name: 'Zap', icon: Zap },
  { name: 'Server', icon: Server },
  { name: 'Shield', icon: Shield },
  { name: 'Component', icon: Component },
];

export function ServicesManager() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<Partial<Service>>({
    title: '', description: '', icon_name: 'Zap', sort_order: 0
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setIsLoading(true);
    const { data } = await supabase.from('services').select('*').order('sort_order', { ascending: true });
    if (data) setServices(data);
    setIsLoading(false);
  };

  const handleEdit = (service: Service) => {
    setFormData(service);
    setEditingId(service.id);
    setIsEditing(true);
  };

  const handleAddNew = () => {
    setFormData({ title: '', description: '', icon_name: 'Zap', sort_order: services.length });
    setEditingId(null);
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this service?')) {
      await supabase.from('services').delete().eq('id', id);
      fetchServices();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await supabase.from('services').update(formData).eq('id', editingId);
    } else {
      await supabase.from('services').insert([formData]);
    }
    setIsEditing(false);
    fetchServices();
  };

  const renderIcon = (iconName: string) => {
    const iconObj = AVAILABLE_ICONS.find(i => i.name === iconName) || AVAILABLE_ICONS[0];
    const Icon = iconObj.icon;
    return <Icon size={20} />;
  };

  if (isLoading && !isEditing) {
    return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-primary" /></div>;
  }

  if (isEditing) {
    return (
      <form onSubmit={handleSubmit} className="space-y-4 max-w-xl bg-card p-6 rounded-lg border border-border">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-display font-bold text-lg">{editingId ? 'Edit Service' : 'New Service'}</h4>
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
          <label className="font-mono text-xs text-muted-foreground">Icon</label>
          <div className="flex gap-4">
            {AVAILABLE_ICONS.map((iconObj) => {
              const Icon = iconObj.icon;
              const isSelected = formData.icon_name === iconObj.name;
              return (
                <button
                  key={iconObj.name}
                  type="button"
                  onClick={() => setFormData({...formData, icon_name: iconObj.name})}
                  className={`p-3 rounded-md border transition-all ${isSelected ? 'border-primary text-primary bg-primary/10 shadow-glow-primary' : 'border-border text-muted-foreground hover:bg-background-secondary hover:text-white'}`}
                >
                  <Icon size={24} />
                </button>
              )
            })}
          </div>
        </div>

        <button type="submit" className="btn-mechanical bg-primary text-background font-bold px-6 py-2 rounded-md flex items-center gap-2 mt-4">
          <Save size={18} /> SAVE SERVICE
        </button>
      </form>
    );
  }

  return (
    <div>
      <div className="flex justify-end mb-6">
        <button onClick={handleAddNew} className="btn-mechanical bg-background border border-primary text-primary px-4 py-2 rounded-md hover:bg-primary/10 flex items-center gap-2">
          <Plus size={18} /> ADD SERVICE
        </button>
      </div>

      <div className="grid gap-4">
        {services.length === 0 ? (
          <p className="text-muted-foreground font-mono text-sm">No services found. Add one above.</p>
        ) : (
          services.map((service) => (
            <div key={service.id} className="bg-card border border-border rounded-lg p-4 flex items-center justify-between group hover:border-primary/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-background border border-border rounded-lg text-muted-foreground group-hover:text-primary transition-colors">
                  {renderIcon(service.icon_name)}
                </div>
                <div>
                  <h4 className="font-display font-bold text-lg">{service.title}</h4>
                  <p className="font-mono text-xs text-muted-foreground line-clamp-1">{service.description}</p>
                </div>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleEdit(service)} className="p-2 text-muted-foreground hover:text-white bg-background rounded-md border border-border hover:border-white transition-colors">
                  <Edit2 size={16} />
                </button>
                <button onClick={() => handleDelete(service.id)} className="p-2 text-muted-foreground hover:text-red-500 bg-background rounded-md border border-border hover:border-red-500 transition-colors">
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
