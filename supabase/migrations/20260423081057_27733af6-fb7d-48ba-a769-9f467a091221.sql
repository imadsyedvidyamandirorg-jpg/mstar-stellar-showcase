
CREATE TABLE public.product_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  ai_reply TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.product_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view product comments"
  ON public.product_comments FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can add comments"
  ON public.product_comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments"
  ON public.product_comments FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all comments"
  ON public.product_comments FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Allow AI reply updates"
  ON public.product_comments FOR UPDATE
  USING (true)
  WITH CHECK (true);
