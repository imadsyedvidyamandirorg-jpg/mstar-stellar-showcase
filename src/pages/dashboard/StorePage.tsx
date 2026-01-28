import { useState } from "react";
import { ShoppingCart, Heart, Star, Search, Filter, Grid3X3, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useCart } from "@/contexts/CartContext";
import { products, formatPrice } from "@/data/products";
import { useToast } from "@/hooks/use-toast";

const StorePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const { addToCart } = useCart();
  const { toast } = useToast();

  const categories = [
    { id: "all", name: "All Products" },
    { id: "smartphones", name: "Smartphones" },
    { id: "accessories", name: "Accessories" },
    { id: "electronics", name: "Electronics" },
  ];

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddToCart = (product: typeof products[0]) => {
    addToCart({
      id: product.id,
      name: product.name,
      brand: product.brand,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
    });
    toast({
      title: "Added to Cart!",
      description: `${product.name} has been added to your cart.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Online Store</h1>
          <p className="text-muted-foreground">{filteredProducts.length} products available</p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedCategory === category.id
                ? "bg-accent text-accent-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {category.name}
          </button>
        ))}
        <div className="flex-1" />
        <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded ${viewMode === "grid" ? "bg-background shadow-sm" : ""}`}
          >
            <Grid3X3 className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded ${viewMode === "list" ? "bg-background shadow-sm" : ""}`}
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Products Grid */}
      <div
        className={
          viewMode === "grid"
            ? "grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            : "space-y-4"
        }
      >
        {filteredProducts.map((product) =>
          viewMode === "grid" ? (
            <div
              key={product.id}
              className="group bg-card rounded-2xl overflow-hidden shadow-elegant hover:shadow-deep transition-all"
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
                <h3 className="font-semibold text-foreground mb-2 line-clamp-2 min-h-[3rem]">
                  {product.name}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-mstar-gold fill-mstar-gold" />
                    <span className="text-sm font-medium text-foreground">{product.rating}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    ({product.reviews.toLocaleString()})
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
                <Button
                  variant="default"
                  className="w-full"
                  onClick={() => handleAddToCart(product)}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
              </div>
            </div>
          ) : (
            <div
              key={product.id}
              className="bg-card rounded-2xl p-4 shadow-elegant flex gap-4"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-xl flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase">{product.brand}</p>
                    <h3 className="font-semibold text-foreground">{product.name}</h3>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="h-3 w-3 text-mstar-gold fill-mstar-gold" />
                      <span className="text-xs">{product.rating}</span>
                    </div>
                  </div>
                  {product.badge && (
                    <Badge className={`${product.badgeColor} text-white`}>{product.badge}</Badge>
                  )}
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div>
                    <span className="font-bold text-foreground">{formatPrice(product.price)}</span>
                    <span className="text-sm text-muted-foreground line-through ml-2">
                      {formatPrice(product.originalPrice)}
                    </span>
                  </div>
                  <Button size="sm" onClick={() => handleAddToCart(product)}>
                    <ShoppingCart className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </div>
              </div>
            </div>
          )
        )}
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="bg-card rounded-2xl p-12 text-center">
          <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No Products Found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filters.</p>
        </div>
      )}
    </div>
  );
};

export default StorePage;
