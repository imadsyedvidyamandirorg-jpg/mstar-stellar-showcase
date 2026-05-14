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
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

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

    // Compact catalog (full details kept internally; AI is told NOT to dump everything)
    const productNames = (products || []).map((p: any) => `- ${p.name}${p.brand ? ` (${p.brand})` : ""}`).join("\n");
    const productDetails = (products || []).map((p: any) =>
      `${p.name}|brand:${p.brand || "-"}|category:${p.category || "-"}|price:₹${p.price}${p.original_price ? `|was:₹${p.original_price}` : ""}|inStock:${(p.stock ?? 0) > 0 ? "yes" : "no"}${p.emi_available ? "|EMI" : ""}${p.is_new_arrival ? "|NEW" : ""}${p.is_bestseller ? "|BESTSELLER" : ""}${p.description ? `|desc:${p.description}` : ""}`
    ).join("\n");

    const offerList = (offers || []).map((o: any) =>
      `- ${o.title}: ${o.description || ""} ${o.discount_percent ? `(${o.discount_percent}% OFF)` : ""}`
    ).join("\n");

    const systemPrompt = `You are M Star Mobile's AI assistant. You help customers with information about M Star Mobile, a premium accessories and smart-gadget store in Palanpur, Gujarat.

Shop Details:
- Name: M Star Mobile
- Address: R.D Complex, Opp. Sukhadia Sweet Mart, Near Janta Kachori, Moti Bazar, Palanpur — 385001, Gujarat, India
- Phone / WhatsApp: +91 93271 88556
- Email: mstarmobile77@gmail.com
- Instagram: @mstar_mobile · Facebook: mstarmobile7777 · YouTube: @mstar_mobile · Telegram: t.me/mstarmobile
- Hours: Mon–Sun, 10:00 AM – 9:00 PM
- What we sell: premium audio (earbuds, headphones, speakers), smart watches and wearables, drones, powerbanks and chargers, hair dryers, gaming accessories, tablets, and other lifestyle gadgets.

IMPORTANT — what we do NOT do:
- We do NOT sell smartphones / mobile phones.
- We do NOT do mobile exchange or trade-in.
- We do NOT do mobile repairs.
If a user asks about any of these, politely say we focus on premium accessories and smart gadgets, and suggest related products we do carry.

Current Products Available (NAMES ONLY — show this list when the user asks "what products do you have"):
${productNames || "No products listed yet."}

Detailed catalog (use ONLY when the user asks specifically about a product by name — never dump this whole list):
${productDetails || "—"}

Current Offers:
${offerList || "No active offers right now."}

Rules:
- Only provide information about MStar Mobile shop and its products.
- When the user asks "what products do you have" / "show available products" / similar, reply with ONLY the product names list and ask which one they want to know more about. Do NOT dump prices, descriptions, or full details upfront.
- NEVER mention exact stock numbers or counts. Only say "In stock" or "Out of stock" if asked.
- When the user asks about a SPECIFIC product (by name), give the full info (price, brand, key features, EMI availability, in-stock status).
- If asked about products not in our catalog, say we don't carry them but can check availability.
- Never invent stock numbers, courier names, delivery dates, or prices that are not in the catalog.
- Be helpful, friendly, professional. Use emojis occasionally.
- Keep replies concise. Use **bold** and bullet points when useful.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error(`Lovable AI error (${response.status}):`, errText);
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Too many requests, please wait a moment." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify({ error: "AI service temporarily unavailable. Please try again." }), {
        status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" },
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