import { ShoppingCart, Heart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const products = [
  {
    id: 1,
    name: "Samsung Galaxy S24 Ultra",
    brand: "Samsung",
    price: 129999,
    originalPrice: 139999,
    rating: 4.9,
    reviews: 2340,
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=400&fit=crop",
    badge: "Bestseller",
    badgeColor: "bg-accent",
  },
  {
    id: 2,
    name: "iPhone 15 Pro Max",
    brand: "Apple",
    price: 159999,
    originalPrice: 169999,
    rating: 4.8,
    reviews: 3120,
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=400&fit=crop",
    badge: "Premium",
    badgeColor: "bg-mstar-gold",
  },
  {
    id: 3,
    name: "OnePlus 12 5G",
    brand: "OnePlus",
    price: 64999,
    originalPrice: 69999,
    rating: 4.7,
    reviews: 1890,
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop",
    badge: "New",
    badgeColor: "bg-green-500",
  },
  {
    id: 4,
    name: "Realme GT 5 Pro",
    brand: "Realme",
    price: 35999,
    originalPrice: 39999,
    rating: 4.6,
    reviews: 980,
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=400&fit=crop",
    badge: "Hot Deal",
    badgeColor: "bg-orange-500",
  },
  {
    id: 5,
    name: "Vivo X100 Pro",
    brand: "Vivo",
    price: 89999,
    originalPrice: 94999,
    rating: 4.7,
    reviews: 1240,
    image: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400&h=400&fit=crop",
    badge: null,
    badgeColor: null,
  },
  {
    id: 6,
    name: "Xiaomi 14 Ultra",
    brand: "Xiaomi",
    price: 99999,
    originalPrice: 109999,
    rating: 4.8,
    reviews: 1560,
    image: "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=400&h=400&fit=crop",
    badge: "Camera King",
    badgeColor: "bg-purple-500",
  },
  {
    id: 7,
    name: "AirPods Pro 2",
    brand: "Apple",
    price: 24999,
    originalPrice: 27999,
    rating: 4.9,
    reviews: 4500,
    image: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=400&h=400&fit=crop",
    badge: "Popular",
    badgeColor: "bg-blue-500",
  },
  {
    id: 8,
    name: "Samsung Galaxy Watch 6",
    brand: "Samsung",
    price: 28999,
    originalPrice: 32999,
    rating: 4.6,
    reviews: 890,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
    badge: null,
    badgeColor: null,
  },
];

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
};

const OnlineStore = () => {
  return (
    <section id="store" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <span className="text-accent font-medium text-sm uppercase tracking-wider">Shop Online</span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-3">
              Featured Products
            </h2>
            <p className="text-muted-foreground mt-2">
              Explore our collection of premium accessories & smart gadgets
            </p>
          </div>
          <Button variant="outline" size="lg">
            View All Products
          </Button>
        </div>

        {/* Products Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="group bg-card rounded-2xl overflow-hidden shadow-elegant hover:shadow-deep transition-all duration-300"
            >
              {/* Image */}
              <div className="relative aspect-square bg-muted overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {product.badge && (
                  <Badge className={`absolute top-3 left-3 ${product.badgeColor} text-white`}>
                    {product.badge}
                  </Badge>
                )}
                <button className="absolute top-3 right-3 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white">
                  <Heart className="h-5 w-5 text-muted-foreground hover:text-accent transition-colors" />
                </button>
              </div>

              {/* Content */}
              <div className="p-4">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                  {product.brand}
                </p>
                <h3 className="font-semibold text-foreground mb-2 line-clamp-2">
                  {product.name}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-mstar-gold fill-mstar-gold" />
                    <span className="text-sm font-medium text-foreground">{product.rating}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    ({product.reviews.toLocaleString()} reviews)
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-lg font-bold text-foreground">
                    {formatPrice(product.price)}
                  </span>
                  <span className="text-sm text-muted-foreground line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                </div>

                {/* Add to Cart */}
                <Button variant="default" className="w-full" size="sm">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OnlineStore;
