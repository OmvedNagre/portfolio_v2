import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Save, Loader2 } from 'lucide-react';

export function AboutForm() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    bio: '',
    email: '',
    phone: '',
    location: '',
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data } = await supabase
        .from('site_settings')
        .select('id, bio, email, phone, location')
        .limit(1)
        .single();
      
      if (data) {
        setFormData({
          id: data.id,
          bio: data.bio || '',
          email: data.email || '',
          phone: data.phone || '',
          location: data.location || ''
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      if (formData.id) {
        const { error } = await supabase.from('site_settings').update(formData).eq('id', formData.id);
        if (error) throw error;
      } else {
        const { id, ...insertData } = formData;
        const { data, error } = await supabase.from('site_settings').insert([insertData]).select().single();
        if (error) throw error;
        if (data) setFormData({ ...formData, id: data.id });
      }
      alert('About details saved successfully!');
    } catch (error: any) {
      console.error('Error saving:', error);
      alert('Failed to save details: ' + (error.message || 'Unknown error. Check console.'));
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-primary" /></div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl bg-card p-6 rounded-lg border border-border">
      <div className="space-y-2">
        <label className="font-mono text-xs text-muted-foreground uppercase tracking-widest">Driver Profile Bio (About Section)</label>
        <textarea 
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          rows={6}
          required
          className="w-full bg-background border border-border rounded-md px-4 py-2 text-white font-body focus:outline-none focus:border-primary transition-colors resize-y"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="font-mono text-xs text-muted-foreground uppercase tracking-widest">Email Address</label>
          <input 
            type="email" 
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full bg-background border border-border rounded-md px-4 py-2 text-white font-body focus:outline-none focus:border-primary transition-colors"
          />
        </div>
        <div className="space-y-2">
          <label className="font-mono text-xs text-muted-foreground uppercase tracking-widest">Phone Number</label>
          <input 
            type="text" 
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+1 (555) 123-4567"
            className="w-full bg-background border border-border rounded-md px-4 py-2 text-white font-body focus:outline-none focus:border-primary transition-colors"
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <label className="font-mono text-xs text-muted-foreground uppercase tracking-widest">Location / Base of Operations</label>
          <input 
            type="text" 
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="San Francisco, CA"
            className="w-full bg-background border border-border rounded-md px-4 py-2 text-white font-body focus:outline-none focus:border-primary transition-colors"
          />
        </div>
      </div>

      <button 
        type="submit" 
        disabled={isSaving}
        className="btn-mechanical bg-primary text-background font-bold px-6 py-2 rounded-md flex items-center gap-2 mt-4"
      >
        {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
        {isSaving ? 'SAVING...' : 'SAVE DETAILS'}
      </button>
    </form>
  );
}
