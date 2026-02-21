-- Fix 1: Remove the overly permissive SELECT policy on volunteers
-- Volunteers table should be insert-only for public users; admin reads via service role
DROP POLICY IF EXISTS "Anyone can submit volunteer applications" ON public.volunteers;

-- Re-create INSERT-only policy (no SELECT for anonymous/public)
CREATE POLICY "Anyone can submit volunteer applications"
ON public.volunteers
FOR INSERT
WITH CHECK (true);

-- Note: There is no SELECT policy now, so anonymous users cannot read volunteer data.
-- Admins access volunteer data via service role key (bypasses RLS).