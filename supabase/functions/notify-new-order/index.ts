import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SHOP_EMAIL = "mstarmobile77@gmail.com";
const SHOP_PHONE = "08000296786";

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { order_id } = await req.json();
    if (!order_id) {
      return new Response(JSON.stringify({ error: "order_id required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: order } = await supabase
      .from("orders")
      .select("*, order_items(*)")
      .eq("id", order_id)
      .single();

    if (!order) {
      return new Response(JSON.stringify({ error: "Order not found" }), {
        status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const items = (order.order_items || [])
      .map((i: any) => `• ${i.product_name} × ${i.quantity} = ₹${i.price * i.quantity}`)
      .join("\n");

    const subject = `🔔 New Order #${order.id.slice(0, 8)} - ₹${order.total_amount}`;
    const body = `New order received on MStar Mobile!

Customer: ${order.delivery_name || "Customer"}
Phone: ${order.delivery_phone || "—"}
Address: ${order.delivery_address || "—"}, ${order.delivery_city || ""} ${order.delivery_pincode || ""}

Items:
${items}

Total: ₹${order.total_amount}
Payment: ${order.payment_method || "COD"} (${order.payment_status || "pending"})

Open admin panel to confirm.`;

    // Try Lovable's transactional email service if available; otherwise just log.
    // (No-op fallback so we don't error if email infra isn't configured yet.)
    try {
      const { error: emailErr } = await supabase.functions.invoke("send-transactional-email", {
        body: {
          to: SHOP_EMAIL,
          subject,
          html: body.replace(/\n/g, "<br>"),
          text: body,
        },
      });
      if (emailErr) console.warn("send-transactional-email not available:", emailErr.message);
    } catch (e) {
      console.warn("Email send skipped:", (e as Error).message);
    }

    console.log(`[order-alert] ${subject} — should also SMS ${SHOP_PHONE}`);

    return new Response(JSON.stringify({ ok: true, subject }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("notify-new-order error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});