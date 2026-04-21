
-- Fix chat_messages INSERT policy - require session_id
DROP POLICY "Anyone can insert chat messages" ON public.chat_messages;
CREATE POLICY "Anyone can insert chat messages" ON public.chat_messages FOR INSERT WITH CHECK (session_id IS NOT NULL AND content IS NOT NULL);

-- Fix chat_messages SELECT policy
DROP POLICY "Anyone can view own session messages" ON public.chat_messages;
CREATE POLICY "Users can view session messages" ON public.chat_messages FOR SELECT USING (true);
