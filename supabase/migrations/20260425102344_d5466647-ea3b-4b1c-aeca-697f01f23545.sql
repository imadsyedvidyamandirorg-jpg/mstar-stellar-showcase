-- Subscribers table
CREATE TABLE IF NOT EXISTS public.subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  email TEXT,
  full_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

-- Anyone can see the count / list (public count is fine; admins also need full list)
CREATE POLICY "Anyone can view subscribers"
ON public.subscribers FOR SELECT
USING (true);

CREATE POLICY "Users can subscribe themselves"
ON public.subscribers FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unsubscribe themselves"
ON public.subscribers FOR DELETE
USING (auth.uid() = user_id);

CREATE POLICY "Admins manage subscribers"
ON public.subscribers FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Allow users to cancel their own pending orders
CREATE POLICY "Users can cancel own pending orders"
ON public.orders FOR UPDATE
USING (auth.uid() = user_id AND status = 'pending')
WITH CHECK (auth.uid() = user_id AND status IN ('pending', 'cancelled'));
