-- Supabase Schema for Hypercar Dashboard Garage

-- Enable Row Level Security
-- Everyone can read, only authenticated users can insert/update/delete

-- 1. Site Settings
CREATE TABLE site_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  tagline TEXT NOT NULL,
  bio TEXT,
  github_url TEXT,
  linkedin_url TEXT,
  resume_url TEXT,
  email TEXT,
  phone TEXT,
  location TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view site settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage site settings" ON site_settings FOR ALL USING (auth.role() = 'authenticated');

-- 2. Projects
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  tags TEXT[] NOT NULL,
  github_url TEXT,
  live_url TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage projects" ON projects FOR ALL USING (auth.role() = 'authenticated');

-- 3. Skills
CREATE TABLE skills (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL,
  score INTEGER NOT NULL,
  skills_list TEXT[] NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view skills" ON skills FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage skills" ON skills FOR ALL USING (auth.role() = 'authenticated');

-- 4. Services
CREATE TABLE services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon_name TEXT NOT NULL, -- e.g., 'Zap', 'Server', 'Shield'
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view services" ON services FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage services" ON services FOR ALL USING (auth.role() = 'authenticated');

-- Default Seed Data
INSERT INTO site_settings (name, role, tagline, bio, github_url, linkedin_url, resume_url, email)
VALUES (
  'JOHN DOE', 
  'Full-Stack Performance Engineer', 
  'Building high-performance, precision-engineered web applications. Fast, secure, and visually stunning digital experiences.',
  'I build digital engines. My focus is on the intersection of blistering performance, robust architecture, and precision aesthetics.',
  'https://github.com',
  'https://linkedin.com',
  'https://example.com/resume.pdf',
  'hello@johndoe.com'
);

-- 5. Experience
CREATE TABLE experience (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  value TEXT NOT NULL,
  label TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0
);

ALTER TABLE experience ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view experience" ON experience FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage experience" ON experience FOR ALL USING (auth.role() = 'authenticated');

-- Initial Seed Data for Experience
INSERT INTO experience (value, label, sort_order) VALUES 
('5+', 'Years Exp', 0),
('30+', 'Projects', 1),
('60', 'FPS UI', 2),
('99%', 'Uptime', 3);

-- 6. Storage Policies (Run these in SQL Editor to fix upload errors)
-- CREATE POLICY "Allow public resume read" ON storage.objects FOR SELECT USING (bucket_id = 'resumes');
-- CREATE POLICY "Allow authenticated resume uploads" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'resumes');
-- CREATE POLICY "Allow authenticated resume updates" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'resumes');
-- CREATE POLICY "Allow authenticated resume deletes" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'resumes');
