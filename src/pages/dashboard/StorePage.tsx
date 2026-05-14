import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ShoppingCart, Heart, Search, Grid3X3, LayoutList, Loader2, SlidersHorizontal, X, ArrowUpDown, Sparkles, Flame, Package, Truck, ShieldCheck, RotateCcw, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useCart } from "@/contexts/CartContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(price);

const WISHLIST_KEY = "mstar_wishlist";

const StorePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("cat") || "all");
  const [selectedBrand, setSelectedBrand] = useState<string>(searchParams.get("brand") || "all");
  const [sortBy, setSortBy] = useState<string>("featured");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200000]);
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [onlyDeals, setOnlyDeals] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(WISHLIST_KEY) || "[]");
    } catch {
      return [];
    }
  });
  const { addToCart } = useCart();
  const { toast } = useToast();

  const toggleWishlist = (id: string) => {
    setWishlist((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      try {
        localStorage.setItem(WISHLIST_KEY, JSON.stringify(next));
      } catch {}
      toast({
        title: prev.includes(id) ? "Removed from Wishlist" : "Added to Wishlist ❤️",
      });
      return next;
    });
  };

  useEffect(() => {
    const cat = searchParams.get("cat") || "all";
    const brand = searchParams.get("brand") || "all";
    setSelectedCategory(cat);
    setSelectedBrand(brand);
  }, [searchParams]);

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
    { id: "all", name: "All", icon: Package },
    { id: "accessories", name: "Accessories", icon: Sparkles },
    { id: "electronics", name: "Electronics", icon: Flame },
  ];

  // Derived: brands list from current products
  const brands = Array.from(
    new Set(products.map((p) => p.brand).filter(Boolean))
  ).sort();

  const maxProductPrice = Math.max(200000, ...products.map((p) => p.price || 0));

  const baseFiltered = products.filter((product) => {
    const matchesSearch =
      product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;
    const matchesBrand =
      selectedBrand === "all" || product.brand?.toLowerCase() === selectedBrand.toLowerCase();
    const matchesPrice =
      product.price >= priceRange[0] && product.price <= priceRange[1];
    const matchesStock = !onlyInStock || (product.stock ?? 1) > 0;
    const hasDeal =
      !!product.original_price && product.original_price > product.price;
    const matchesDeals = !onlyDeals || hasDeal;
    return (
      matchesSearch &&
      matchesCategory &&
      matchesBrand &&
      matchesPrice &&
      matchesStock &&
      matchesDeals
    );
  });

  const filteredProducts = [...baseFiltered].sort((a, b) => {
    switch (sortBy) {
      case "price-asc":
        return (a.price || 0) - (b.price || 0);
      case "price-desc":
        return (b.price || 0) - (a.price || 0);
      case "newest":
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case "discount": {
        const da = a.original_price ? (a.original_price - a.price) / a.original_price : 0;
        const db = b.original_price ? (b.original_price - b.price) / b.original_price : 0;
        return db - da;
      }
      default:
        return 0;
    }
  });

  const discountPct = (p: any) =>
    p.original_price && p.original_price > p.price
      ? Math.round(((p.original_price - p.price) / p.original_price) * 100)
      : 0;

  const isNew = (p: any) => {
    if (!p.created_at) return false;
    const days = (Date.now() - new Date(p.created_at).getTime()) / 86400000;
    return days <= 14;
  };

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

  const updateParam = (key: string, value: string | null) => {
    if (!value || value === "all") searchParams.delete(key);
    else searchParams.set(key, value);
    setSearchParams(searchParams, { replace: true });
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedBrand("all");
    setPriceRange([0, maxProductPrice]);
    setOnlyInStock(false);
    setOnlyDeals(false);
    setSortBy("featured");
    searchParams.delete("cat");
    searchParams.delete("brand");
    setSearchParams(searchParams, { replace: true });
  };

  const FiltersPanel = () => (
    <div className="space-y-6">
      <div>
        <h4 className="text-sm font-semibold mb-3">Brand</h4>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              setSelectedBrand("all");
              updateParam("brand", null);
            }}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
              selectedBrand === "all"
                ? "bg-accent text-accent-foreground border-accent"
                : "border-border hover:border-accent"
            }`}
          >
            All
          </button>
          {brands.map((b) => (
            <button
              key={b}
              onClick={() => {
                setSelectedBrand(b);
                updateParam("brand", b);
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition capitalize ${
                selectedBrand.toLowerCase() === b.toLowerCase()
                  ? "bg-accent text-accent-foreground border-accent"
                  : "border-border hover:border-accent"
              }`}
            >
              {b}
            </button>
          ))}
          {brands.length === 0 && (
            <p className="text-xs text-muted-foreground">No brands yet.</p>
          )}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold">Price Range</h4>
          <span className="text-xs text-muted-foreground">
            {formatPrice(priceRange[0])} – {formatPrice(priceRange[1])}
          </span>
        </div>
        <Slider
          value={priceRange}
          min={0}
          max={maxProductPrice}
          step={500}
          onValueChange={(v) => setPriceRange(v as [number, number])}
        />
      </div>

      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={onlyInStock}
            onChange={(e) => setOnlyInStock(e.target.checked)}
            className="accent-accent"
          />
          In stock only
        </label>
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={onlyDeals}
            onChange={(e) => setOnlyDeals(e.target.checked)}
            className="accent-accent"
          />
          On sale only
        </label>
      </div>

      <Button variant="outline" className="w-full" onClick={clearAllFilters}>
        <RotateCcw className="h-4 w-4 mr-2" /> Clear All
      </Button>
    </div>
  );

  return (
    <div className="space-y-5 md:space-y-7">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-[hsl(var(--mstar-black))] text-primary-foreground p-5 md:p-8"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(var(--accent)/0.4),transparent_55%)]" />
        <div className="absolute inset-0 opacity-[0.06] mix-blend-overlay" style={{ backgroundImage: "linear-gradient(hsl(0 0% 100% / 0.4) 1px, transparent 1px), linear-gradient(90deg, hsl(0 0% 100% / 0.4) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        <div className="relative z-10 flex items-center justify-between gap-4">
          <div>
            <p className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-white/60 mb-2">
              MStar Store
            </p>
            <h1 className="text-2xl md:text-4xl font-semibold tracking-tight">
              Premium accessories,<br className="hidden sm:block" /> handpicked.
            </h1>
            <p className="text-xs md:text-sm text-white/65 mt-2">
              Pan-India shipping • COD available • 7-day returns on sealed items
            </p>
          </div>
          <div className="hidden sm:flex flex-col items-end gap-1 text-xs">
            <span className="flex items-center gap-1 opacity-90"><Truck className="h-3.5 w-3.5" /> Fast Delivery</span>
            <span className="flex items-center gap-1 opacity-90"><ShieldCheck className="h-3.5 w-3.5" /> Genuine Products</span>
          </div>
        </div>
        <div className="absolute -right-12 -bottom-12 w-44 h-44 rounded-full bg-accent/40 blur-3xl" />
      </motion.div>

      {/* Sticky toolbar */}
      <div className="sticky top-14 md:top-16 z-30 -mx-4 px-4 md:mx-0 md:px-0 bg-background/85 backdrop-blur-md py-2 border-b border-border/60">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products, brands…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded"
              >
                <X className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
            )}
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[140px] h-10 hidden sm:flex">
              <ArrowUpDown className="h-3.5 w-3.5 mr-1" />
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
              <SelectItem value="discount">Biggest Discount</SelectItem>
            </SelectContent>
          </Select>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="h-10 w-10 shrink-0">
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <FiltersPanel />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Category chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => {
              setSelectedCategory(category.id);
              updateParam("cat", category.id === "all" ? null : category.id);
            }}
            className={`flex items-center gap-1.5 px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium transition-all whitespace-nowrap border ${
              selectedCategory === category.id
                ? "bg-accent text-accent-foreground border-accent shadow"
                : "bg-card text-foreground border-border hover:border-accent"
            }`}
          >
            <category.icon className="h-3.5 w-3.5" />
            {category.name}
          </button>
        ))}
        {selectedBrand !== "all" && (
          <button
            onClick={() => {
              setSelectedBrand("all");
              updateParam("brand", null);
            }}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium bg-accent/10 text-accent border border-accent/30"
          >
            Brand: {selectedBrand} <X className="h-3 w-3" />
          </button>
        )}
        {onlyDeals && (
          <button
            onClick={() => setOnlyDeals(false)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium bg-accent/10 text-accent border border-accent/30"
          >
            On Sale <X className="h-3 w-3" />
          </button>
        )}
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

      {/* Result count + trust badges */}
      {!loading && (
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            Showing <span className="font-semibold text-foreground">{filteredProducts.length}</span> of {products.length} products
          </span>
          <div className="hidden md:flex items-center gap-4">
            <span className="flex items-center gap-1"><Truck className="h-3.5 w-3.5" /> Free shipping over ₹999</span>
            <span className="flex items-center gap-1"><RotateCcw className="h-3.5 w-3.5" /> Easy returns</span>
          </div>
        </div>
      )}

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
        {filteredProducts.map((product, idx) =>
          viewMode === "grid" ? (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: Math.min(idx * 0.03, 0.3) }}
              whileHover={{ y: -4 }}
              className="group bg-card rounded-2xl overflow-hidden border border-border/60 hover:border-accent/50 transition-all relative shadow-[0_2px_10px_-4px_rgba(0,0,0,0.08)] hover:shadow-[0_24px_60px_-20px_hsl(var(--accent)/0.35)] hover:-translate-y-1"
            >
              {/* Discount ribbon */}
              {discountPct(product) > 0 && (
                <div className="absolute top-0 left-0 z-10 bg-accent text-accent-foreground text-[10px] md:text-xs font-bold px-2 py-1 rounded-br-lg">
                  -{discountPct(product)}%
                </div>
              )}
              {/* New tag */}
              {isNew(product) && (
                <div className="absolute top-2 right-12 z-10 bg-foreground text-primary-foreground text-[9px] md:text-[10px] font-bold px-1.5 py-0.5 rounded">
                  NEW
                </div>
              )}
              {/* Image */}
              <Link to={`/dashboard/product/${product.id}`} className="relative aspect-square bg-gradient-to-br from-muted to-background overflow-hidden block">
                {/* Hover light sweep */}
                <div className="pointer-events-none absolute -inset-x-10 -top-10 h-32 rotate-[18deg] bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 group-hover:translate-x-[60%] transition-all duration-700" />
                <img
                    src={product.images?.[0] || "/placeholder.svg"}
                    alt={product.name || ""}
                    loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-[1.08] transition-transform duration-700 ease-out"
                />
                {product.badge && (
                  <Badge className={`absolute top-2 left-2 text-[10px] md:text-xs ${product.badge_color || "bg-accent"} text-white`}>
                    {product.badge}
                  </Badge>
                )}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    toggleWishlist(product.id);
                  }}
                  className="absolute top-2 right-2 w-8 h-8 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-all"
                  aria-label="Toggle wishlist"
                >
                  <Heart
                    className={`h-4 w-4 transition-colors ${
                      wishlist.includes(product.id)
                        ? "fill-accent text-accent"
                        : "text-muted-foreground"
                    }`}
                  />
                </button>
                {/* Quick view on hover (desktop) */}
                <div className="hidden md:flex absolute inset-x-2 bottom-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="flex-1 text-center text-[11px] font-medium bg-foreground/90 text-primary-foreground py-1.5 rounded-md flex items-center justify-center gap-1">
                    <Eye className="h-3 w-3" /> Quick view
                  </span>
                </div>
              </Link>

              {/* Content */}
              <div className="p-3 md:p-4">
                <p className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-wider mb-0.5">
                  {product.brand}
                </p>
                <Link to={`/dashboard/product/${product.id}`} className="font-medium text-foreground text-sm md:text-base line-clamp-2 min-h-[2.5rem] hover:text-accent transition-colors block">
                  {product.name}
                </Link>

                {/* Stock + rating placeholder */}
                {product.stock !== undefined && (
                  <div className="flex items-center justify-between mt-1">
                    <p className={`text-[10px] md:text-xs ${product.stock > 0 ? "text-green-600" : "text-destructive font-medium"}`}>
                      {product.stock > 0 ? `In Stock` : "Out of Stock"}
                    </p>
                    <span className="text-[10px] text-yellow-500">★★★★☆</span>
                  </div>
                )}

                {/* Price */}
                <div className="flex items-baseline gap-1 md:gap-2 mb-2 md:mb-3 mt-1">
                  <span className="text-sm md:text-lg font-bold text-foreground">
                    {formatPrice(product.price)}
                  </span>
                  {product.original_price && product.original_price > product.price && (
                    <>
                      <span className="text-[10px] md:text-sm text-muted-foreground line-through">
                        {formatPrice(product.original_price)}
                      </span>
                      <span className="text-[10px] md:text-xs text-green-600 font-semibold">
                        Save {formatPrice(product.original_price - product.price)}
                      </span>
                    </>
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
            </motion.div>
          ) : (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: Math.min(idx * 0.03, 0.3) }}
              className="bg-card rounded-xl p-3 shadow-elegant hover:shadow-deep transition-all flex gap-3 border border-border/50 hover:border-accent/40"
            >
              <Link to={`/dashboard/product/${product.id}`} className="relative shrink-0">
                <img
                  src={product.images?.[0] || "/placeholder.svg"}
                  alt={product.name || ""}
                  loading="lazy"
                  className="w-20 h-20 md:w-28 md:h-28 object-cover rounded-lg"
                />
                {discountPct(product) > 0 && (
                  <span className="absolute -top-1 -left-1 bg-accent text-accent-foreground text-[9px] font-bold px-1.5 py-0.5 rounded">
                    -{discountPct(product)}%
                  </span>
                )}
              </Link>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-[10px] md:text-xs text-muted-foreground uppercase">{product.brand}</p>
                    <Link to={`/dashboard/product/${product.id}`} className="font-medium text-foreground text-sm md:text-base line-clamp-1 hover:text-accent">
                      {product.name}
                    </Link>
                    <div className="flex items-center gap-1 mt-0.5">
                      {product.stock !== undefined && (
                        <span className={`text-[10px] ${product.stock > 0 ? "text-green-600" : "text-destructive"}`}>
                          {product.stock > 0 ? "In Stock" : "Out of Stock"}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className="p-1.5 rounded-full hover:bg-muted"
                  >
                    <Heart
                      className={`h-4 w-4 ${
                        wishlist.includes(product.id)
                          ? "fill-accent text-accent"
                          : "text-muted-foreground"
                      }`}
                    />
                  </button>
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
            </motion.div>
          )
        )}
      </div>}

      {/* Empty State */}
      {!loading && filteredProducts.length === 0 && (
        <div className="bg-card rounded-2xl p-8 md:p-12 text-center">
          <Search className="h-10 w-10 md:h-12 md:w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-base md:text-lg font-semibold text-foreground mb-2">No Products Found</h3>
          <p className="text-sm text-muted-foreground mb-4">Try adjusting your search or filters.</p>
          <Button onClick={clearAllFilters} variant="outline">
            <RotateCcw className="h-4 w-4 mr-2" /> Reset Filters
          </Button>
        </div>
      )}

      {/* Trust strip */}
      {!loading && filteredProducts.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4">
          {[
            { icon: Truck, label: "Fast Delivery", desc: "Ships within 24 hrs" },
            { icon: ShieldCheck, label: "100% Genuine", desc: "Authorized dealer" },
            { icon: RotateCcw, label: "Easy Returns", desc: "7-day replacement" },
            { icon: Sparkles, label: "Best Prices", desc: "Honest, transparent pricing" },
          ].map((t) => (
            <div key={t.label} className="bg-card border border-border/60 rounded-xl p-3 md:p-4 flex items-center gap-3">
              <div className="w-9 h-9 md:w-10 md:h-10 rounded-lg bg-accent/10 text-accent flex items-center justify-center shrink-0">
                <t.icon className="h-4 w-4 md:h-5 md:w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs md:text-sm font-semibold leading-tight">{t.label}</p>
                <p className="text-[10px] md:text-xs text-muted-foreground leading-tight">{t.desc}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StorePage;
