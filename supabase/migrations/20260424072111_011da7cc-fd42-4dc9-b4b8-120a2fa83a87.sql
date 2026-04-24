CREATE POLICY "Anyone can view panorama images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'panorama-images');

CREATE POLICY "Admins can upload panorama images"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'panorama-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update panorama images"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'panorama-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete panorama images"
ON storage.objects
FOR DELETE
USING (bucket_id = 'panorama-images' AND public.has_role(auth.uid(), 'admin'));