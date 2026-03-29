-- Fix packages RLS: drop all restrictive policies and recreate properly
DROP POLICY IF EXISTS "Admins can manage packages" ON public.packages;
DROP POLICY IF EXISTS "Anyone authenticated can view packages" ON public.packages;
DROP POLICY IF EXISTS "Public can view active packages" ON public.packages;

-- Permissive: anyone can view active packages (public homepage)
CREATE POLICY "Public can view active packages"
  ON public.packages FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- Permissive: admins can do everything
CREATE POLICY "Admins can manage packages"
  ON public.packages FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));