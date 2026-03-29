
CREATE TABLE public.mikrotik_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT 'Router Utama',
  host text NOT NULL,
  port integer NOT NULL DEFAULT 8728,
  username text NOT NULL,
  password text NOT NULL,
  use_ssl boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.mikrotik_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage mikrotik config"
  ON public.mikrotik_config FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Insert default config from current secrets
INSERT INTO public.mikrotik_config (name, host, port, username, password)
VALUES ('Router Utama', '192.168.1.44', 8728, 'duy', '12345678');
