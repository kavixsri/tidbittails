-- Create regional nodes table (wellness centers)
CREATE TABLE public.regional_nodes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  region TEXT NOT NULL,
  address TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'expanding', 'planned')),
  animals_under_care INTEGER DEFAULT 0,
  volunteers_count INTEGER DEFAULT 0,
  facilities JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create NGOs table
CREATE TABLE public.ngos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  region TEXT NOT NULL,
  description TEXT,
  address TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  website TEXT,
  services TEXT[] DEFAULT '{}',
  animals_rescued INTEGER DEFAULT 0,
  established_year INTEGER,
  logo_url TEXT,
  is_verified BOOLEAN DEFAULT false,
  node_id UUID REFERENCES public.regional_nodes(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create emergency cases table
CREATE TABLE public.emergencies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  reporter_name TEXT NOT NULL,
  reporter_phone TEXT NOT NULL,
  reporter_email TEXT,
  animal_type TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  urgency TEXT DEFAULT 'medium' CHECK (urgency IN ('low', 'medium', 'high', 'critical')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'dispatched', 'in_progress', 'resolved', 'cancelled')),
  assigned_ngo_id UUID REFERENCES public.ngos(id) ON DELETE SET NULL,
  assigned_node_id UUID REFERENCES public.regional_nodes(id) ON DELETE SET NULL,
  resolved_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create events table
CREATE TABLE public.events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  event_type TEXT DEFAULT 'adoption' CHECK (event_type IN ('adoption', 'vaccination', 'fundraiser', 'awareness', 'workshop', 'other')),
  date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  location TEXT NOT NULL,
  node_id UUID REFERENCES public.regional_nodes(id) ON DELETE SET NULL,
  max_attendees INTEGER,
  current_attendees INTEGER DEFAULT 0,
  image_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  registration_required BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create volunteers table
CREATE TABLE public.volunteers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  preferred_region TEXT,
  skills TEXT[] DEFAULT '{}',
  availability TEXT,
  experience TEXT,
  motivation TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'active', 'inactive')),
  node_id UUID REFERENCES public.regional_nodes(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create event registrations table
CREATE TABLE public.event_registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create network statistics table
CREATE TABLE public.network_stats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  total_animals_rescued INTEGER DEFAULT 0,
  total_animals_under_care INTEGER DEFAULT 0,
  total_volunteers INTEGER DEFAULT 0,
  total_ngos INTEGER DEFAULT 0,
  total_nodes INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.regional_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ngos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.volunteers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.network_stats ENABLE ROW LEVEL SECURITY;

-- Public read access for nodes, ngos, events, stats (public-facing data)
CREATE POLICY "Anyone can view regional nodes" 
ON public.regional_nodes 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can view NGOs" 
ON public.ngos 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can view events" 
ON public.events 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can view network stats" 
ON public.network_stats 
FOR SELECT 
USING (true);

-- Public insert for emergencies and volunteers (submission forms)
CREATE POLICY "Anyone can submit emergencies" 
ON public.emergencies 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can view their own emergencies" 
ON public.emergencies 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can submit volunteer applications" 
ON public.volunteers 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can register for events" 
ON public.event_registrations 
FOR INSERT 
WITH CHECK (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for all tables
CREATE TRIGGER update_regional_nodes_updated_at
BEFORE UPDATE ON public.regional_nodes
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ngos_updated_at
BEFORE UPDATE ON public.ngos
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_emergencies_updated_at
BEFORE UPDATE ON public.emergencies
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_events_updated_at
BEFORE UPDATE ON public.events
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_volunteers_updated_at
BEFORE UPDATE ON public.volunteers
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_network_stats_updated_at
BEFORE UPDATE ON public.network_stats
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to increment event attendees
CREATE OR REPLACE FUNCTION public.increment_event_attendees()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.events 
  SET current_attendees = current_attendees + 1 
  WHERE id = NEW.event_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER increment_attendees_on_registration
AFTER INSERT ON public.event_registrations
FOR EACH ROW EXECUTE FUNCTION public.increment_event_attendees();