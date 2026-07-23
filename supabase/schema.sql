-- ===================================================
-- Real Estate Marketplace Platform (EstateMarket)
-- PostgreSQL Database Schema & Row-Level Security (RLS)
-- Compatible with Supabase PostgreSQL
-- ===================================================

-- 1. Create Enums
CREATE TYPE user_role AS ENUM ('buyer', 'seller', 'admin');
CREATE TYPE listing_status AS ENUM ('draft', 'pending_approval', 'live', 'sold', 'rented', 'archived');
CREATE TYPE property_type AS ENUM ('apartment', 'villa', 'house', 'plot', 'commercial', 'penthouse');
CREATE TYPE listing_intent AS ENUM ('sale', 'rent');
CREATE TYPE visit_status AS ENUM ('requested', 'confirmed', 'rejected', 'rescheduled', 'completed', 'cancelled');
CREATE TYPE report_status AS ENUM ('pending', 'reviewed', 'action_taken', 'dismissed');

-- 2. Profiles Table (Extends Supabase Auth users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    phone TEXT,
    role user_role DEFAULT 'buyer'::user_role NOT NULL,
    avatar TEXT,
    bio TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    is_suspended BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 3. Properties Table
CREATE TABLE IF NOT EXISTS public.properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    price NUMERIC(12, 2) NOT NULL,
    price_period TEXT DEFAULT 'total', -- 'total', 'per_month', 'per_sqft'
    intent listing_intent DEFAULT 'sale' NOT NULL,
    type property_type NOT NULL,
    status listing_status DEFAULT 'draft' NOT NULL,
    
    -- Specs
    bedrooms INT DEFAULT 0 NOT NULL,
    bathrooms INT DEFAULT 0 NOT NULL,
    area_sqft INT NOT NULL,
    parking_spaces INT DEFAULT 0 NOT NULL,
    furnished_status TEXT DEFAULT 'unfurnished', -- 'unfurnished', 'semi-furnished', 'fully-furnished'
    construction_status TEXT DEFAULT 'ready_to_move', -- 'ready_to_move', 'under_construction'
    built_year INT,
    
    -- Location
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    country TEXT DEFAULT 'India' NOT NULL,
    zip_code TEXT,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    
    -- Amenities array
    amenities TEXT[] DEFAULT '{}',
    
    -- Metrics
    views_count INT DEFAULT 0,
    favorites_count INT DEFAULT 0,
    inquiries_count INT DEFAULT 0,
    
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes for performance & quick filter matching
CREATE INDEX idx_properties_city ON public.properties(city);
CREATE INDEX idx_properties_price ON public.properties(price);
CREATE INDEX idx_properties_type ON public.properties(type);
CREATE INDEX idx_properties_status ON public.properties(status);
CREATE INDEX idx_properties_intent ON public.properties(intent);
CREATE INDEX idx_properties_location ON public.properties(latitude, longitude);

-- 4. Property Images Table
CREATE TABLE IF NOT EXISTS public.property_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE NOT NULL,
    image_url TEXT NOT NULL,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_property_images_pid ON public.property_images(property_id);

-- 5. Saved Favorites Table
CREATE TABLE IF NOT EXISTS public.favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(user_id, property_id)
);

-- 6. Saved Collections Table
CREATE TABLE IF NOT EXISTS public.collections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.collection_properties (
    collection_id UUID REFERENCES public.collections(id) ON DELETE CASCADE,
    property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
    PRIMARY KEY (collection_id, property_id)
);

-- 7. Realtime Messages Table
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL,
    sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    receiver_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
    message TEXT NOT NULL,
    image_url TEXT,
    is_read BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_messages_conversation ON public.messages(conversation_id);

-- 8. Visit Bookings Table
CREATE TABLE IF NOT EXISTS public.visits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    buyer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    seller_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE NOT NULL,
    visit_date DATE NOT NULL,
    visit_time TEXT NOT NULL,
    status visit_status DEFAULT 'requested' NOT NULL,
    notes TEXT,
    seller_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 9. Reviews & Ratings Table
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    rating INT CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    comment TEXT NOT NULL,
    photo_urls TEXT[] DEFAULT '{}',
    seller_reply TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 10. Reports Table
CREATE TABLE IF NOT EXISTS public.reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
    reported_by UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    reason TEXT NOT NULL,
    details TEXT,
    status report_status DEFAULT 'pending' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ===================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ===================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collection_properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles: Anyone can view profiles, user can update own profile, admin can manage all
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can update any profile" ON public.profiles FOR UPDATE USING (public.is_admin());

-- Properties:
-- Live properties are viewable by everyone.
-- Owners can view, update, delete their own properties regardless of status.
-- Admins can view/update/delete all properties.
CREATE POLICY "Live properties viewable by all" ON public.properties 
    FOR SELECT USING (status = 'live' OR auth.uid() = owner_id OR public.is_admin());

CREATE POLICY "Sellers can insert properties" ON public.properties 
    FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners and admins can update properties" ON public.properties 
    FOR UPDATE USING (auth.uid() = owner_id OR public.is_admin());

CREATE POLICY "Owners and admins can delete properties" ON public.properties 
    FOR DELETE USING (auth.uid() = owner_id OR public.is_admin());

-- Property Images: Viewable if property viewable, insert/delete by owner or admin
CREATE POLICY "Property images viewable by all" ON public.property_images FOR SELECT USING (true);
CREATE POLICY "Owners can manage property images" ON public.property_images 
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.properties 
            WHERE id = property_id AND (owner_id = auth.uid() OR public.is_admin())
        )
    );

-- Messages: Users can select/insert messages where they are sender or receiver
CREATE POLICY "Users can read own messages" ON public.messages 
    FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id OR public.is_admin());

CREATE POLICY "Users can send messages" ON public.messages 
    FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Visits: Users can view/manage visits where they are buyer or seller
CREATE POLICY "Users view own visits" ON public.visits 
    FOR SELECT USING (auth.uid() = buyer_id OR auth.uid() = seller_id OR public.is_admin());

CREATE POLICY "Buyers can request visits" ON public.visits 
    FOR INSERT WITH CHECK (auth.uid() = buyer_id);

CREATE POLICY "Parties can update visits" ON public.visits 
    FOR UPDATE USING (auth.uid() = buyer_id OR auth.uid() = seller_id OR public.is_admin());

-- Reviews: Viewable by all, insertable by authenticated buyers
CREATE POLICY "Reviews viewable by all" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Buyers can insert reviews" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Sellers can update reviews for replies" ON public.reviews FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM public.properties WHERE id = property_id AND owner_id = auth.uid()
    ) OR auth.uid() = user_id OR public.is_admin()
);
