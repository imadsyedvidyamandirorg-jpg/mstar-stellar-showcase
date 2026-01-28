import { Link } from "react-router-dom";
import { Film, Image, Bell, Gift, ShoppingBag, ArrowRight, TrendingUp, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { products, formatPrice } from "@/data/products";

const DashboardHome = () => {
  const featuredProducts = products.slice(0, 4);

  const quickLinks = [
    { name: "Watch Reels", icon: Film, href: "/dashboard/reels", color: "bg-pink-500", desc: "Latest videos & reviews" },
    { name: "Posts", icon: Image, href: "/dashboard/posts", color: "bg-blue-500", desc: "Updates & announcements" },
    { name: "Notifications", icon: Bell, href: "/dashboard/notifications", color: "bg-yellow-500", desc: "Stay updated" },
    { name: "New Offers", icon: Gift, href: "/dashboard/offers", color: "bg-green-500", desc: "Exclusive deals" },
    { name: "Online Store", icon: ShoppingBag, href: "/dashboard/store", color: "bg-accent", desc: "Shop gadgets" },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="hero-gradient rounded-3xl p-8 md:p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-accent/20 to-transparent" />
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-3">
            Welcome to MStar Mobile! 🌟
          </h1>
          <p className="text-primary-foreground/70 text-lg mb-6 max-w-xl">
            Explore the latest smartphones, accessories, and exclusive offers. Your one-stop destination for all things mobile.
          </p>
          <Link to="/dashboard/store">
            <Button variant="accent" size="lg">
              <ShoppingBag className="h-5 w-5 mr-2" />
              Shop Now
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Quick Links */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Quick Access</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {quickLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className="group bg-card rounded-2xl p-5 shadow-elegant hover:shadow-deep transition-all hover:-translate-y-1"
            >
              <div className={`w-12 h-12 ${link.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <link.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-foreground">{link.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">{link.desc}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Trending Products */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-accent" />
            <h2 className="text-xl font-semibold text-foreground">Trending Now</h2>
          </div>
          <Link to="/dashboard/store" className="text-accent hover:underline text-sm font-medium">
            View All
          </Link>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featuredProducts.map((product) => (
            <div key={product.id} className="bg-card rounded-2xl overflow-hidden shadow-elegant group">
              <div className="aspect-square bg-muted overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-4">
                <p className="text-xs text-muted-foreground uppercase">{product.brand}</p>
                <h3 className="font-medium text-foreground line-clamp-1">{product.name}</h3>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="h-3 w-3 text-mstar-gold fill-mstar-gold" />
                  <span className="text-xs text-muted-foreground">{product.rating}</span>
                </div>
                <p className="font-bold text-foreground mt-2">{formatPrice(product.price)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
