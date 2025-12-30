-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'staff');

-- Create profiles table for admin users
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- Create rooms table
CREATE TABLE public.rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  short_description TEXT,
  room_type TEXT NOT NULL,
  price_per_night DECIMAL(10,2) NOT NULL,
  max_guests INTEGER DEFAULT 2,
  size_sqm INTEGER,
  amenities TEXT[],
  images TEXT[],
  featured_image TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create room bookings table
CREATE TABLE public.room_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID REFERENCES public.rooms(id) ON DELETE SET NULL,
  guest_name TEXT NOT NULL,
  guest_email TEXT NOT NULL,
  guest_phone TEXT,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  num_guests INTEGER DEFAULT 1,
  special_requests TEXT,
  total_price DECIMAL(10,2),
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create event spaces table
CREATE TABLE public.event_spaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  capacity INTEGER,
  price_per_hour DECIMAL(10,2),
  price_per_day DECIMAL(10,2),
  amenities TEXT[],
  images TEXT[],
  featured_image TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create event bookings table
CREATE TABLE public.event_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_space_id UUID REFERENCES public.event_spaces(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL,
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  client_phone TEXT,
  event_date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  expected_guests INTEGER,
  special_requirements TEXT,
  catering_required BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'pending',
  total_price DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create menu categories table
CREATE TABLE public.menu_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create menu items table
CREATE TABLE public.menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES public.menu_categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  is_vegetarian BOOLEAN DEFAULT false,
  is_vegan BOOLEAN DEFAULT false,
  is_spicy BOOLEAN DEFAULT false,
  is_available BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create experiences table
CREATE TABLE public.experiences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  short_description TEXT,
  duration TEXT,
  price DECIMAL(10,2),
  image_url TEXT,
  category TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create gallery images table
CREATE TABLE public.gallery_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT,
  image_url TEXT NOT NULL,
  category TEXT,
  alt_text TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create testimonials table
CREATE TABLE public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_name TEXT NOT NULL,
  guest_title TEXT,
  content TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  event_type TEXT,
  image_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create special offers table
CREATE TABLE public.special_offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  discount_percentage INTEGER,
  discount_amount DECIMAL(10,2),
  valid_from DATE,
  valid_until DATE,
  terms_conditions TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create contact inquiries table
CREATE TABLE public.contact_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  inquiry_type TEXT,
  is_read BOOLEAN DEFAULT false,
  is_responded BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create site settings table for general configuration
CREATE TABLE public.site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_spaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.special_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check user roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create function to check if user is admin or staff
CREATE OR REPLACE FUNCTION public.is_admin_or_staff(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role IN ('admin', 'staff')
  )
$$;

-- Profile policies
CREATE POLICY "Profiles are viewable by admin/staff" ON public.profiles
FOR SELECT USING (public.is_admin_or_staff(auth.uid()));

CREATE POLICY "Users can view own profile" ON public.profiles
FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
FOR UPDATE USING (auth.uid() = id);

-- User roles policies (only admins can manage)
CREATE POLICY "Admins can view all roles" ON public.user_roles
FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles" ON public.user_roles
FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Public read policies for content tables
CREATE POLICY "Rooms are publicly readable" ON public.rooms
FOR SELECT USING (is_active = true);

CREATE POLICY "Admin/staff can manage rooms" ON public.rooms
FOR ALL USING (public.is_admin_or_staff(auth.uid()));

CREATE POLICY "Event spaces are publicly readable" ON public.event_spaces
FOR SELECT USING (is_active = true);

CREATE POLICY "Admin/staff can manage event spaces" ON public.event_spaces
FOR ALL USING (public.is_admin_or_staff(auth.uid()));

CREATE POLICY "Menu categories are publicly readable" ON public.menu_categories
FOR SELECT USING (is_active = true);

CREATE POLICY "Admin/staff can manage menu categories" ON public.menu_categories
FOR ALL USING (public.is_admin_or_staff(auth.uid()));

CREATE POLICY "Menu items are publicly readable" ON public.menu_items
FOR SELECT USING (is_available = true);

CREATE POLICY "Admin/staff can manage menu items" ON public.menu_items
FOR ALL USING (public.is_admin_or_staff(auth.uid()));

CREATE POLICY "Experiences are publicly readable" ON public.experiences
FOR SELECT USING (is_active = true);

CREATE POLICY "Admin/staff can manage experiences" ON public.experiences
FOR ALL USING (public.is_admin_or_staff(auth.uid()));

CREATE POLICY "Gallery images are publicly readable" ON public.gallery_images
FOR SELECT USING (is_active = true);

CREATE POLICY "Admin/staff can manage gallery" ON public.gallery_images
FOR ALL USING (public.is_admin_or_staff(auth.uid()));

CREATE POLICY "Testimonials are publicly readable" ON public.testimonials
FOR SELECT USING (is_active = true);

CREATE POLICY "Admin/staff can manage testimonials" ON public.testimonials
FOR ALL USING (public.is_admin_or_staff(auth.uid()));

CREATE POLICY "Active offers are publicly readable" ON public.special_offers
FOR SELECT USING (is_active = true);

CREATE POLICY "Admin/staff can manage offers" ON public.special_offers
FOR ALL USING (public.is_admin_or_staff(auth.uid()));

-- Booking policies (public can create, admin/staff can view all)
CREATE POLICY "Anyone can create room bookings" ON public.room_bookings
FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin/staff can view all room bookings" ON public.room_bookings
FOR SELECT USING (public.is_admin_or_staff(auth.uid()));

CREATE POLICY "Admin/staff can manage room bookings" ON public.room_bookings
FOR ALL USING (public.is_admin_or_staff(auth.uid()));

CREATE POLICY "Anyone can create event bookings" ON public.event_bookings
FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin/staff can view all event bookings" ON public.event_bookings
FOR SELECT USING (public.is_admin_or_staff(auth.uid()));

CREATE POLICY "Admin/staff can manage event bookings" ON public.event_bookings
FOR ALL USING (public.is_admin_or_staff(auth.uid()));

-- Contact inquiries (public can create, admin/staff can view)
CREATE POLICY "Anyone can submit inquiries" ON public.contact_inquiries
FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin/staff can view inquiries" ON public.contact_inquiries
FOR SELECT USING (public.is_admin_or_staff(auth.uid()));

CREATE POLICY "Admin/staff can manage inquiries" ON public.contact_inquiries
FOR ALL USING (public.is_admin_or_staff(auth.uid()));

-- Site settings (admin only)
CREATE POLICY "Site settings publicly readable" ON public.site_settings
FOR SELECT USING (true);

CREATE POLICY "Admins can manage settings" ON public.site_settings
FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Create function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Apply updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_rooms_updated_at BEFORE UPDATE ON public.rooms FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_room_bookings_updated_at BEFORE UPDATE ON public.room_bookings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_event_spaces_updated_at BEFORE UPDATE ON public.event_spaces FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_event_bookings_updated_at BEFORE UPDATE ON public.event_bookings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_menu_items_updated_at BEFORE UPDATE ON public.menu_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_experiences_updated_at BEFORE UPDATE ON public.experiences FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_special_offers_updated_at BEFORE UPDATE ON public.special_offers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for images
INSERT INTO storage.buckets (id, name, public) VALUES ('hotel-images', 'hotel-images', true);

-- Storage policies for hotel images
CREATE POLICY "Hotel images are publicly accessible" ON storage.objects
FOR SELECT USING (bucket_id = 'hotel-images');

CREATE POLICY "Admin/staff can upload images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'hotel-images' AND public.is_admin_or_staff(auth.uid()));

CREATE POLICY "Admin/staff can update images" ON storage.objects
FOR UPDATE USING (bucket_id = 'hotel-images' AND public.is_admin_or_staff(auth.uid()));

CREATE POLICY "Admin/staff can delete images" ON storage.objects
FOR DELETE USING (bucket_id = 'hotel-images' AND public.is_admin_or_staff(auth.uid()));