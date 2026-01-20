
-- Create experience bookings table
CREATE TABLE public.experience_bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  experience_id UUID REFERENCES public.experiences(id),
  guest_name TEXT NOT NULL,
  guest_email TEXT NOT NULL,
  guest_phone TEXT,
  booking_date DATE NOT NULL,
  booking_time TIME NOT NULL,
  num_participants INTEGER NOT NULL DEFAULT 1,
  special_requests TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  payment_status TEXT DEFAULT 'unpaid',
  payment_method TEXT,
  total_amount NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.experience_bookings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Admins can manage experience bookings"
ON public.experience_bookings
FOR ALL
USING (is_admin_or_staff(auth.uid()));

CREATE POLICY "Anyone can create experience bookings"
ON public.experience_bookings
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Users can view own experience bookings"
ON public.experience_bookings
FOR SELECT
USING (true);

-- Create trigger for updated_at
CREATE TRIGGER update_experience_bookings_updated_at
BEFORE UPDATE ON public.experience_bookings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
