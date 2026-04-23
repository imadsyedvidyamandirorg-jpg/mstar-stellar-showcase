import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, session_id } = await req.json();
    const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY");
    if (!OPENROUTER_API_KEY) throw new Error("OPENROUTER_API_KEY not configured");

    // Fetch all products from DB to give AI context
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: products } = await supabase
      .from("products")
      .select("name, brand, category, price, original_price, stock, description, badge, emi_available, is_new_arrival, is_bestseller")
      .eq("is_active", true);

    const { data: offers } = await supabase
      .from("offers")
      .select("title, description, discount_percent")
      .eq("is_active", true);

    const productList = (products || []).map((p: any) =>
      `- ${p.name} (${p.brand}) - ₹${p.price}${p.original_price ? ` (was ₹${p.original_price})` : ""} - Stock: ${p.stock}${p.emi_available ? " - EMI Available" : ""}${p.is_new_arrival ? " - NEW" : ""}${p.is_bestseller ? " - BESTSELLER" : ""}${p.description ? ` - ${p.description}` : ""}`
    ).join("\n");

    const offerList = (offers || []).map((o: any) =>
      `- ${o.title}: ${o.description || ""} ${o.discount_percent ? `(${o.discount_percent}% OFF)` : ""}`
    ).join("\n");

    const systemPrompt = `You are MStar Mobile's AI assistant. You help customers with information about MStar Mobile shop located at Moti Bazaar Rd, Palanpur, Gujarat 385001.

Shop Details:
- Name: MStar Mobile
- Location: R.D. Complex, Moti Bazaar Rd, Palanpur, Gujarat 385001
- Phone: 080002 96786, +91 9327188556
- Email: mstarmobile77@gmail.com
- Instagram: @mstar_mobile
- Hours: Mon-Sun, 10:00 AM - 8:00 PM
- Services: Smartphone sales, Exchange, Repairs, Accessories

Current Products Available:
${productList || "No products listed yet."}

Current Offers:
${offerList || "No active offers right now."}

Rules:
- Only provide information about MStar Mobile shop and its products
- Be helpful, friendly, and professional
- If asked about products not in our catalog, say we don't carry them but can check availability
- Always speak positively about the shop
- If someone asks unrelated questions, politely redirect to shop-related topics
- Use emojis occasionally to be friendly
- Keep responses concise but informative
- Format responses with **bold** for important info and bullet points where appropriate`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3.3-70b-instruct:free",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("OpenRouter error:", response.status, errText);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const assistantMessage = data.choices?.[0]?.message?.content || "Sorry, I couldn't process that.";

    // Save messages to DB
    if (session_id) {
      const lastUserMsg = messages[messages.length - 1];
      if (lastUserMsg) {
        await supabase.from("chat_messages").insert([
          { session_id, role: "user", content: lastUserMsg.content },
          { session_id, role: "assistant", content: assistantMessage },
        ]);
      }
    }

    return new Response(JSON.stringify({ message: assistantMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("chat-ai error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});