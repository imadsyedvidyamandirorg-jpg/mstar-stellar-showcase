import { Link } from "react-router-dom";
import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft, ShoppingBag, CreditCard, Tag, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/contexts/CartContext";
import { formatPrice } from "@/data/products";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const { items, removeFromCart, updateQuantity, clearCart, totalPrice, totalItems } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [placing, setPlacing] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  const applyCoupon = () => {
    toast({
      title: "No active coupons",
      description: "There are no promo codes available right now.",
      variant: "destructive",
    });
  };

  const finalTotal = totalPrice - discount;

  const handleCheckout = async () => {
    if (!user) {
      toast({ title: "Please sign in", description: "You need to log in before placing an order.", variant: "destructive" });
      navigate("/auth");
      return;
    }
    if (items.length === 0) return;
    setPlacing(true);

    try {
      // Get profile for delivery details
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, phone, address, city, state, pincode")
        .eq("user_id", user.id)
        .maybeSingle();

      // Create order
      const { data: order, error: orderErr } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          total_amount: finalTotal,
          status: "pending",
          payment_status: "pending",
          payment_method: "cod",
          delivery_name: profile?.full_name || null,
          delivery_phone: profile?.phone || null,
          delivery_address: profile?.address || null,
          delivery_city: profile?.city || null,
          delivery_state: profile?.state || null,
          delivery_pincode: profile?.pincode || null,
        })
        .select()
        .single();

      if (orderErr || !order) throw orderErr || new Error("Failed to create order");

      // Insert order items
      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.id,
        product_name: item.name,
        product_image: item.image,
        price: item.price,
        quantity: item.quantity,
      }));
      const { error: itemsErr } = await supabase.from("order_items").insert(orderItems);
      if (itemsErr) throw itemsErr;

      toast({
        title: "Order Placed! 🎉",
        description: "We'll contact you shortly to confirm.",
      });
      clearCart();
      setDiscount(0);
      setCouponCode("");
      navigate("/dashboard/orders");
    } catch (e: any) {
      console.error("Checkout error:", e);
      toast({
        title: "Could not place order",
        description: e?.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setPlacing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div className="w-20 h-20 md:w-24 md:h-24 bg-muted rounded-full flex items-center justify-center mb-4 md:mb-6">
          <ShoppingCart className="h-10 w-10 md:h-12 md:w-12 text-muted-foreground" />
        </div>
        <h1 className="text-xl md:text-2xl font-bold text-foreground mb-2">Your Cart is Empty</h1>
        <p className="text-sm md:text-base text-muted-foreground mb-4 md:mb-6">
          Start shopping to add items!
        </p>
        <Link to="/dashboard/store">
          <Button variant="accent" size="lg" className="h-11 md:h-12">
            <ShoppingBag className="h-5 w-5 mr-2" />
            Start Shopping
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-foreground">Cart</h1>
          <p className="text-sm text-muted-foreground">{totalItems} items</p>
        </div>
        <Button variant="outline" size="sm" onClick={clearCart} className="text-xs md:text-sm">
          <Trash2 className="h-4 w-4 mr-1 md:mr-2" />
          Clear
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-4 md:gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-card rounded-xl p-3 md:p-4 shadow-elegant flex gap-3"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-lg flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-[10px] md:text-xs text-muted-foreground uppercase">{item.brand}</p>
                    <h3 className="font-medium text-foreground text-sm md:text-base line-clamp-1">{item.name}</h3>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-muted-foreground hover:text-destructive transition-colors p-1"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between mt-2 md:mt-3">
                  {/* Quantity */}
                  <div className="flex items-center gap-1 md:gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
                    >
                      <Minus className="h-3 w-3 md:h-4 md:w-4" />
                    </button>
                    <span className="w-6 md:w-8 text-center font-medium text-sm">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
                    >
                      <Plus className="h-3 w-3 md:h-4 md:w-4" />
                    </button>
                  </div>

                  {/* Price */}
                  <div className="text-right">
                    <p className="font-bold text-foreground text-sm md:text-base">{formatPrice(item.price * item.quantity)}</p>
                    <p className="text-[10px] md:text-xs text-muted-foreground">{formatPrice(item.price)} each</p>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <Link
            to="/dashboard/store"
            className="inline-flex items-center gap-2 text-accent hover:underline text-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            Continue Shopping
          </Link>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-xl md:rounded-2xl p-4 md:p-6 shadow-elegant sticky top-20">
            <h2 className="text-base md:text-lg font-semibold text-foreground mb-3 md:mb-4">Order Summary</h2>

            {/* Coupon */}
            <div className="mb-4 md:mb-6">
              <label className="text-xs md:text-sm text-muted-foreground mb-2 block">Coupon Code</label>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="h-9 md:h-10 text-sm"
                />
                <Button variant="outline" onClick={applyCoupon} className="h-9 md:h-10 px-3">
                  <Tag className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-[10px] md:text-xs text-muted-foreground mt-1">No active codes right now</p>
            </div>

            {/* Totals */}
            <div className="space-y-2 py-3 md:py-4 border-t border-border text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
            </div>

            <div className="flex justify-between py-3 md:py-4 border-t border-border">
              <span className="text-base md:text-lg font-semibold text-foreground">Total</span>
              <span className="text-base md:text-lg font-bold text-foreground">{formatPrice(finalTotal)}</span>
            </div>

            <Button
              variant="accent"
              className="w-full h-11 md:h-12"
              onClick={handleCheckout}
              disabled={placing}
            >
              {placing ? (
                <>
                  <Loader2 className="h-4 w-4 md:h-5 md:w-5 mr-2 animate-spin" />
                  Placing Order...
                </>
              ) : (
                <>
                  <CreditCard className="h-4 w-4 md:h-5 md:w-5 mr-2" />
                  Place Order (Cash on Delivery)
                </>
              )}
            </Button>

            <p className="text-[10px] md:text-xs text-muted-foreground text-center mt-3 md:mt-4">
              Online payment coming soon. For now, pay on delivery.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
