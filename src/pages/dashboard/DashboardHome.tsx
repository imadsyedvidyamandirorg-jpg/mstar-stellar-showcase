import { Link } from "react-router-dom";
import { useState, useEffect, lazy, Suspense } from "react";
import { Film, Image, Bell, Gift, ShoppingBag, ArrowRight, TrendingUp, Loader2, Eye, Package, Sparkles, ShieldCheck, Truck } from "lucide-react";
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
    { name: "Reels", icon: Film, href: "/dashboard/reels", color: "bg-pink-500" },
    { name: "Posts", icon: Image, href: "/dashboard/posts", color: "bg-blue-500" },
    { name: "Alerts", icon: Bell, href: "/dashboard/notifications", color: "bg-yellow-500" },
    { name: "Offers", icon: Gift, href: "/dashboard/offers", color: "bg-green-500" },
    { name: "Store", icon: ShoppingBag, href: "/dashboard/store", color: "bg-accent" },
    { name: "360° Tour", icon: Eye, href: "/dashboard/virtual-tour", color: "bg-teal-500" },
    { name: "Orders", icon: Package, href: "/dashboard/orders", color: "bg-orange-500" },
  ];

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Cinematic Hero */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative overflow-hidden rounded-2xl md:rounded-[28px] bg-[hsl(var(--mstar-black))] -mt-2"
      >
        {/* Layered background depth */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(var(--accent)/0.35),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,hsl(0_0%_100%/0.06),transparent_60%)]" />
        <div
          className="absolute inset-0 opacity-[0.07] mix-blend-overlay"
          style={{
            backgroundImage:
              "linear-gradient(hsl(0 0% 100% / 0.4) 1px, transparent 1px), linear-gradient(90deg, hsl(0 0% 100% / 0.4) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />
        {/* Particles */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {[...Array(14)].map((_, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.7, 0], y: [0, -30, -60] }}
              transition={{ duration: 6 + (i % 5), repeat: Infinity, delay: i * 0.4, ease: "easeInOut" }}
              className="absolute w-1 h-1 rounded-full bg-white/60"
              style={{ left: `${(i * 73) % 100}%`, top: `${20 + ((i * 37) % 70)}%` }}
            />
          ))}
        </div>

        <div className="relative z-10 grid md:grid-cols-[1.1fr_1fr] gap-4 items-center px-5 py-7 md:px-10 md:py-12 lg:px-14 lg:py-16">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 backdrop-blur px-3 py-1 text-[11px] md:text-xs uppercase tracking-[0.18em] text-white/80"
            >
              <Sparkles className="h-3 w-3 text-accent" />
              Premium accessories & smart gadgets
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="mt-4 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold leading-[1.05] tracking-tight text-white"
            >
              Tech that feels
              <br />
              <span className="text-gradient">handcrafted.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35 }}
              className="mt-4 md:mt-5 max-w-md text-sm md:text-base text-white/65 leading-relaxed"
            >
              Curated audio, smart wearables, drones and lifestyle gadgets — chosen for the people who notice the details.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-6 flex flex-wrap items-center gap-3"
            >
              <Link to="/dashboard/store">
                <Button
                  variant="accent"
                  className="h-11 md:h-12 px-5 md:px-6 text-sm md:text-base rounded-full shadow-[0_10px_40px_-10px_hsl(var(--accent)/0.7)] hover:shadow-[0_14px_50px_-10px_hsl(var(--accent)/0.9)] transition-shadow"
                >
                  Explore Store
                  <ArrowRight className="h-4 w-4 md:h-5 md:w-5 ml-2" />
                </Button>
              </Link>
              <Link to="/dashboard/virtual-tour">
                <Button
                  variant="outline"
                  className="h-11 md:h-12 px-5 md:px-6 text-sm md:text-base rounded-full bg-white/5 border-white/20 text-white hover:bg-white/10 hover:text-white"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  360° Tour
                </Button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.65 }}
              className="mt-7 md:mt-9 grid grid-cols-3 max-w-md gap-3 md:gap-4"
            >
              {[
                { k: "1L+", v: "Happy customers" },
                { k: "500+", v: "Curated products" },
                { k: "4.9★", v: "Avg. rating" },
              ].map((s) => (
                <div key={s.v} className="rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur px-3 py-2.5">
                  <p className="font-display text-lg md:text-2xl text-white leading-none">{s.k}</p>
                  <p className="mt-1 text-[10px] md:text-[11px] uppercase tracking-wider text-white/55">{s.v}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Drone */}
          <div className="relative h-56 sm:h-72 md:h-[360px] lg:h-[420px] -mx-2 md:mx-0">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,hsl(var(--accent)/0.25),transparent_60%)] blur-2xl" />
            <Suspense fallback={null}>
              <DroneModel className="w-full h-full" />
            </Suspense>
            <div className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 w-44 h-3 rounded-full bg-accent/40 blur-2xl" />
          </div>
        </div>

        {/* Brand trust strip */}
        <div className="relative z-10 border-t border-white/10 bg-black/30 backdrop-blur-sm px-5 md:px-10 lg:px-14 py-3 md:py-4">
          <div className="flex items-center gap-6 md:gap-10 overflow-x-auto no-scrollbar text-[11px] md:text-xs uppercase tracking-[0.2em] text-white/50 font-medium">
            <span className="flex items-center gap-1.5 shrink-0"><ShieldCheck className="h-3.5 w-3.5 text-accent" /> 100% Genuine</span>
            <span className="shrink-0">boAt</span>
            <span className="shrink-0">Noise</span>
            <span className="shrink-0">JBL</span>
            <span className="shrink-0">DJI</span>
            <span className="shrink-0">Realme</span>
            <span className="flex items-center gap-1.5 shrink-0"><Truck className="h-3.5 w-3.5 text-accent" /> Pan-India shipping</span>
          </div>
        </div>
      </motion.section>

      {/* Banner Carousel */}
      <BannerCarousel />

      {/* Category Strip */}
      <CategoryStrip />

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
                <div className={`w-10 h-10 md:w-12 md:h-12 ${link.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-md`}>
                  <link.icon className="h-5 w-5 md:h-6 md:w-6 text-white" />
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
