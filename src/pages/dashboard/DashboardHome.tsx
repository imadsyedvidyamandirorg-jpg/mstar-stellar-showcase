import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Film, Image, Bell, Gift, ShoppingBag, ArrowRight, TrendingUp, Star, Loader2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(price);

const DashboardHome = () => {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(4);
      setFeaturedProducts(data || []);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  const quickLinks = [
    { name: "Reels", icon: Film, href: "/dashboard/reels", color: "bg-pink-500" },
    { name: "Posts", icon: Image, href: "/dashboard/posts", color: "bg-blue-500" },
    { name: "Alerts", icon: Bell, href: "/dashboard/notifications", color: "bg-yellow-500" },
    { name: "Offers", icon: Gift, href: "/dashboard/offers", color: "bg-green-500" },
    { name: "Store", icon: ShoppingBag, href: "/dashboard/store", color: "bg-accent" },
    { name: "360° Tour", icon: Eye, href: "/dashboard/virtual-tour", color: "bg-teal-500" },
  ];

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Welcome Banner */}
      <div className="hero-gradient rounded-2xl md:rounded-3xl p-5 md:p-8 lg:p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-accent/20 to-transparent" />
        <div className="relative z-10">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-primary-foreground mb-2 md:mb-3">
            Welcome to MStar! 🌟
          </h1>
          <p className="text-primary-foreground/70 text-sm md:text-lg mb-4 md:mb-6 max-w-xl">
            Explore smartphones, accessories, and exclusive offers.
          </p>
          <Link to="/dashboard/store">
            <Button variant="accent" size="default" className="h-10 md:h-12 text-sm md:text-base">
              <ShoppingBag className="h-4 w-4 md:h-5 md:w-5 mr-2" />
              Shop Now
              <ArrowRight className="h-4 w-4 md:h-5 md:w-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Quick Links */}
      <div>
        <h2 className="text-base md:text-xl font-semibold text-foreground mb-3 md:mb-4">Quick Access</h2>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-4">
          {quickLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className="group flex flex-col items-center gap-2 p-3 md:p-5 bg-card rounded-xl md:rounded-2xl shadow-elegant hover:shadow-deep transition-all hover:-translate-y-1"
            >
              <div className={`w-10 h-10 md:w-12 md:h-12 ${link.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <link.icon className="h-5 w-5 md:h-6 md:w-6 text-white" />
              </div>
              <span className="font-medium text-foreground text-xs md:text-sm">{link.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Trending Products */}
      <div>
        <div className="flex items-center justify-between mb-3 md:mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 md:h-5 md:w-5 text-accent" />
            <h2 className="text-base md:text-xl font-semibold text-foreground">Trending</h2>
          </div>
          <Link to="/dashboard/store" className="text-accent hover:underline text-xs md:text-sm font-medium">
            View All
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-accent" />
          </div>
        ) : featuredProducts.length === 0 ? (
          <div className="bg-card rounded-xl p-8 text-center">
            <ShoppingBag className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">No products available yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {featuredProducts.map((product) => (
              <div key={product.id} className="bg-card rounded-xl md:rounded-2xl overflow-hidden shadow-elegant group">
                <div className="aspect-square bg-muted overflow-hidden">
                  <img
                    src={product.images?.[0] || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-3 md:p-4">
                  <p className="text-[10px] md:text-xs text-muted-foreground uppercase">{product.brand}</p>
                  <h3 className="font-medium text-foreground text-sm md:text-base line-clamp-1">{product.name}</h3>
                  {product.stock !== undefined && (
                    <p className={`text-[10px] mt-1 ${product.stock > 0 ? "text-green-600" : "text-destructive"}`}>
                      {product.stock > 0 ? "In Stock" : "Out of Stock"}
                    </p>
                  )}
                  <p className="font-bold text-foreground text-sm md:text-base mt-1 md:mt-2">{formatPrice(product.price)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardHome;
