-- Drop the restrictive public policy and recreate as permissive
DROP POLICY IF EXISTS "Public can view active packages" ON public.packages;
CREATE POLICY "Public can view active packages"
  ON public.packages
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);