-- ==========================================
-- VISIONGRID DATABASE MIGRATION SCRIPT
-- Run this in your Supabase SQL Editor
-- ==========================================

-- 1. Create users table
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Create categories table
CREATE TABLE IF NOT EXISTS public.categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create images table
CREATE TABLE IF NOT EXISTS public.images (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES public.categories(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    image_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Create wishlist table
CREATE TABLE IF NOT EXISTS public.wishlist (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    image_id INTEGER REFERENCES public.images(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, image_id)
);

-- 5. Disable Row-Level Security (RLS) on all tables for easy development access
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.images DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist DISABLE ROW LEVEL SECURITY;

-- 6. Seed default categories
INSERT INTO public.categories (name) VALUES 
('Nature'),
('Travel'),
('Art'),
('Technology'),
('Cars'),
('Animals'),
('Food'),
('People')
ON CONFLICT (name) DO NOTHING;

-- 7. Create Supabase Storage Bucket and enable Public Access policies via SQL
INSERT INTO storage.buckets (id, name, public) 
VALUES ('visiongrid-images', 'visiongrid-images', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'visiongrid-images');

DROP POLICY IF EXISTS "Public Upload" ON storage.objects;
CREATE POLICY "Public Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'visiongrid-images');
