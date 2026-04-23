import { useState, useEffect } from "react";
import { ShoppingCart, Heart, Search, Grid3X3, LayoutList, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/contexts/CartContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(price);

const StorePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });
      setProducts(data || []);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  const categories = [
    { id: "all", name: "All" },
    { id: "smartphones", name: "Phones" },
    { id: "accessories", name: "Accessories" },
    { id: "electronics", name: "Electronics" },
  ];

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddToCart = (product: any) => {
    addToCart({
      id: product.id,
      name: product.name,
      brand: product.brand || "",
      price: product.price,
      originalPrice: product.original_price || product.price,
      image: product.images?.[0] || "/placeholder.svg",
    });
    toast({
      title: "Added to Cart!",
      description: `${product.name} has been added.`,
    });
  };

  return (
    <div className="space-y-5 md:space-y-8">
      {/* Search & Filters */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-4 px-4 md:mx-0 md:px-0">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium transition-all whitespace-nowrap ${
              selectedCategory === category.id
                ? "bg-accent text-accent-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {category.name}
          </button>
        ))}
        <div className="flex-1" />
        <div className="hidden md:flex items-center gap-1 bg-muted rounded-lg p-1">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-1.5 rounded ${viewMode === "grid" ? "bg-background shadow-sm" : ""}`}
          >
            <Grid3X3 className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-1.5 rounded ${viewMode === "list" ? "bg-background shadow-sm" : ""}`}
          >
            <LayoutList className="h-4 w-4" />
          </button>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </div>
      )}

      {/* Products Grid */}
      {!loading && <div
        className={
          viewMode === "grid"
            ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4"
            : "space-y-3"
        }
      >
        {filteredProducts.map((product) =>
          viewMode === "grid" ? (
            <div
              key={product.id}
              className="group bg-card rounded-xl md:rounded-2xl overflow-hidden shadow-elegant hover:shadow-deep transition-all"
            >
              {/* Image */}
              <div className="relative aspect-square bg-muted overflow-hidden">
                <img
                    src={product.images?.[0] || "/placeholder.svg"}
                    alt={product.name || ""}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {product.badge && (
                  <Badge className={`absolute top-2 left-2 text-[10px] md:text-xs ${product.badge_color || "bg-accent"} text-white`}>
                    {product.badge}
                  </Badge>
                )}
                <button className="absolute top-2 right-2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Heart className="h-4 w-4 text-muted-foreground hover:text-accent transition-colors" />
                </button>
              </div>

              {/* Content */}
              <div className="p-3 md:p-4">
                <p className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-wider mb-0.5">
                  {product.brand}
                </p>
                <h3 className="font-medium text-foreground text-sm md:text-base line-clamp-2 min-h-[2.5rem]">
                  {product.name}
                </h3>

                {/* Rating */}
                {product.stock !== undefined && (
                  <p className={`text-xs mt-1 ${product.stock > 0 ? "text-green-600" : "text-destructive font-medium"}`}>
                    {product.stock > 0 ? `In Stock (${product.stock})` : "Out of Stock"}
                  </p>
                )}

                {/* Price */}
                <div className="flex items-center gap-1 md:gap-2 mb-2 md:mb-3">
                  <span className="text-sm md:text-lg font-bold text-foreground">
                    {formatPrice(product.price)}
                  </span>
                  {product.original_price && product.original_price > product.price && (
                    <span className="text-[10px] md:text-sm text-muted-foreground line-through">
                      {formatPrice(product.original_price)}
                    </span>
                  )}
                </div>

                {/* Add to Cart */}
                <Button
                  variant="default"
                  className="w-full h-9 md:h-10 text-xs md:text-sm"
                  onClick={() => handleAddToCart(product)}
                  disabled={product.stock === 0}
                >
                  <ShoppingCart className="h-3.5 w-3.5 md:h-4 md:w-4 mr-1.5" />
                  {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                </Button>
              </div>
            </div>
          ) : (
            <div
              key={product.id}
              className="bg-card rounded-xl p-3 shadow-elegant flex gap-3"
            >
              <img
                src={product.images?.[0] || "/placeholder.svg"}
                alt={product.name || ""}
                className="w-20 h-20 md:w-28 md:h-28 object-cover rounded-lg flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-[10px] md:text-xs text-muted-foreground uppercase">{product.brand}</p>
                    <h3 className="font-medium text-foreground text-sm md:text-base line-clamp-1">{product.name}</h3>
                    <div className="flex items-center gap-1 mt-0.5">
                      {product.stock !== undefined && (
                        <span className={`text-[10px] ${product.stock > 0 ? "text-green-600" : "text-destructive"}`}>
                          {product.stock > 0 ? "In Stock" : "Out of Stock"}
                        </span>
                      )}
                    </div>
                  </div>
                  {product.badge && product.badge_color && (
                    <Badge className={`${product.badge_color} text-white text-[10px]`}>{product.badge}</Badge>
                  )}
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div>
                    <span className="font-bold text-foreground text-sm md:text-base">{formatPrice(product.price)}</span>
                    {product.original_price && product.original_price > product.price && (
                      <span className="text-[10px] md:text-sm text-muted-foreground line-through ml-1">
                        {formatPrice(product.original_price)}
                      </span>
                    )}
                  </div>
                  <Button size="sm" className="h-8 text-xs" onClick={() => handleAddToCart(product)} disabled={product.stock === 0}>
                    <ShoppingCart className="h-3.5 w-3.5 mr-1" />
                    {product.stock === 0 ? "Out of Stock" : "Add"}
                  </Button>
                </div>
              </div>
            </div>
          )
        )}
      </div>}

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="bg-card rounded-2xl p-8 md:p-12 text-center">
          <Search className="h-10 w-10 md:h-12 md:w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-base md:text-lg font-semibold text-foreground mb-2">No Products Found</h3>
          <p className="text-sm text-muted-foreground">Try adjusting your search or filters.</p>
        </div>
      )}
    </div>
  );
};

export default StorePage;
