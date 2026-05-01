-- Banners table
CREATE TABLE public.banners (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url TEXT NOT NULL,
  link_url TEXT,
  title TEXT,
  position INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active banners"
  ON public.banners FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage banners"
  ON public.banners FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_banners_updated_at
  BEFORE UPDATE ON public.banners
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Storage bucket for banners
INSERT INTO storage.buckets (id, name, public)
  VALUES ('banner-images', 'banner-images', true)
  ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Banner images public read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'banner-images');

CREATE POLICY "Admins upload banner images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'banner-images' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins update banner images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'banner-images' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins delete banner images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'banner-images' AND has_role(auth.uid(), 'admin'::app_role));