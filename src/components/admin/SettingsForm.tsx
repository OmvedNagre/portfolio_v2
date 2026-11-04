import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Save, Loader2 } from 'lucide-react';

export function SettingsForm() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    tagline: '',
    github_url: '',
    linkedin_url: '',
  });
  const [currentResume, setCurrentResume] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [remove, setRemove] = useState(false);
  const [loadError, setLoadError] = useState('');
  useEffect(() => {
    supabase.from('site_settings').select('name,role,tagline,github_url,linkedin_url,resume_url').maybeSingle().then(({ data, error }) => {
      if (error) setLoadError(error.message);
      if (data) {
        setFormData({ name: data.name, role: data.role, tagline: data.tagline, github_url: data.github_url ?? '', linkedin_url: data.linkedin_url ?? '' });
        setCurrentResume(data.resume_url);
      }
      setIsLoading(false);
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const bucket = supabase.storage.from('resumes');
    const baseUrl = bucket.getPublicUrl('').data.publicUrl;
    setIsSaving(true);
    try {
      let nextUrl = currentResume;
      let uploadedPath: string | undefined;
      if (file) {
        if (file.size > 5242880 || await file.slice(0, 5).text() !== '%PDF-') throw new Error('Choose a PDF of up to 5 MB.');
        uploadedPath = crypto.randomUUID() + '.pdf';
        const upload = await bucket.upload(uploadedPath, file, { contentType: 'application/pdf' });
        if (upload.error) throw upload.error;
        nextUrl = bucket.getPublicUrl(uploadedPath).data.publicUrl;
      } else if (remove) {
        nextUrl = null;
      }

      // Only change the résumé if the link seen by this editor is still current.
      const settings = supabase.from('site_settings');
      const update = settings.update({ ...formData, resume_url: nextUrl }).eq('singleton', true);
      const query = file || remove
        ? (currentResume === null ? update.is('resume_url', null) : update.eq('resume_url', currentResume))
        : settings.upsert({ singleton: true, ...formData }, { onConflict: 'singleton' });
      const result = await query.select('id').single();
      if (result.error) {
        // A missing HTTP response leaves commit status unknown. Never delete a possibly published file.
        if (uploadedPath && result.status >= 400 && result.status < 500 && result.status !== 408) {
          const cleanup = await bucket.remove([uploadedPath]);
          if (cleanup.error) throw new Error(result.error.message + ' Unused PDF cleanup failed: ' + cleanup.error.message);
        }
        throw result.error;
      }
      const oldUrl = currentResume;
      setCurrentResume(nextUrl);
      setFile(null);
      setRemove(false);
      const input = form.elements.namedItem('resume') as HTMLInputElement;
      input.value = '';
      if (oldUrl && oldUrl !== nextUrl && oldUrl.startsWith(baseUrl)) {
        const cleanup = await bucket.remove([decodeURIComponent(oldUrl.slice(baseUrl.length))]);
        if (cleanup.error) {
          alert('Settings saved. Previous PDF cleanup failed: ' + cleanup.error.message);
          return;
        }
      }
      alert('Settings saved successfully!');
    } catch (error) {
      alert('Could not complete save: ' + (error instanceof Error ? error.message : (typeof error === 'object' && error && 'message' in error ? error.message : String(error))));
    } finally {
      setIsSaving(false);
    }
  };

  if (loadError) return <p role="alert">{loadError}</p>;
  if (isLoading) {
    return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-primary" /></div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="SettingsForm-name" className="font-mono text-xs text-muted-foreground uppercase tracking-widest">Name</label>
          <input id="SettingsForm-name"
            type="text" 
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full bg-background border border-border rounded-md px-4 py-2 text-white font-body focus:outline-none focus:border-primary transition-colors"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="SettingsForm-role" className="font-mono text-xs text-muted-foreground uppercase tracking-widest">Role</label>
          <input id="SettingsForm-role"
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
        <label htmlFor="SettingsForm-tagline" className="font-mono text-xs text-muted-foreground uppercase tracking-widest">Tagline</label>
        <input id="SettingsForm-tagline"
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
          <label htmlFor="SettingsForm-github-url" className="font-mono text-xs text-muted-foreground uppercase tracking-widest">GitHub URL</label>
          <input id="SettingsForm-github-url"
            type="url" 
            name="github_url"
            value={formData.github_url}
            onChange={handleChange}
            className="w-full bg-background border border-border rounded-md px-4 py-2 text-white font-body focus:outline-none focus:border-primary transition-colors"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="SettingsForm-linkedin-url" className="font-mono text-xs text-muted-foreground uppercase tracking-widest">LinkedIn URL</label>
          <input id="SettingsForm-linkedin-url"
            type="url" 
            name="linkedin_url"
            value={formData.linkedin_url}
            onChange={handleChange}
            className="w-full bg-background border border-border rounded-md px-4 py-2 text-white font-body focus:outline-none focus:border-primary transition-colors"
          />
        </div>
        <div className="space-y-2 md:col-span-2 border border-border p-4 rounded-md bg-background-secondary">
          <div className="font-mono text-xs text-muted-foreground uppercase tracking-widest flex justify-between">
            <label htmlFor="resume">Resume (PDF)</label>
            {currentResume && (
              <div className="flex gap-4">
                <a href={currentResume} target="_blank" rel="noreferrer" className="text-primary hover:underline">
                  View Current
                </a>
                <button type="button" onClick={() => { setRemove(!remove); setFile(null); }} className="text-red-500 hover:underline">
                  {remove ? 'Undo removal' : 'Remove on save'}
                </button>
              </div>
            )}
          </div>
          <div className="flex items-center gap-4 mt-2">
            <input 
              type="file" id="resume"
              accept=".pdf"
              name="resume" onChange={e => { setFile(e.target.files?.[0] ?? null); setRemove(false); }}
              disabled={isSaving}
              className="text-white font-body text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-background hover:file:bg-primary/90 transition-colors"
            />
            {file && <span>Ready to save</span>}
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
