
INSERT INTO storage.buckets (id, name, public) VALUES ('panorama-images', 'panorama-images', true);

CREATE TABLE public.panoramas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL DEFAULT 'Shop View',
  image_url TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.panoramas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active panoramas"
  ON public.panoramas FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage panoramas"
  ON public.panoramas FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));
