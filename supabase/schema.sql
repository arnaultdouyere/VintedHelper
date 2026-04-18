-- Supabase Schema Configuration for VintedHelper

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-------------------------------------------------------------------------------
-- 1. FOLDERS TABLE
-------------------------------------------------------------------------------
CREATE TABLE public.folders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    parent_id UUID REFERENCES public.folders(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.folders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own folders" ON public.folders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own folders" ON public.folders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own folders" ON public.folders FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own folders" ON public.folders FOR DELETE USING (auth.uid() = user_id);

-------------------------------------------------------------------------------
-- 2. PRODUCT PAGES TABLE (AI Drafts)
-------------------------------------------------------------------------------
CREATE TABLE public.product_pages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    folder_id UUID REFERENCES public.folders(id) ON DELETE CASCADE,
    title TEXT,
    description TEXT,
    price NUMERIC,
    hashtags TEXT,
    notes TEXT,
    status TEXT DEFAULT 'draft',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.product_pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own product pages" ON public.product_pages FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own product pages" ON public.product_pages FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own product pages" ON public.product_pages FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own product pages" ON public.product_pages FOR DELETE USING (auth.uid() = user_id);

-------------------------------------------------------------------------------
-- 3. MARKET RESEARCH PAGES TABLE
-------------------------------------------------------------------------------
CREATE TABLE public.market_research_pages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    folder_id UUID REFERENCES public.folders(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    price_min NUMERIC,
    price_max NUMERIC,
    source_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.market_research_pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own market research pages" ON public.market_research_pages FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own market research pages" ON public.market_research_pages FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own market research pages" ON public.market_research_pages FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own market research pages" ON public.market_research_pages FOR DELETE USING (auth.uid() = user_id);

-------------------------------------------------------------------------------
-- 4. IMAGES TABLE
-------------------------------------------------------------------------------
CREATE TABLE public.images (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    page_id UUID NOT NULL, -- references either product_pages or market_research_pages
    type TEXT NOT NULL CHECK (type IN ('product', 'research')),
    url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own images" ON public.images FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own images" ON public.images FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own images" ON public.images FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own images" ON public.images FOR DELETE USING (auth.uid() = user_id);

-------------------------------------------------------------------------------
-- 5. STORAGE BUCKET (assets)
-------------------------------------------------------------------------------
-- Note: Replace with true storage queries if running directly via Supabase API, 
-- or create the bucket manually via the Supabase Dashboard and set the RLS policies:
-- Bucket Name: "assets"
-- Public: true (so images can be viewed/copied as public urls easily)

INSERT INTO storage.buckets (id, name, public) VALUES ('assets', 'assets', true) ON CONFLICT DO NOTHING;

-- Storage RLS
CREATE POLICY "Users can upload their own assets" ON storage.objects FOR INSERT WITH CHECK (auth.uid() = owner AND bucket_id = 'assets');
CREATE POLICY "Users can update their own assets" ON storage.objects FOR UPDATE USING (auth.uid() = owner AND bucket_id = 'assets');
CREATE POLICY "Users can delete their own assets" ON storage.objects FOR DELETE USING (auth.uid() = owner AND bucket_id = 'assets');
-- Allow public access for reading if bucket is public, or restrict it
CREATE POLICY "Public Read assets" ON storage.objects FOR SELECT USING (bucket_id = 'assets');
