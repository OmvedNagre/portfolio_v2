import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Save, Loader2 } from 'lucide-react';

export function SettingsForm() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    role: '',
    tagline: '',
    github_url: '',
    linkedin_url: '',
    resume_url: '',
  });
  const [uploadingResume, setUploadingResume] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .limit(1)
        .single();
      
      if (error) {
        console.error('Error fetching settings:', error);
      } else if (data) {
        setFormData(data);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!e.target.files || e.target.files.length === 0) return;
      const file = e.target.files[0];
      setUploadingResume(true);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `resume_${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('resumes')
        .getPublicUrl(fileName);

      setFormData({ ...formData, resume_url: publicUrl });
      alert('Resume uploaded! Click SAVE SETTINGS to apply changes.');
    } catch (error) {
      console.error('Error uploading:', error);
      alert('Failed to upload resume. Make sure you created the "resumes" bucket.');
    } finally {
      setUploadingResume(false);
    }
  };

  const handleRemoveResume = async () => {
    if (!confirm('Are you sure you want to remove the resume?')) return;
    
    try {
      if (formData.resume_url) {
        const urlParts = formData.resume_url.split('/');
        const fileName = urlParts[urlParts.length - 1];
        if (fileName) {
          await supabase.storage.from('resumes').remove([fileName]);
        }
      }

      setFormData({ ...formData, resume_url: '' });
      if (formData.id) {
        await supabase.from('site_settings').update({ resume_url: null }).eq('id', formData.id);
      }
      alert('Resume removed successfully!');
    } catch (error) {
      console.error('Error removing resume:', error);
      alert('Failed to remove resume. Make sure you added the DELETE storage policy.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      if (formData.id) {
        await supabase.from('site_settings').update(formData).eq('id', formData.id);
      } else {
        // Handle insert if no record exists yet
        const { id, ...insertData } = formData;
        const { data } = await supabase.from('site_settings').insert([insertData]).select().single();
        if (data) setFormData(data);
      }
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-primary" /></div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="font-mono text-xs text-muted-foreground uppercase tracking-widest">Name</label>
          <input 
            type="text" 
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full bg-background border border-border rounded-md px-4 py-2 text-white font-body focus:outline-none focus:border-primary transition-colors"
          />
        </div>
        <div className="space-y-2">
          <label className="font-mono text-xs text-muted-foreground uppercase tracking-widest">Role</label>
          <input 
            type="text" 
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
            className="w-full bg-background border border-border rounded-md px-4 py-2 text-white font-body focus:outline-none focus:border-primary transition-colors"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="font-mono text-xs text-muted-foreground uppercase tracking-widest">Tagline</label>
        <input 
          type="text" 
          name="tagline"
          value={formData.tagline}
          onChange={handleChange}
          required
          className="w-full bg-background border border-border rounded-md px-4 py-2 text-white font-body focus:outline-none focus:border-primary transition-colors"
        />
      </div>



      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="font-mono text-xs text-muted-foreground uppercase tracking-widest">GitHub URL</label>
          <input 
            type="url" 
            name="github_url"
            value={formData.github_url}
            onChange={handleChange}
            className="w-full bg-background border border-border rounded-md px-4 py-2 text-white font-body focus:outline-none focus:border-primary transition-colors"
          />
        </div>
        <div className="space-y-2">
          <label className="font-mono text-xs text-muted-foreground uppercase tracking-widest">LinkedIn URL</label>
          <input 
            type="url" 
            name="linkedin_url"
            value={formData.linkedin_url}
            onChange={handleChange}
            className="w-full bg-background border border-border rounded-md px-4 py-2 text-white font-body focus:outline-none focus:border-primary transition-colors"
          />
        </div>
        <div className="space-y-2 md:col-span-2 border border-border p-4 rounded-md bg-background-secondary">
          <label className="font-mono text-xs text-muted-foreground uppercase tracking-widest flex justify-between">
            <span>Resume (PDF)</span>
            {formData.resume_url && (
              <div className="flex gap-4">
                <a href={formData.resume_url} target="_blank" rel="noreferrer" className="text-primary hover:underline">
                  View Current
                </a>
                <button type="button" onClick={handleRemoveResume} className="text-red-500 hover:underline">
                  Remove
                </button>
              </div>
            )}
          </label>
          <div className="flex items-center gap-4 mt-2">
            <input 
              type="file" 
              accept=".pdf"
              onChange={handleFileUpload}
              disabled={uploadingResume}
              className="text-white font-body text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-background hover:file:bg-primary/90 transition-colors"
            />
            {uploadingResume && <Loader2 size={16} className="animate-spin text-primary" />}
          </div>
        </div>
      </div>

      <button 
        type="submit" 
        disabled={isSaving}
        className="btn-mechanical bg-primary text-background font-bold px-6 py-2 rounded-md shadow-glow-primary hover:shadow-[0_0_20px_hsl(var(--primary-glow))] flex items-center gap-2 mt-4"
      >
        {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
        {isSaving ? 'SAVING...' : 'SAVE SETTINGS'}
      </button>
    </form>
  );
}
