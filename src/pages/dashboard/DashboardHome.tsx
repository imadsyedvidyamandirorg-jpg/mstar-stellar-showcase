import { Link } from "react-router-dom";
import { useState, useEffect, lazy, Suspense } from "react";
import { Film, Image, Bell, Gift, ShoppingBag, ArrowRight, TrendingUp, Star, Loader2, Eye, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import SubscribeButton from "@/components/SubscribeButton";
import BannerCarousel from "@/components/BannerCarousel";
import CategoryStrip from "@/components/CategoryStrip";
import ReelsRow from "@/components/ReelsRow";
import OffersRow from "@/components/OffersRow";
import { motion } from "framer-motion";

const DroneModel = lazy(() => import("@/components/DroneModel"));

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
    { name: "Reels", icon: Film, href: "/dashboard/reels" },
    { name: "Posts", icon: Image, href: "/dashboard/posts" },
    { name: "Alerts", icon: Bell, href: "/dashboard/notifications" },
    { name: "Offers", icon: Gift, href: "/dashboard/offers" },
    { name: "Store", icon: ShoppingBag, href: "/dashboard/store" },
    { name: "360° Tour", icon: Eye, href: "/dashboard/virtual-tour" },
    { name: "Orders", icon: Package, href: "/dashboard/orders" },
  ];

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Banner Carousel */}
      <BannerCarousel />

      {/* Category Strip */}
      <CategoryStrip />

      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
        className="hero-gradient rounded-2xl md:rounded-3xl p-5 md:p-8 lg:p-12 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-accent/20 to-transparent" />
        <div className="relative z-10 grid md:grid-cols-2 gap-4 items-center">
          <div>
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-primary-foreground mb-2 md:mb-3"
            >
              Welcome to MStar! 🌟
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="text-primary-foreground/70 text-sm md:text-lg mb-4 md:mb-6 max-w-xl"
            >
              Explore smartphones, accessories, and exclusive offers.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
            >
              <Link to="/dashboard/store">
                <Button variant="accent" size="default" className="h-10 md:h-12 text-sm md:text-base">
                  <ShoppingBag className="h-4 w-4 md:h-5 md:w-5 mr-2" />
                  Shop Now
                  <ArrowRight className="h-4 w-4 md:h-5 md:w-5 ml-2" />
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Flying Drone */}
          <div className="relative h-44 md:h-60 lg:h-72 -mx-2 md:mx-0">
            <Suspense fallback={null}>
              <DroneModel className="w-full h-full" />
            </Suspense>
            {/* Soft glow under drone */}
            <div className="pointer-events-none absolute -bottom-2 left-1/2 -translate-x-1/2 w-40 h-3 rounded-full bg-accent/30 blur-2xl" />
          </div>
        </div>
      </motion.div>

      {/* Quick Links */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h2 className="text-base md:text-xl font-semibold text-foreground mb-3 md:mb-4">Quick Access</h2>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-4">
          {quickLinks.map((link, i) => (
            <motion.div
              key={link.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.35 + i * 0.05 }}
            >
              <Link
                to={link.href}
                className="group flex flex-col items-center gap-2 p-3 md:p-5 bg-card rounded-xl md:rounded-2xl shadow-elegant hover:shadow-deep transition-all hover:-translate-y-1"
              >
                <div className="w-10 h-10 md:w-12 md:h-12 bg-accent rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <link.icon className="h-5 w-5 md:h-6 md:w-6 text-accent-foreground" />
                </div>
                <span className="font-medium text-foreground text-xs md:text-sm">{link.name}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Live Offers */}
      <OffersRow />

      {/* Shorts / Reels */}
      <ReelsRow />

      {/* 360° Tour Promo */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.35 }}
      >
        <Link
          to="/dashboard/virtual-tour"
          className="block relative overflow-hidden rounded-2xl bg-gradient-to-r from-foreground via-foreground to-accent p-5 md:p-7 shadow-elegant hover:shadow-deep transition-all group"
        >
          <div className="relative z-10 flex items-center justify-between gap-4">
            <div className="text-primary-foreground">
              <div className="flex items-center gap-2 mb-1.5">
                <Eye className="h-4 w-4 md:h-5 md:w-5" />
                <span className="text-[10px] md:text-xs uppercase tracking-widest opacity-80">Immersive</span>
              </div>
              <h3 className="text-lg md:text-2xl font-bold mb-1">Take a 360° Tour</h3>
              <p className="text-xs md:text-sm opacity-80">Walk through our store from anywhere</p>
            </div>
            <div className="hidden sm:flex w-14 h-14 md:w-16 md:h-16 rounded-full bg-white/15 items-center justify-center group-hover:scale-110 transition-transform">
              <Eye className="h-6 w-6 md:h-8 md:w-8 text-primary-foreground" />
            </div>
          </div>
          <div className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full bg-accent/30 blur-3xl" />
        </Link>
      </motion.div>

      {/* Trending Products */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
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
            {featuredProducts.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.55 + i * 0.07 }}
                whileHover={{ y: -4 }}
                className="bg-card rounded-xl md:rounded-2xl overflow-hidden shadow-elegant group"
              >
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
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default DashboardHome;
