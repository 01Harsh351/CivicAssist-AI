-- =========================================================================
-- CIVICASSIST AI — PRODUCTION SUPABASE DATABASE SCHEMA
-- =========================================================================
-- This script provisions the complete relational schema, foreign key relations,
-- Row-Level Security (RLS) policies, and automated user profile sync triggers.
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql
-- =========================================================================

-- 1. CITIZEN PROFILES TABLE
-- Stores profile details, phone numbers, and language preferences for users.
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  mobile TEXT,
  language TEXT DEFAULT 'en',
  state TEXT,
  occupation TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Trigger: Automatically create public.profiles entry upon auth.users signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, mobile, language)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.email,
    COALESCE(new.raw_user_meta_data->>'mobile', ''),
    COALESCE(new.raw_user_meta_data->>'language', 'en')
  )
  ON CONFLICT (id) DO UPDATE
  SET
    full_name = EXCLUDED.full_name,
    mobile = EXCLUDED.mobile,
    language = EXCLUDED.language,
    updated_at = timezone('utc'::text, now());
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- 2. APPLICATION JOURNEYS TABLE
-- Tracks active public service application workflows, stages, docket IDs, and deadlines.
CREATE TABLE IF NOT EXISTS public.application_journeys (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  service_id TEXT NOT NULL,
  service_name TEXT NOT NULL,
  category TEXT NOT NULL,
  state TEXT NOT NULL,
  reference_number TEXT,
  current_stage TEXT NOT NULL DEFAULT 'service_identified',
  stage_date TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  notes TEXT,
  documents_status JSONB NOT NULL DEFAULT '{}'::jsonb,
  reminder_deadline JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_journeys_user_id ON public.application_journeys(user_id);
CREATE INDEX IF NOT EXISTS idx_journeys_service_id ON public.application_journeys(service_id);

ALTER TABLE public.application_journeys ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own application journeys"
  ON public.application_journeys FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own application journeys"
  ON public.application_journeys FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own application journeys"
  ON public.application_journeys FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own application journeys"
  ON public.application_journeys FOR DELETE
  USING (auth.uid() = user_id);


-- 3. SAVED SERVICES TABLE
-- Stores bookmarked government schemes and public services for quick access.
CREATE TABLE IF NOT EXISTS public.saved_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  service_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  UNIQUE(user_id, service_id)
);

CREATE INDEX IF NOT EXISTS idx_saved_services_user ON public.saved_services(user_id);

ALTER TABLE public.saved_services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own saved services"
  ON public.saved_services FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can save a service"
  ON public.saved_services FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete a saved service"
  ON public.saved_services FOR DELETE
  USING (auth.uid() = user_id);


-- 4. CITIZEN DOCUMENT READINESS TABLE
-- Stores document readiness statuses (ready, missing, unsure) for standard citizen documents.
CREATE TABLE IF NOT EXISTS public.user_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  doc_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'unsure', -- 'ready' | 'missing' | 'unsure'
  notes TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  UNIQUE(user_id, doc_id)
);

CREATE INDEX IF NOT EXISTS idx_user_documents_user ON public.user_documents(user_id);

ALTER TABLE public.user_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own document statuses"
  ON public.user_documents FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own document statuses"
  ON public.user_documents FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own document statuses"
  ON public.user_documents FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own document statuses"
  ON public.user_documents FOR DELETE
  USING (auth.uid() = user_id);


-- 5. CITIZEN QUERIES & INPUTS TABLE
-- Records voice inputs, scanned document extracts, and citizen search queries with timestamps.
CREATE TABLE IF NOT EXISTS public.citizen_queries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  query_text TEXT NOT NULL,
  input_type TEXT NOT NULL DEFAULT 'text', -- 'text' | 'voice' | 'document_upload'
  document_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_citizen_queries_user ON public.citizen_queries(user_id);

ALTER TABLE public.citizen_queries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own queries"
  ON public.citizen_queries FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can record their queries"
  ON public.citizen_queries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their queries"
  ON public.citizen_queries FOR DELETE
  USING (auth.uid() = user_id);
