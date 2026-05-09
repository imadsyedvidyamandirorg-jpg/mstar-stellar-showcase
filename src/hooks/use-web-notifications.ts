import { useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Asks the browser for Notification permission once (after sign-in)
 * and pushes browser notifications + sound for:
 *  - new admin notifications  (any user)
 *  - new orders               (admin users only) — different sound
 */

const playBeep = (pattern: "notif" | "order") => {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    if (pattern === "notif") {
      // soft 2-tone ding
      osc.frequency.setValueAtTime(660, ctx.currentTime);
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.4);
    } else {
      // urgent 4-tone for orders
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.setValueAtTime(1320, ctx.currentTime + 0.1);
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.2);
      osc.frequency.setValueAtTime(1320, ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.35, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.55);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.55);
    }
  } catch {}
};

const speak = (text: string) => {
  try {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.95;
    u.pitch = 1;
    u.volume = 1;
    u.lang = "en-IN";
    window.speechSynthesis.speak(u);
  } catch {}
};

const showNotif = (
  title: string,
  body: string,
  tag: string,
  onClickUrl?: string
) => {
  if (typeof window === "undefined" || !("Notification" in window)) return;
  if (Notification.permission !== "granted") return;
  try {
    const n = new Notification(title, {
      body,
      tag,
      icon: "/favicon.ico",
      badge: "/favicon.ico",
      requireInteraction: !!onClickUrl,
    });
    if (onClickUrl) {
      n.onclick = () => {
        try {
          window.focus();
          window.location.href = onClickUrl;
        } catch {}
        n.close();
      };
    }
  } catch {}
};

export const useWebNotifications = () => {
  const { user, isAdmin } = useAuth();
  const askedRef = useRef(false);

  useEffect(() => {
    if (!user) return;
    if (askedRef.current) return;
    askedRef.current = true;
    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "default") {
        // small delay so it doesn't fire mid-route-transition
        setTimeout(() => Notification.requestPermission().catch(() => {}), 1500);
      }
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;

    // Listen to new shop notifications
    const notifChannel = supabase
      .channel("web-notif-feed")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "notifications" },
        (payload) => {
          const n: any = payload.new;
          playBeep("notif");
          showNotif(n.title || "MStar Mobile", n.message || "", `notif-${n.id}`);
        }
      )
      .subscribe();

    // Admin: also alert on new orders (different sound)
    let orderChannel: any = null;
    if (isAdmin) {
      orderChannel = supabase
        .channel("web-notif-orders")
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "orders" },
          async (payload) => {
            const o: any = payload.new;
            playBeep("order");

            // Fetch ordered items for a richer voice announcement
            let itemsText = "";
            try {
              const { data: items } = await supabase
                .from("order_items")
                .select("product_name, quantity")
                .eq("order_id", o.id);
              if (items && items.length) {
                itemsText = items
                  .map((i: any) => `${i.quantity} ${i.product_name}`)
                  .join(", ");
              }
            } catch {}

            const customer = o.delivery_name || "A customer";
            const phone = o.delivery_phone ? `, phone ${o.delivery_phone}` : "";
            const city = o.delivery_city ? `, from ${o.delivery_city}` : "";
            const amount = `Total ${o.total_amount} rupees.`;
            const spoken =
              `New order received! ${customer}${phone}${city} ordered ` +
              (itemsText || `${o.items_count || ""} items`) +
              `. ${amount} Click the notification to view in admin panel.`;

            speak(spoken);

            showNotif(
              "🛒 New Order — MStar Mobile",
              `${customer} • ₹${o.total_amount}${itemsText ? ` • ${itemsText}` : ""}`,
              `order-${o.id}`,
              `${window.location.origin}/dashboard?admin=orders`
            );
            // Fire-and-forget email to shop owner
            supabase.functions.invoke("notify-new-order", { body: { order_id: o.id } }).catch(() => {});
          }
        )
        .subscribe();
    }

    return () => {
      supabase.removeChannel(notifChannel);
      if (orderChannel) supabase.removeChannel(orderChannel);
    };
  }, [user, isAdmin]);
};