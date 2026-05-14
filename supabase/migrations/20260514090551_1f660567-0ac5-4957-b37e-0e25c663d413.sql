CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  image_url TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active categories" ON public.categories FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can view all categories" ON public.categories FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert categories" ON public.categories FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update categories" ON public.categories FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete categories" ON public.categories FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

INSERT INTO public.categories (name, slug, image_url, sort_order) VALUES
('Earbuds','earbuds','https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=200&h=200&fit=crop',1),
('Watches','watches','https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop',2),
('Speakers','speakers','https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=200&h=200&fit=crop',3),
('Headphones','headphones','https://images.unsplash.com/photo-1583394838336-acd977736f90?w=200&h=200&fit=crop',4),
('Powerbanks','powerbanks','https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=200&h=200&fit=crop',5),
('Drones','drones','https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=200&h=200&fit=crop',6),
('Hair Dryer','hair-dryer','https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=200&h=200&fit=crop',7),
('Gaming','gaming','https://images.unsplash.com/photo-1592840496694-26d035b52b48?w=200&h=200&fit=crop',8),
('Tablets','tablets','https://images.unsplash.com/photo-1561154464-82e9adf32764?w=200&h=200&fit=crop',9);