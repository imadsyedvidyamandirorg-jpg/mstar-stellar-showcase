import { Link } from "react-router-dom";
import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft, ShoppingBag, CreditCard, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/contexts/CartContext";
import { formatPrice } from "@/data/products";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const CartPage = () => {
  const { items, removeFromCart, updateQuantity, clearCart, totalPrice, totalItems } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const { toast } = useToast();

  const applyCoupon = () => {
    if (couponCode.toUpperCase() === "WEEKEND30") {
      setDiscount(totalPrice * 0.3);
      toast({
        title: "Coupon Applied!",
        description: "You got 30% off on your order.",
      });
    } else if (couponCode.toUpperCase() === "STUDENT10") {
      setDiscount(totalPrice * 0.1);
      toast({
        title: "Coupon Applied!",
        description: "You got 10% student discount.",
      });
    } else {
      toast({
        title: "Invalid Coupon",
        description: "Please enter a valid coupon code.",
        variant: "destructive",
      });
    }
  };

  const finalTotal = totalPrice - discount;

  const handleCheckout = () => {
    toast({
      title: "Order Placed! 🎉",
      description: "Thank you for shopping with MStar Mobile. We'll contact you shortly.",
    });
    clearCart();
    setDiscount(0);
    setCouponCode("");
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
          <ShoppingCart className="h-12 w-12 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Your Cart is Empty</h1>
        <p className="text-muted-foreground mb-6">
          Looks like you haven't added anything to your cart yet.
        </p>
        <Link to="/dashboard/store">
          <Button variant="accent" size="lg">
            <ShoppingBag className="h-5 w-5 mr-2" />
            Start Shopping
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Shopping Cart</h1>
          <p className="text-muted-foreground">{totalItems} items in your cart</p>
        </div>
        <Button variant="outline" size="sm" onClick={clearCart}>
          <Trash2 className="h-4 w-4 mr-2" />
          Clear Cart
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-card rounded-2xl p-4 shadow-elegant flex gap-4"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-24 h-24 object-cover rounded-xl flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase">{item.brand}</p>
                    <h3 className="font-semibold text-foreground">{item.name}</h3>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>

                <div className="flex items-center justify-between mt-4">
                  {/* Quantity */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Price */}
                  <div className="text-right">
                    <p className="font-bold text-foreground">{formatPrice(item.price * item.quantity)}</p>
                    <p className="text-xs text-muted-foreground">{formatPrice(item.price)} each</p>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <Link
            to="/dashboard/store"
            className="inline-flex items-center gap-2 text-accent hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Continue Shopping
          </Link>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-2xl p-6 shadow-elegant sticky top-24">
            <h2 className="text-lg font-semibold text-foreground mb-4">Order Summary</h2>

            {/* Coupon */}
            <div className="mb-6">
              <label className="text-sm text-muted-foreground mb-2 block">Coupon Code</label>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                />
                <Button variant="outline" onClick={applyCoupon}>
                  <Tag className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Try: WEEKEND30 or STUDENT10</p>
            </div>

            {/* Totals */}
            <div className="space-y-3 py-4 border-t border-border">
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

            <div className="flex justify-between py-4 border-t border-border">
              <span className="text-lg font-semibold text-foreground">Total</span>
              <span className="text-lg font-bold text-foreground">{formatPrice(finalTotal)}</span>
            </div>

            <Button
              variant="accent"
              className="w-full"
              size="lg"
              onClick={handleCheckout}
            >
              <CreditCard className="h-5 w-5 mr-2" />
              Checkout
            </Button>

            <p className="text-xs text-muted-foreground text-center mt-4">
              Free delivery on orders above ₹5,000
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
