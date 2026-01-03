-- Create table bookings for restaurant
CREATE TABLE public.table_bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  guest_name TEXT NOT NULL,
  guest_email TEXT NOT NULL,
  guest_phone TEXT,
  booking_date DATE NOT NULL,
  booking_time TIME NOT NULL,
  party_size INTEGER NOT NULL DEFAULT 2,
  special_requests TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  payment_status TEXT DEFAULT 'unpaid',
  payment_method TEXT,
  total_amount DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create spa services table
CREATE TABLE public.spa_services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  price DECIMAL(10,2) NOT NULL,
  category TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create spa bookings table
CREATE TABLE public.spa_bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  guest_name TEXT NOT NULL,
  guest_email TEXT NOT NULL,
  guest_phone TEXT,
  spa_service_id UUID REFERENCES public.spa_services(id),
  booking_date DATE NOT NULL,
  booking_time TIME NOT NULL,
  special_requests TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  payment_status TEXT DEFAULT 'unpaid',
  payment_method TEXT,
  total_amount DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create room service orders table
CREATE TABLE public.room_service_orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  guest_name TEXT NOT NULL,
  guest_email TEXT NOT NULL,
  room_number TEXT NOT NULL,
  items JSONB NOT NULL DEFAULT '[]',
  special_instructions TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  payment_status TEXT DEFAULT 'unpaid',
  payment_method TEXT,
  total_amount DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create airport transfers table
CREATE TABLE public.airport_transfers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  guest_name TEXT NOT NULL,
  guest_email TEXT NOT NULL,
  guest_phone TEXT,
  transfer_type TEXT NOT NULL, -- 'pickup' or 'dropoff'
  flight_number TEXT,
  pickup_datetime TIMESTAMP WITH TIME ZONE NOT NULL,
  pickup_location TEXT NOT NULL,
  dropoff_location TEXT NOT NULL,
  passengers INTEGER NOT NULL DEFAULT 1,
  luggage_count INTEGER DEFAULT 1,
  vehicle_type TEXT DEFAULT 'sedan',
  special_requests TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  payment_status TEXT DEFAULT 'unpaid',
  payment_method TEXT,
  total_amount DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create payments table to track all payments
CREATE TABLE public.payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_type TEXT NOT NULL, -- 'room', 'event', 'table', 'spa', 'room_service', 'transfer'
  booking_id UUID NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'ETB',
  payment_method TEXT NOT NULL, -- 'telebirr', 'cbe_birr', 'amole', 'bank_transfer', 'cash'
  payment_status TEXT DEFAULT 'pending',
  transaction_ref TEXT,
  payer_phone TEXT,
  payer_account TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.table_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.spa_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.spa_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_service_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.airport_transfers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Allow public read for spa services
CREATE POLICY "Spa services are viewable by everyone" ON public.spa_services FOR SELECT USING (true);

-- Allow public insert for bookings (guests can book without auth)
CREATE POLICY "Anyone can create table bookings" ON public.table_bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can create spa bookings" ON public.spa_bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can create room service orders" ON public.room_service_orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can create airport transfers" ON public.airport_transfers FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can create payments" ON public.payments FOR INSERT WITH CHECK (true);

-- Allow users to view their own bookings by email
CREATE POLICY "Users can view own table bookings" ON public.table_bookings FOR SELECT USING (true);
CREATE POLICY "Users can view own spa bookings" ON public.spa_bookings FOR SELECT USING (true);
CREATE POLICY "Users can view own room service orders" ON public.room_service_orders FOR SELECT USING (true);
CREATE POLICY "Users can view own airport transfers" ON public.airport_transfers FOR SELECT USING (true);
CREATE POLICY "Users can view own payments" ON public.payments FOR SELECT USING (true);

-- Admin full access policies
CREATE POLICY "Admins can manage table bookings" ON public.table_bookings FOR ALL USING (public.is_admin_or_staff(auth.uid()));
CREATE POLICY "Admins can manage spa services" ON public.spa_services FOR ALL USING (public.is_admin_or_staff(auth.uid()));
CREATE POLICY "Admins can manage spa bookings" ON public.spa_bookings FOR ALL USING (public.is_admin_or_staff(auth.uid()));
CREATE POLICY "Admins can manage room service orders" ON public.room_service_orders FOR ALL USING (public.is_admin_or_staff(auth.uid()));
CREATE POLICY "Admins can manage airport transfers" ON public.airport_transfers FOR ALL USING (public.is_admin_or_staff(auth.uid()));
CREATE POLICY "Admins can manage payments" ON public.payments FOR ALL USING (public.is_admin_or_staff(auth.uid()));

-- Insert default spa services
INSERT INTO public.spa_services (name, description, duration_minutes, price, category) VALUES
('Ethiopian Coffee Ritual', 'Traditional Ethiopian coffee ceremony combined with aromatherapy massage', 90, 2500, 'signature'),
('Full Body Massage', 'Relaxing full body Swedish massage', 60, 1800, 'massage'),
('Deep Tissue Massage', 'Therapeutic deep tissue massage for muscle tension', 75, 2200, 'massage'),
('Facial Treatment', 'Rejuvenating facial with natural Ethiopian ingredients', 60, 1500, 'facial'),
('Couples Massage', 'Side-by-side massage experience for two', 90, 4000, 'couples'),
('Hot Stone Therapy', 'Heated volcanic stones for deep relaxation', 75, 2800, 'massage'),
('Body Scrub & Wrap', 'Exfoliating scrub followed by nourishing body wrap', 90, 2000, 'body'),
('Manicure & Pedicure', 'Complete nail care with massage', 60, 800, 'beauty');

-- Add triggers for updated_at
CREATE TRIGGER update_table_bookings_updated_at BEFORE UPDATE ON public.table_bookings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_spa_bookings_updated_at BEFORE UPDATE ON public.spa_bookings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_room_service_orders_updated_at BEFORE UPDATE ON public.room_service_orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_airport_transfers_updated_at BEFORE UPDATE ON public.airport_transfers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON public.payments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();