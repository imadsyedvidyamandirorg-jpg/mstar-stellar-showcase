import { useState, useEffect } from "react";
import { ArrowLeft, Package, Loader2, Clock, CheckCircle, Truck, XCircle, X } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(price);

const statusConfig: Record<string, { icon: any; color: string; label: string }> = {
  pending: { icon: Clock, color: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20", label: "Pending" },
  confirmed: { icon: CheckCircle, color: "bg-blue-500/10 text-blue-500 border-blue-500/20", label: "Confirmed" },
  shipped: { icon: Truck, color: "bg-purple-500/10 text-purple-500 border-purple-500/20", label: "Shipped" },
  delivered: { icon: CheckCircle, color: "bg-green-500/10 text-green-500 border-green-500/20", label: "Delivered" },
  cancelled: { icon: XCircle, color: "bg-red-500/10 text-red-500 border-red-500/20", label: "Cancelled" },
};

const OrdersPage = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [orderItems, setOrderItems] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchOrders = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    setOrders(data || []);
    if (data && data.length > 0) {
      const ids = data.map((o: any) => o.id);
      const { data: items } = await supabase.from("order_items").select("*").in("order_id", ids);
      const grouped: Record<string, any[]> = {};
      (items || []).forEach((item: any) => {
        if (!grouped[item.order_id]) grouped[item.order_id] = [];
        grouped[item.order_id].push(item);
      });
      setOrderItems(grouped);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!user) return;
    fetchOrders();
  }, [user]);

  const cancelOrder = async (orderId: string) => {
    if (!confirm("Cancel this order?")) return;
    const { error } = await supabase.from("orders").update({ status: "cancelled" }).eq("id", orderId);
    if (error) {
      toast({ title: "Could not cancel", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Order cancelled" });
    fetchOrders();
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      <div className="flex items-center gap-3">
        <Link to="/dashboard" className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-lg md:text-xl font-bold text-foreground">My Orders</h1>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16">
          <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-foreground mb-2">No orders yet</h2>
          <p className="text-muted-foreground text-sm mb-4">Your order history will appear here.</p>
          <Link to="/dashboard/store" className="text-accent hover:underline text-sm">Browse Store →</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const status = statusConfig[order.status] || statusConfig.pending;
            const StatusIcon = status.icon;
            const items = orderItems[order.id] || [];
            return (
              <div key={order.id} className="bg-card rounded-2xl p-4 space-y-3 border border-border/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">#{order.id.slice(0, 8)}</p>
                  </div>
                  <Badge variant="outline" className={status.color}>
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {status.label}
                  </Badge>
                </div>

                {items.length > 0 && (
                  <div className="space-y-2">
                    {items.map((item: any) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                          <img src={item.product_image || "/placeholder.svg"} alt={item.product_name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{item.product_name}</p>
                          <p className="text-xs text-muted-foreground">Qty: {item.quantity} × {formatPrice(item.price)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-border/30">
                  <span className="text-sm text-muted-foreground">Total</span>
                  <span className="text-base font-bold text-foreground">{formatPrice(order.total_amount)}</span>
                </div>

                {order.status === "pending" && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full text-destructive hover:bg-destructive/10"
                    onClick={() => cancelOrder(order.id)}
                  >
                    <X className="h-4 w-4 mr-1" /> Cancel Order
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;