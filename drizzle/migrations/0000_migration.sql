CREATE TABLE public.ad_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ad_id text NOT NULL,
  name text NOT NULL DEFAULT 'Umushyitsi',
  body text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.ad_comments TO anon, authenticated;
GRANT ALL ON public.ad_comments TO service_role;
ALTER TABLE public.ad_comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read comments" ON public.ad_comments FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Anyone can post short comments" ON public.ad_comments FOR INSERT TO anon, authenticated
  WITH CHECK (char_length(body) BETWEEN 1 AND 500 AND char_length(name) BETWEEN 1 AND 60 AND char_length(ad_id) <= 80);
CREATE INDEX ad_comments_ad_idx ON public.ad_comments (ad_id, created_at);

CREATE TABLE public.momo_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reference_id uuid NOT NULL UNIQUE,
  phone text NOT NULL,
  amount integer NOT NULL,
  fee integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending',
  purpose text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.momo_payments TO service_role;
ALTER TABLE public.momo_payments ENABLE ROW LEVEL SECURITY;