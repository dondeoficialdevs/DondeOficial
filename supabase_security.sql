-- SECURITY FIX SCRIPT FOR DIRECTORIO COMERCIAL
-- This script enables Row Level Security (RLS) on all tables and defines policies
-- to allow the application to function while securing the data.

-- 1. ENABLE RLS ON ALL TABLES
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Legacy Tables (Lock down completely from public API)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.refresh_tokens ENABLE ROW LEVEL SECURITY;


-- 2. DEFINE POLICIES
-- NOTE: We use "TO authenticated" to allow admins (logged in users) to do everything.
-- We use "TO anon" for public access.

-- === CATEGORIES ===
-- Public can view categories
CREATE POLICY "Public can view categories" 
ON public.categories FOR SELECT 
TO anon, authenticated 
USING (true);

-- Only admins can modify
CREATE POLICY "Admins can manage categories" 
ON public.categories FOR ALL 
TO authenticated 
USING (true);


-- === BUSINESSES ===
-- Public can view businesses
CREATE POLICY "Public can view businesses" 
ON public.businesses FOR SELECT 
TO anon, authenticated 
USING (true);

-- Only admins can modify
CREATE POLICY "Admins can manage businesses" 
ON public.businesses FOR ALL 
TO authenticated 
USING (true);


-- === BUSINESS IMAGES ===
-- Public can view images
CREATE POLICY "Public can view business_images" 
ON public.business_images FOR SELECT 
TO anon, authenticated 
USING (true);

-- Only admins can modify
CREATE POLICY "Admins can manage business_images" 
ON public.business_images FOR ALL 
TO authenticated 
USING (true);


-- === PROMOTIONS ===
-- Public can view promotions
CREATE POLICY "Public can view promotions" 
ON public.promotions FOR SELECT 
TO anon, authenticated 
USING (true);

-- Only admins can modify
CREATE POLICY "Admins can manage promotions" 
ON public.promotions FOR ALL 
TO authenticated 
USING (true);


-- === REVIEWS ===
-- Public can view reviews
CREATE POLICY "Public can view reviews" 
ON public.reviews FOR SELECT 
TO anon, authenticated 
USING (true);

-- Public can write reviews (Anyone can create a review)
CREATE POLICY "Public can create reviews" 
ON public.reviews FOR INSERT 
TO anon, authenticated 
WITH CHECK (true);

-- Only admins can delete/modify reviews
CREATE POLICY "Admins can manage reviews" 
ON public.reviews FOR UPDATE 
TO authenticated 
USING (true);

CREATE POLICY "Admins can delete reviews" 
ON public.reviews FOR DELETE 
TO authenticated 
USING (true);


-- === LEADS (Contact Form) ===
-- Public can create leads
CREATE POLICY "Public can create leads" 
ON public.leads FOR INSERT 
TO anon, authenticated 
WITH CHECK (true);

-- Only admins can view leads
CREATE POLICY "Admins can view leads" 
ON public.leads FOR SELECT 
TO authenticated 
USING (true);


-- === NEWSLETTER SUBSCRIBERS ===
-- Public can subscribe
CREATE POLICY "Public can create subscribers" 
ON public.newsletter_subscribers FOR INSERT 
TO anon, authenticated 
WITH CHECK (true);

-- Only admins can view subscribers
CREATE POLICY "Admins can view subscribers" 
ON public.newsletter_subscribers FOR SELECT 
TO authenticated 
USING (true);

-- Only admins can delete subscribers
CREATE POLICY "Admins can delete subscribers" 
ON public.newsletter_subscribers FOR DELETE 
TO authenticated 
USING (true);


-- === SITE SETTINGS ===
-- Public can view settings (like logo)
CREATE POLICY "Public can view site_settings" 
ON public.site_settings FOR SELECT 
TO anon, authenticated 
USING (true);

-- Only admins can modify
CREATE POLICY "Admins can manage site_settings" 
ON public.site_settings FOR ALL 
TO authenticated 
USING (true);


-- === LEGACY USERS & TOKENS ===
-- No policies created implies default DENY ALL. 
-- These tables will be inaccessible via the API, which is what we want for security.
-- If the app creates its own users in `public.users` via backend code using service_role key, it will still work.
-- But standard API requests will fail, protecting the passwords.
