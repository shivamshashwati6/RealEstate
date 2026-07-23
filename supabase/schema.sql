-- ===================================================
-- Real Estate Marketplace Platform (EstateMarket)
-- PostgreSQL Database Schema & Row-Level Security (RLS)
-- Role-Based Multi-Dashboard Migration Script
-- ===================================================

-- 1. Create Enums if not exists
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('buyer', 'seller', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE listing_status AS ENUM ('draft', 'pending_approval', 'live', 'sold', 'rented', 'archived');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE property_type AS ENUM ('apartment', 'villa', 'house', 'plot', 'commercial', 'penthouse');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE listing_intent AS ENUM ('sale', 'rent');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE visit_status AS ENUM ('requested', 'confirmed', 'rejected', 'rescheduled', 'completed', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE report_status AS ENUM ('pending', 'reviewed', 'action_taken', 'dismissed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Public Users Table (`public.users`)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    role user_role DEFAULT 'buyer'::user_role NOT NULL,
    avatar_url TEXT,
    bio TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    is_suspended BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 3. Automatic Trigger to Sync `auth.users` to `public.users`
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, full_name, email, phone, role, avatar_url)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.email,
    new.raw_user_meta_data->>'phone',
    COALESCE((new.raw_user_meta_data->>'role')::public.user_role, 'buyer'::public.user_role),
    new.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role,
    phone = EXCLUDED.phone,
    avatar_url = EXCLUDED.avatar_url;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger attachment
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 4. Properties Table
CREATE TABLE IF NOT EXISTS public.properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    price NUMERIC(12, 2) NOT NULL,
    price_period TEXT DEFAULT 'total',
    intent listing_intent DEFAULT 'sale' NOT NULL,
    type property_type NOT NULL,
    status listing_status DEFAULT 'draft' NOT NULL,
    
    -- Specs
    bedrooms INT DEFAULT 0 NOT NULL,
    bathrooms INT DEFAULT 0 NOT NULL,
    area_sqft INT NOT NULL,
    parking_spaces INT DEFAULT 0 NOT NULL,
    furnished_status TEXT DEFAULT 'unfurnished',
    construction_status TEXT DEFAULT 'ready_to_move',
    built_year INT,
    
    -- Location
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    country TEXT DEFAULT 'India' NOT NULL,
    zip_code TEXT,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    
    amenities TEXT[] DEFAULT '{}',
    views_count INT DEFAULT 0,
    favorites_count INT DEFAULT 0,
    inquiries_count INT DEFAULT 0,
    
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 5. Row-Level Security (RLS) Policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Users RLS
CREATE POLICY "Public users viewable by all" ON public.users FOR SELECT USING (true);
CREATE POLICY "Users update own profile" ON public.users FOR UPDATE USING (auth.uid() = id OR public.is_admin());

-- Properties RLS
CREATE POLICY "Live properties viewable by all" ON public.properties 
    FOR SELECT USING (status = 'live' OR auth.uid() = owner_id OR public.is_admin());

CREATE POLICY "Sellers can insert properties" ON public.properties 
    FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners and admins can update properties" ON public.properties 
    FOR UPDATE USING (auth.uid() = owner_id OR public.is_admin());

CREATE POLICY "Owners and admins can delete properties" ON public.properties 
    FOR DELETE USING (auth.uid() = owner_id OR public.is_admin());
