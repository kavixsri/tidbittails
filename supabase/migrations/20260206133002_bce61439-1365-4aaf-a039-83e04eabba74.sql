
-- Create cafe_reservations table for pup cafe bookings
CREATE TABLE public.cafe_reservations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ngo_id UUID REFERENCES public.ngos(id),
  guest_name TEXT NOT NULL,
  guest_email TEXT NOT NULL,
  guest_phone TEXT NOT NULL,
  party_size INTEGER NOT NULL DEFAULT 1,
  reservation_date DATE NOT NULL,
  reservation_time TIME NOT NULL,
  special_requests TEXT,
  status TEXT DEFAULT 'confirmed',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.cafe_reservations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can make reservations"
ON public.cafe_reservations
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can view their reservations"
ON public.cafe_reservations
FOR SELECT
USING (true);
