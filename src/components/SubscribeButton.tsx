import { useEffect, useState } from "react";
import { Bell, BellRing, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const SubscribeButton = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [count, setCount] = useState<number>(0);
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const refresh = async () => {
    const { count: c } = await supabase
      .from("subscribers")
      .select("*", { count: "exact", head: true });
    setCount(c || 0);
    if (user) {
      const { data } = await supabase
        .from("subscribers")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();
      setSubscribed(!!data);
    }
  };

  useEffect(() => { refresh(); }, [user]);

  const toggle = async () => {
    if (!user) {
      toast({ title: "Please sign in to subscribe", variant: "destructive" });
      return;
    }
    setLoading(true);
    if (subscribed) {
      await supabase.from("subscribers").delete().eq("user_id", user.id);
      toast({ title: "Unsubscribed" });
    } else {
      await supabase.from("subscribers").insert({
        user_id: user.id,
        email: user.email,
        full_name: (user.user_metadata as any)?.full_name || null,
      });
      toast({ title: "Subscribed! 🔔", description: "You'll get our latest updates." });
    }
    setLoading(false);
    refresh();
  };

  return (
    <div className="flex items-center gap-3 bg-card rounded-2xl p-3 shadow-elegant">
      <Button onClick={toggle} disabled={loading} variant={subscribed ? "outline" : "default"} size="sm">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : subscribed ? <BellRing className="h-4 w-4 mr-1" /> : <Bell className="h-4 w-4 mr-1" />}
        {subscribed ? "Subscribed" : "Subscribe"}
      </Button>
      <span className="text-sm text-muted-foreground">
        <span className="font-bold text-foreground">{count.toLocaleString()}</span> subscribers
      </span>
    </div>
  );
};

export default SubscribeButton;