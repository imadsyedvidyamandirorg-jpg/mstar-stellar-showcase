import { useState, useEffect } from "react";
import { Bell, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      const { data } = await supabase
        .from("notifications")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });
      setNotifications(data || []);
      setLoading(false);
    };
    fetchNotifications();

    // Realtime subscription
    const channel = supabase
      .channel("notifications-realtime")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "notifications" }, (payload) => {
        setNotifications((prev) => [payload.new as any, ...prev]);
        // Play notification sound
        try {
          const audio = new Audio("data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbsGQcBj+a2teleUYnYK/u3LFjFAg8l9rdqmdLLGS07d+pXhcBOZTc3a1oTDBms+3dpVoUADiR2NsA");
          audio.volume = 0.5;
          audio.play().catch(() => {});
        } catch {}
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  };

  const typeColors: Record<string, string> = {
    offer: "bg-green-500",
    alert: "bg-accent",
    product: "bg-blue-500",
    general: "bg-yellow-500",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-foreground">Notifications</h1>
          <p className="text-muted-foreground">{notifications.length} notifications</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </div>
      ) : notifications.length === 0 ? (
        <div className="bg-card rounded-2xl p-12 text-center">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Bell className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No Notifications</h3>
          <p className="text-muted-foreground">
            You're all caught up! Check back later for updates and offers.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="bg-card rounded-2xl p-4 shadow-elegant flex items-start gap-4 transition-all hover:shadow-deep border-l-4 border-l-accent"
            >
              <div className={`w-12 h-12 ${typeColors[notification.type] || "bg-accent"} rounded-full flex items-center justify-center flex-shrink-0`}>
                <Bell className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-foreground">{notification.title}</h3>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{timeAgo(notification.created_at)}</span>
                </div>
                <p className="text-muted-foreground mt-1">{notification.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
