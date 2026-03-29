
-- 1. Create role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'staff', 'customer');

-- 2. Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

-- 4. Create packages table
CREATE TABLE public.packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  speed_download TEXT NOT NULL,
  speed_upload TEXT NOT NULL,
  price NUMERIC NOT NULL,
  description TEXT,
  features TEXT[] DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. Create customers table
CREATE TABLE public.customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  package_id UUID REFERENCES public.packages(id) NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'inactive')),
  mikrotik_username TEXT,
  mikrotik_password TEXT,
  installation_date DATE,
  last_payment TIMESTAMPTZ,
  next_payment TIMESTAMPTZ,
  total_amount NUMERIC NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. Create payments table
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE NOT NULL,
  amount NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'overdue')),
  payment_date TIMESTAMPTZ,
  due_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  invoice_number TEXT NOT NULL DEFAULT '',
  payment_method TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. Create tickets table
CREATE TABLE public.tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  category TEXT NOT NULL DEFAULT 'general' CHECK (category IN ('technical', 'billing', 'general')),
  assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  resolution TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 8. Create ticket_activities table
CREATE TABLE public.ticket_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID REFERENCES public.tickets(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  duration_minutes INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 9. Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_activities ENABLE ROW LEVEL SECURITY;

-- 10. Security definer helper function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- 11. Helper to get customer_id for current user
CREATE OR REPLACE FUNCTION public.get_customer_id_for_user(_user_id UUID)
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id FROM public.customers WHERE user_id = _user_id LIMIT 1
$$;

-- 12. Update timestamp function
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- 13. Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_packages_updated_at BEFORE UPDATE ON public.packages FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON public.customers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON public.payments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_tickets_updated_at BEFORE UPDATE ON public.tickets FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- 14. Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name, email)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', NEW.email), NEW.email);
  
  -- Default role: customer
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'customer');
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==================== RLS POLICIES ====================

-- PROFILES policies
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Staff can view all profiles" ON public.profiles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'staff'));
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Admins can update any profile" ON public.profiles FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert profiles" ON public.profiles FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- USER_ROLES policies
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Admins can manage all roles" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- PACKAGES policies (everyone authenticated can read, only admin can write)
CREATE POLICY "Anyone authenticated can view packages" ON public.packages FOR SELECT TO authenticated USING (true);
CREATE POLICY "Public can view active packages" ON public.packages FOR SELECT TO anon USING (is_active = true);
CREATE POLICY "Admins can manage packages" ON public.packages FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- CUSTOMERS policies
CREATE POLICY "Admins can manage all customers" ON public.customers FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Staff can view all customers" ON public.customers FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'staff'));
CREATE POLICY "Staff can insert customers" ON public.customers FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'staff'));
CREATE POLICY "Staff can update customers" ON public.customers FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'staff'));
CREATE POLICY "Customers can view own record" ON public.customers FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Customers can update own record" ON public.customers FOR UPDATE TO authenticated USING (user_id = auth.uid());

-- PAYMENTS policies
CREATE POLICY "Admins can manage all payments" ON public.payments FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Staff can view all payments" ON public.payments FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'staff'));
CREATE POLICY "Staff can insert payments" ON public.payments FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'staff'));
CREATE POLICY "Staff can update payments" ON public.payments FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'staff'));
CREATE POLICY "Customers can view own payments" ON public.payments FOR SELECT TO authenticated USING (
  customer_id = public.get_customer_id_for_user(auth.uid())
);

-- TICKETS policies
CREATE POLICY "Admins can manage all tickets" ON public.tickets FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Staff can view all tickets" ON public.tickets FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'staff'));
CREATE POLICY "Staff can update tickets" ON public.tickets FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'staff'));
CREATE POLICY "Staff can insert tickets" ON public.tickets FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'staff'));
CREATE POLICY "Customers can view own tickets" ON public.tickets FOR SELECT TO authenticated USING (
  customer_id = public.get_customer_id_for_user(auth.uid())
);
CREATE POLICY "Customers can create own tickets" ON public.tickets FOR INSERT TO authenticated WITH CHECK (
  customer_id = public.get_customer_id_for_user(auth.uid())
);

-- TICKET_ACTIVITIES policies
CREATE POLICY "Admins can manage all activities" ON public.ticket_activities FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Staff can view all activities" ON public.ticket_activities FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'staff'));
CREATE POLICY "Staff can insert activities" ON public.ticket_activities FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'staff'));
CREATE POLICY "Customers can view own ticket activities" ON public.ticket_activities FOR SELECT TO authenticated USING (
  ticket_id IN (SELECT id FROM public.tickets WHERE customer_id = public.get_customer_id_for_user(auth.uid()))
);
