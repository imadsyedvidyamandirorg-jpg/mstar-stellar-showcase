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

const showNotif = (title: string, body: string, tag: string) => {
  if (typeof window === "undefined" || !("Notification" in window)) return;
  if (Notification.permission !== "granted") return;
  try {
    new Notification(title, {
      body,
      tag,
      icon: "/favicon.ico",
      badge: "/favicon.ico",
    });
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
          (payload) => {
            const o: any = payload.new;
            playBeep("order");
            showNotif(
              "🛒 New Order!",
              `${o.delivery_name || "Customer"} — ₹${o.total_amount}`,
              `order-${o.id}`
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