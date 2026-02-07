
-- Add CHECK constraints for input validation on user-submitted tables

-- volunteers table
ALTER TABLE public.volunteers
  ADD CONSTRAINT volunteers_name_length CHECK (length(name) <= 200),
  ADD CONSTRAINT volunteers_email_length CHECK (length(email) <= 255),
  ADD CONSTRAINT volunteers_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  ADD CONSTRAINT volunteers_phone_length CHECK (length(phone) <= 30),
  ADD CONSTRAINT volunteers_experience_length CHECK (experience IS NULL OR length(experience) <= 2000),
  ADD CONSTRAINT volunteers_motivation_length CHECK (motivation IS NULL OR length(motivation) <= 2000),
  ADD CONSTRAINT volunteers_availability_length CHECK (availability IS NULL OR length(availability) <= 200),
  ADD CONSTRAINT volunteers_preferred_region_length CHECK (preferred_region IS NULL OR length(preferred_region) <= 200);

-- emergencies table
ALTER TABLE public.emergencies
  ADD CONSTRAINT emergencies_reporter_name_length CHECK (length(reporter_name) <= 200),
  ADD CONSTRAINT emergencies_reporter_phone_length CHECK (length(reporter_phone) <= 30),
  ADD CONSTRAINT emergencies_reporter_email_format CHECK (reporter_email IS NULL OR reporter_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  ADD CONSTRAINT emergencies_description_length CHECK (length(description) <= 5000),
  ADD CONSTRAINT emergencies_location_length CHECK (length(location) <= 500),
  ADD CONSTRAINT emergencies_animal_type_length CHECK (length(animal_type) <= 100);

-- event_registrations table
ALTER TABLE public.event_registrations
  ADD CONSTRAINT event_reg_name_length CHECK (length(name) <= 200),
  ADD CONSTRAINT event_reg_email_length CHECK (length(email) <= 255),
  ADD CONSTRAINT event_reg_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  ADD CONSTRAINT event_reg_phone_length CHECK (phone IS NULL OR length(phone) <= 30);

-- cafe_reservations table
ALTER TABLE public.cafe_reservations
  ADD CONSTRAINT cafe_guest_name_length CHECK (length(guest_name) <= 200),
  ADD CONSTRAINT cafe_guest_email_length CHECK (length(guest_email) <= 255),
  ADD CONSTRAINT cafe_guest_email_format CHECK (guest_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  ADD CONSTRAINT cafe_guest_phone_length CHECK (length(guest_phone) <= 30),
  ADD CONSTRAINT cafe_special_requests_length CHECK (special_requests IS NULL OR length(special_requests) <= 1000),
  ADD CONSTRAINT cafe_party_size_range CHECK (party_size >= 1 AND party_size <= 20);
