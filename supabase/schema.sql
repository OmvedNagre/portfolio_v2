-- Supabase Schema for Hypercar Dashboard Garage

-- Enable Row Level Security

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

-- 2. Projects
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  tags TEXT[] NOT NULL,
  github_url TEXT,
  live_url TEXT,
  status TEXT DEFAULT 'Completed',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view projects" ON projects FOR SELECT USING (true);

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

-- 5. Experience
CREATE TABLE experience (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  value TEXT NOT NULL,
  label TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0
);

ALTER TABLE experience ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view experience" ON experience FOR SELECT USING (true);


-- Apply supabase/migrations/20261104_portfolio.sql next.
