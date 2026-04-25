
-- 1) Grant admin role to ALL existing users (prototype: shared admin panel)
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role FROM auth.users
ON CONFLICT DO NOTHING;

-- 2) Update handle_new_user trigger to also auto-grant admin role to every new signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, phone, address, city, state, pincode, gender)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NULLIF(NEW.raw_user_meta_data->>'phone', ''),
    NULLIF(NEW.raw_user_meta_data->>'address', ''),
    NULLIF(NEW.raw_user_meta_data->>'city', ''),
    NULLIF(NEW.raw_user_meta_data->>'state', ''),
    NULLIF(NEW.raw_user_meta_data->>'pincode', ''),
    NULLIF(NEW.raw_user_meta_data->>'gender', '')
  );

  -- Auto-grant admin role for shared admin panel (prototype behaviour)
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'admin'::app_role)
  ON CONFLICT DO NOTHING;

  RETURN NEW;
END;
$function$;

-- Make sure the trigger on auth.users exists (idempotent)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3) Allow admins to view all user_roles (helpful for any future UI)
DROP POLICY IF EXISTS "Admins can view all user roles" ON public.user_roles;
CREATE POLICY "Admins can view all user roles"
ON public.user_roles FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- 4) Increase storage bucket file size limits so large reels/posts/panoramas don't fail
UPDATE storage.buckets SET file_size_limit = 5368709120 WHERE id = 'reel-videos';        -- 5 GB
UPDATE storage.buckets SET file_size_limit = 52428800   WHERE id = 'post-images';         -- 50 MB
UPDATE storage.buckets SET file_size_limit = 104857600  WHERE id = 'panorama-images';     -- 100 MB
UPDATE storage.buckets SET file_size_limit = 52428800   WHERE id = 'product-images';      -- 50 MB
UPDATE storage.buckets SET file_size_limit = 52428800   WHERE id = 'offer-images';        -- 50 MB

-- 5) Enable realtime on orders so admin gets live alerts
ALTER TABLE public.orders REPLICA IDENTITY FULL;
ALTER TABLE public.order_items REPLICA IDENTITY FULL;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'orders'
  ) THEN
    EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.orders';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'order_items'
  ) THEN
    EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.order_items';
  END IF;
END $$;
