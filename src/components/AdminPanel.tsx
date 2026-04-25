import { useState, useEffect } from "react";
import { X, Package, Plus, Trash2, Edit, ShoppingBag, Image, Film, Gift, Users, Bell, Volume2, VolumeX, AlertTriangle, Send, BarChart3, Eye, TrendingUp, Camera, Sparkles, Loader2, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

type Tab = "products" | "orders" | "reels" | "posts" | "offers" | "notifications" | "alerts" | "analytics" | "panorama";

interface AdminPanelProps {
  onClose: () => void;
}

const AdminPanel = ({ onClose }: AdminPanelProps) => {
  const [activeTab, setActiveTab] = useState<Tab>("products");
  const { toast } = useToast();

  const tabs = [
    { id: "products" as Tab, label: "Products", icon: Package },
    { id: "orders" as Tab, label: "Orders", icon: ShoppingBag },
    { id: "reels" as Tab, label: "Reels", icon: Film },
    { id: "posts" as Tab, label: "Posts", icon: Image },
    { id: "offers" as Tab, label: "Offers", icon: Gift },
    { id: "notifications" as Tab, label: "Push Alerts", icon: Bell },
    { id: "alerts" as Tab, label: "Order Alerts", icon: Volume2 },
    { id: "analytics" as Tab, label: "Analytics", icon: BarChart3 },
    { id: "panorama" as Tab, label: "360° Tour", icon: Camera },
  ];

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 md:p-4">
      <div className="bg-card w-full max-w-6xl max-h-[95vh] rounded-2xl shadow-deep overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-5 border-b border-border bg-gradient-to-r from-accent/5 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-accent rounded-xl flex items-center justify-center">
              <Users className="h-5 w-5 md:h-6 md:w-6 text-accent-foreground" />
            </div>
            <div>
              <h2 className="font-bold text-foreground text-base md:text-lg">Admin Panel</h2>
              <p className="text-xs text-muted-foreground">MStar Mobile Management</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border overflow-x-auto bg-muted/30">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 md:px-4 py-3 text-xs md:text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? "border-accent text-accent"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {activeTab === "products" && <ProductsManager />}
          {activeTab === "orders" && <OrdersManager />}
          {activeTab === "reels" && <ReelsManager />}
          {activeTab === "posts" && <PostsManager />}
          {activeTab === "offers" && <OffersManager />}
          {activeTab === "notifications" && <NotificationsManager />}
          {activeTab === "alerts" && <OrderAlertsManager />}
          {activeTab === "analytics" && <AnalyticsDashboard />}
          {activeTab === "panorama" && <PanoramaManager />}
        </div>
      </div>
    </div>
  );
};

// ==================== PRODUCTS MANAGER ====================
const ProductsManager = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [generatingDesc, setGeneratingDesc] = useState(false);
  const { toast } = useToast();
  const [form, setForm] = useState({
    name: "", brand: "", category: "smartphones", description: "",
    price: "", original_price: "", stock: "0", badge: "",
    badge_color: "bg-accent", emi_available: false,
    is_new_arrival: false, is_bestseller: false,
  });
  const [pendingImages, setPendingImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const handleGenerateDescription = async () => {
    if (!form.name) {
      toast({ title: "Add a product name first", variant: "destructive" });
      return;
    }
    setGeneratingDesc(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-product-description", {
        body: {
          name: form.name,
          brand: form.brand,
          category: form.category,
          price: form.price,
        },
      });
      if (error) throw error;
      if (data?.description) {
        setForm((f) => ({ ...f, description: data.description }));
        toast({ title: "Description generated!", description: "Edit it before saving if needed." });
      } else if (data?.error) {
        toast({ title: "AI error", description: data.error, variant: "destructive" });
      }
    } catch (e: any) {
      toast({ title: "Could not generate", description: e?.message || "Try again", variant: "destructive" });
    } finally {
      setGeneratingDesc(false);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    setProducts(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleSubmit = async () => {
    const payload = {
      name: form.name,
      brand: form.brand,
      category: form.category,
      description: form.description,
      price: Number(form.price),
      original_price: Number(form.original_price) || null,
      stock: Number(form.stock),
      badge: form.badge || null,
      badge_color: form.badge_color || null,
      emi_available: form.emi_available,
      is_new_arrival: form.is_new_arrival,
      is_bestseller: form.is_bestseller,
    };

    if (editingId) {
      // Upload pending images
      if (pendingImages.length > 0) {
        const product = products.find((p) => p.id === editingId);
        const existingImages = product?.images || [];
        const uploadedUrls: string[] = [];
        for (const file of pendingImages) {
          const fileExt = file.name.split(".").pop();
          const filePath = `${editingId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
          const { error } = await supabase.storage.from("product-images").upload(filePath, file);
          if (!error) {
            const { data: urlData } = supabase.storage.from("product-images").getPublicUrl(filePath);
            uploadedUrls.push(urlData.publicUrl);
          }
        }
        (payload as any).images = [...existingImages, ...uploadedUrls];
      }
      await supabase.from("products").update(payload).eq("id", editingId);
      toast({ title: "Product updated!" });
    } else {
      const { data: newProduct } = await supabase.from("products").insert(payload).select().single();
      if (newProduct && pendingImages.length > 0) {
        const uploadedUrls: string[] = [];
        for (const file of pendingImages) {
          const fileExt = file.name.split(".").pop();
          const filePath = `${newProduct.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
          const { error } = await supabase.storage.from("product-images").upload(filePath, file);
          if (!error) {
            const { data: urlData } = supabase.storage.from("product-images").getPublicUrl(filePath);
            uploadedUrls.push(urlData.publicUrl);
          }
        }
        if (uploadedUrls.length > 0) {
          await supabase.from("products").update({ images: uploadedUrls }).eq("id", newProduct.id);
        }
      }
      toast({ title: "Product added!" });
    }
    setShowForm(false);
    setEditingId(null);
    setForm({ name: "", brand: "", category: "smartphones", description: "", price: "", original_price: "", stock: "0", badge: "", badge_color: "bg-accent", emi_available: false, is_new_arrival: false, is_bestseller: false });
    setPendingImages([]);
    setPreviewUrls([]);
    fetchProducts();
  };

  const handleEdit = (product: any) => {
    setForm({
      name: product.name, brand: product.brand || "", category: product.category || "smartphones",
      description: product.description || "", price: String(product.price), original_price: String(product.original_price || ""),
      stock: String(product.stock || 0), badge: product.badge || "", badge_color: product.badge_color || "bg-accent",
      emi_available: product.emi_available || false, is_new_arrival: product.is_new_arrival || false, is_bestseller: product.is_bestseller || false,
    });
    setEditingId(product.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    await supabase.from("products").update({ is_active: false }).eq("id", id);
    toast({ title: "Product removed" });
    fetchProducts();
  };

  const handleImageUpload = async (productId: string, file: File) => {
    const fileExt = file.name.split(".").pop();
    const filePath = `${productId}/${Date.now()}.${fileExt}`;
    const { error } = await supabase.storage.from("product-images").upload(filePath, file);
    if (error) {
      toast({ title: "Upload failed", description: error.message, variant: "destructive" });
      return;
    }
    const { data: urlData } = supabase.storage.from("product-images").getPublicUrl(filePath);
    const product = products.find((p) => p.id === productId);
    const images = [...(product?.images || []), urlData.publicUrl];
    await supabase.from("products").update({ images }).eq("id", productId);
    toast({ title: "Image uploaded!" });
    fetchProducts();
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(price);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground">Products ({products.length})</h3>
        <Button size="sm" onClick={() => { setShowForm(!showForm); setEditingId(null); }}>
          <Plus className="h-4 w-4 mr-1" /> Add Product
        </Button>
      </div>

      {showForm && (
        <div className="bg-muted rounded-xl p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Input placeholder="Product Name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <Input placeholder="Brand" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Input placeholder="Price *" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
            <Input placeholder="Original Price" type="number" value={form.original_price} onChange={(e) => setForm({ ...form, original_price: e.target.value })} />
            <Input placeholder="Stock" type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
          </div>
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm">
            <option value="smartphones">Smartphones</option>
            <option value="accessories">Accessories</option>
            <option value="electronics">Electronics</option>
          </select>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-foreground">Description (markdown supported)</label>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={handleGenerateDescription}
                disabled={generatingDesc || !form.name}
                className="h-7 text-xs gap-1"
              >
                {generatingDesc ? (
                  <><Loader2 className="h-3 w-3 animate-spin" /> Writing...</>
                ) : (
                  <><Sparkles className="h-3 w-3 text-accent" /> Generate with AI</>
                )}
              </Button>
            </div>
            <textarea
              placeholder="Description (or click 'Generate with AI' above)"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full min-h-[120px] rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input placeholder="Badge (e.g., Bestseller)" value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })} />
            <select value={form.badge_color} onChange={(e) => setForm({ ...form, badge_color: e.target.value })} className="h-10 rounded-md border border-input bg-background px-3 text-sm">
              <option value="bg-accent">Red</option>
              <option value="bg-green-500">Green</option>
              <option value="bg-blue-500">Blue</option>
              <option value="bg-orange-500">Orange</option>
              <option value="bg-purple-500">Purple</option>
              <option value="bg-mstar-gold">Gold</option>
            </select>
          </div>
          <div className="flex flex-wrap gap-4 text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={form.emi_available} onChange={(e) => setForm({ ...form, emi_available: e.target.checked })} />
              EMI Available
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={form.is_new_arrival} onChange={(e) => setForm({ ...form, is_new_arrival: e.target.checked })} />
              New Arrival
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={form.is_bestseller} onChange={(e) => setForm({ ...form, is_bestseller: e.target.checked })} />
              Bestseller
            </label>
          </div>
          {/* Image Upload */}
          <div>
            <p className="text-sm font-medium text-foreground mb-2">Product Images</p>
            <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-2 bg-background border border-input rounded-md text-sm hover:bg-muted transition-colors">
              <Image className="h-4 w-4" /> Choose Images
              <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => {
                const files = Array.from(e.target.files || []);
                setPendingImages((prev) => [...prev, ...files]);
                setPreviewUrls((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))]);
              }} />
            </label>
            {previewUrls.length > 0 && (
              <div className="flex gap-2 mt-2 flex-wrap">
                {previewUrls.map((url, i) => (
                  <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden">
                    <img src={url} alt="" className="w-full h-full object-cover" />
                    <button
                      onClick={() => {
                        setPendingImages((prev) => prev.filter((_, idx) => idx !== i));
                        setPreviewUrls((prev) => prev.filter((_, idx) => idx !== i));
                      }}
                      className="absolute top-0.5 right-0.5 w-4 h-4 bg-destructive rounded-full flex items-center justify-center text-white text-[10px]"
                    >×</button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSubmit} size="sm">{editingId ? "Update" : "Add"} Product</Button>
            <Button variant="outline" size="sm" onClick={() => { setShowForm(false); setEditingId(null); }}>Cancel</Button>
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-muted-foreground text-sm">Loading...</p>
      ) : products.length === 0 ? (
        <p className="text-muted-foreground text-sm text-center py-8">No products yet. Add your first product!</p>
      ) : (
        <div className="space-y-2">
          {products.map((product) => (
            <div key={product.id} className="flex items-center gap-3 bg-muted rounded-xl p-3">
              <div className="w-14 h-14 rounded-lg bg-background overflow-hidden flex-shrink-0">
                {product.images?.[0] ? (
                  <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <Package className="h-6 w-6" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-foreground text-sm truncate">{product.name}</h4>
                <p className="text-xs text-muted-foreground">
                  {product.brand} · {(product.stock ?? 0) > 0 ? <span className="text-green-600">In Stock</span> : <span className="text-destructive">Out of Stock</span>}
                </p>
                <p className="text-sm font-semibold text-foreground">{formatPrice(product.price)}</p>
              </div>
              <div className="flex items-center gap-1">
                <label className="cursor-pointer p-2 hover:bg-background rounded-lg">
                  <Image className="h-4 w-4 text-muted-foreground" />
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                    if (e.target.files?.[0]) handleImageUpload(product.id, e.target.files[0]);
                  }} />
                </label>
                <button onClick={() => handleEdit(product)} className="p-2 hover:bg-background rounded-lg">
                  <Edit className="h-4 w-4 text-muted-foreground" />
                </button>
                <button onClick={() => handleDelete(product.id)} className="p-2 hover:bg-background rounded-lg">
                  <Trash2 className="h-4 w-4 text-destructive" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ==================== ORDERS MANAGER ====================
const OrdersManager = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchOrders = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("orders")
      .select("*, order_items(*)")
      .order("created_at", { ascending: false });
    setOrders(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchOrders(); }, []);

  const updateStatus = async (orderId: string, status: string) => {
    await supabase.from("orders").update({ status }).eq("id", orderId);
    toast({ title: `Order ${status}` });
    fetchOrders();
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(price);

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-foreground">Orders ({orders.length})</h3>
      {loading ? (
        <p className="text-muted-foreground text-sm">Loading...</p>
      ) : orders.length === 0 ? (
        <p className="text-muted-foreground text-sm text-center py-8">No orders yet.</p>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div key={order.id} className="bg-muted rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground text-sm">{order.delivery_name || "Customer"}</p>
                  <p className="text-xs text-muted-foreground">{order.delivery_phone}</p>
                  <p className="text-xs text-muted-foreground">{order.delivery_address}, {order.delivery_city}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-foreground">{formatPrice(order.total_amount)}</p>
                  <p className="text-xs text-muted-foreground capitalize">{order.payment_method} · {order.payment_status}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {order.order_items?.map((item: any) => (
                  <span key={item.id} className="text-xs bg-background px-2 py-1 rounded">
                    {item.product_name} x{item.quantity}
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <select
                  value={order.status}
                  onChange={(e) => updateStatus(order.id, e.target.value)}
                  className="h-8 text-xs rounded border border-input bg-background px-2"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ==================== REELS MANAGER ====================
const ReelsManager = () => {
  const [reels, setReels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<string>("");
  const { toast } = useToast();
  const [caption, setCaption] = useState("");
  const [pendingVideo, setPendingVideo] = useState<File | null>(null);
  const [pendingThumb, setPendingThumb] = useState<File | null>(null);
  const [thumbPreview, setThumbPreview] = useState<string>("");

  const fetchReels = async () => {
    setLoading(true);
    const { data } = await supabase.from("reels").select("*").order("created_at", { ascending: false });
    setReels(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchReels(); }, []);

  const handleUpload = async () => {
    if (!pendingVideo) {
      toast({ title: "Please select a video", variant: "destructive" });
      return;
    }
    const FIVE_GB = 5 * 1024 * 1024 * 1024;
    if (pendingVideo.size > FIVE_GB) {
      toast({ title: "Video too large", description: "Reels must be smaller than 5 GB.", variant: "destructive" });
      return;
    }
    setUploading(true);
    setProgress("Uploading video...");
    try {
      const safeName = pendingVideo.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
      const videoPath = `${Date.now()}-${safeName}`;
      const { error: vErr } = await supabase.storage
        .from("reel-videos")
        .upload(videoPath, pendingVideo, { contentType: pendingVideo.type, upsert: false });
      if (vErr) throw vErr;
      const { data: vUrl } = supabase.storage.from("reel-videos").getPublicUrl(videoPath);

      let thumbnail_url: string | null = null;
      if (pendingThumb) {
        setProgress("Uploading thumbnail...");
        const safeThumb = pendingThumb.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
        const thumbPath = `thumb-${Date.now()}-${safeThumb}`;
        const { error: tErr } = await supabase.storage
          .from("reel-videos")
          .upload(thumbPath, pendingThumb, { contentType: pendingThumb.type });
        if (!tErr) {
          const { data: tUrl } = supabase.storage.from("reel-videos").getPublicUrl(thumbPath);
          thumbnail_url = tUrl.publicUrl;
        }
      }

      setProgress("Saving reel...");
      const { error: insertErr } = await supabase.from("reels").insert({
        video_url: vUrl.publicUrl,
        thumbnail_url,
        caption: caption || null,
      });
      if (insertErr) throw insertErr;

      toast({ title: "Reel uploaded!" });
      setCaption("");
      setPendingVideo(null);
      setPendingThumb(null);
      setThumbPreview("");
      fetchReels();
    } catch (e: any) {
      const msg = e?.message || String(e);
      const friendly = /Failed to fetch|network|NetworkError/i.test(msg)
        ? "Network issue while uploading. Check your connection and try again."
        : /row-level security/i.test(msg)
        ? "Permission denied. Please log out and back in."
        : msg;
      toast({ title: "Upload failed", description: friendly, variant: "destructive" });
    } finally {
      setUploading(false);
      setProgress("");
    }
  };

  const deleteReel = async (id: string) => {
    await supabase.from("reels").update({ is_active: false }).eq("id", id);
    toast({ title: "Reel removed" });
    fetchReels();
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-foreground">Reels ({reels.length})</h3>
      <div className="bg-muted rounded-xl p-4 space-y-3">
        <Input placeholder="Reel caption..." value={caption} onChange={(e) => setCaption(e.target.value)} />
        <div className="grid grid-cols-2 gap-3">
          {/* Video picker */}
          <label className="cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg p-4 hover:bg-background/50 transition-colors min-h-[100px]">
            <Film className="h-6 w-6 text-muted-foreground mb-1" />
            <span className="text-xs font-medium text-foreground">{pendingVideo ? pendingVideo.name.slice(0, 20) : "Choose Video *"}</span>
            <input type="file" accept="video/*" className="hidden" onChange={(e) => {
              if (e.target.files?.[0]) setPendingVideo(e.target.files[0]);
            }} />
          </label>
          {/* Thumbnail picker */}
          <label className="cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg p-4 hover:bg-background/50 transition-colors min-h-[100px] overflow-hidden relative">
            {thumbPreview ? (
              <img src={thumbPreview} alt="thumb" className="absolute inset-0 w-full h-full object-cover" />
            ) : (
              <>
                <ImageIcon className="h-6 w-6 text-muted-foreground mb-1" />
                <span className="text-xs font-medium text-foreground">Choose Thumbnail</span>
                <span className="text-[10px] text-muted-foreground">(YouTube-style)</span>
              </>
            )}
            <input type="file" accept="image/*" className="hidden" onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) {
                setPendingThumb(f);
                setThumbPreview(URL.createObjectURL(f));
              }
            }} />
          </label>
        </div>
        <Button size="sm" onClick={handleUpload} disabled={uploading || !pendingVideo} className="w-full">
          {uploading ? <><Loader2 className="h-4 w-4 mr-1 animate-spin" /> {progress || "Uploading..."}</> : <><Plus className="h-4 w-4 mr-1" /> Publish Reel</>}
        </Button>
      </div>
      {reels.map((reel) => (
        <div key={reel.id} className="flex items-center gap-3 bg-muted rounded-xl p-3">
          {reel.thumbnail_url ? (
            <img src={reel.thumbnail_url} alt="" className="w-14 h-14 rounded-lg object-cover flex-shrink-0" />
          ) : (
            <div className="w-14 h-14 rounded-lg bg-background flex items-center justify-center flex-shrink-0">
              <Film className="h-6 w-6 text-muted-foreground" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm text-foreground truncate">{reel.caption || "No caption"}</p>
            <p className="text-xs text-muted-foreground">❤️ {reel.likes_count} · 💬 {reel.comments_count}</p>
          </div>
          <button onClick={() => deleteReel(reel.id)} className="p-2 hover:bg-background rounded-lg">
            <Trash2 className="h-4 w-4 text-destructive" />
          </button>
        </div>
      ))}
    </div>
  );
};

// ==================== POSTS MANAGER ====================
const PostsManager = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchPosts = async () => {
    setLoading(true);
    const { data } = await supabase.from("posts").select("*").order("created_at", { ascending: false });
    setPosts(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchPosts(); }, []);

  const [caption, setCaption] = useState("");

  const handleUpload = async (file: File) => {
    const filePath = `${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from("post-images").upload(filePath, file);
    if (error) {
      toast({ title: "Upload failed", variant: "destructive" });
      return;
    }
    const { data: urlData } = supabase.storage.from("post-images").getPublicUrl(filePath);
    await supabase.from("posts").insert({ images: [urlData.publicUrl], caption });
    toast({ title: "Post created!" });
    setCaption("");
    fetchPosts();
  };

  const deletePost = async (id: string) => {
    await supabase.from("posts").update({ is_active: false }).eq("id", id);
    toast({ title: "Post removed" });
    fetchPosts();
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-foreground">Posts ({posts.length})</h3>
      <div className="bg-muted rounded-xl p-4 space-y-3">
        <Input placeholder="Post caption..." value={caption} onChange={(e) => setCaption(e.target.value)} />
        <label className="cursor-pointer">
          <Button size="sm" variant="outline" asChild>
            <span><Image className="h-4 w-4 mr-1" /> Upload Image</span>
          </Button>
          <input type="file" accept="image/*" className="hidden" onChange={(e) => {
            if (e.target.files?.[0]) handleUpload(e.target.files[0]);
          }} />
        </label>
      </div>
      {posts.map((post) => (
        <div key={post.id} className="flex items-center gap-3 bg-muted rounded-xl p-3">
          {post.images?.[0] ? (
            <img src={post.images[0]} alt="" className="w-14 h-14 rounded-lg object-cover flex-shrink-0" />
          ) : (
            <div className="w-14 h-14 rounded-lg bg-background flex items-center justify-center">
              <Image className="h-6 w-6 text-muted-foreground" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm text-foreground truncate">{post.caption || "No caption"}</p>
            <p className="text-xs text-muted-foreground">❤️ {post.likes_count} · 💬 {post.comments_count}</p>
          </div>
          <button onClick={() => deletePost(post.id)} className="p-2 hover:bg-background rounded-lg">
            <Trash2 className="h-4 w-4 text-destructive" />
          </button>
        </div>
      ))}
    </div>
  );
};

// ==================== OFFERS MANAGER ====================
const OffersManager = () => {
  const [offers, setOffers] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();
  const [form, setForm] = useState({ title: "", description: "", discount_percent: "", image_url: "" });

  const fetchOffers = async () => {
    const { data } = await supabase.from("offers").select("*").order("created_at", { ascending: false });
    setOffers(data || []);
  };

  useEffect(() => { fetchOffers(); }, []);

  const handleSubmit = async () => {
    await supabase.from("offers").insert({
      title: form.title,
      description: form.description,
      discount_percent: Number(form.discount_percent) || null,
    });
    toast({ title: "Offer created!" });
    setShowForm(false);
    setForm({ title: "", description: "", discount_percent: "", image_url: "" });
    fetchOffers();
  };

  const deleteOffer = async (id: string) => {
    await supabase.from("offers").update({ is_active: false }).eq("id", id);
    toast({ title: "Offer removed" });
    fetchOffers();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground">Offers ({offers.length})</h3>
        <Button size="sm" onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-1" /> Add Offer
        </Button>
      </div>
      {showForm && (
        <div className="bg-muted rounded-xl p-4 space-y-3">
          <Input placeholder="Offer Title *" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <Input placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <Input placeholder="Discount %" type="number" value={form.discount_percent} onChange={(e) => setForm({ ...form, discount_percent: e.target.value })} />
          <div className="flex gap-2">
            <Button size="sm" onClick={handleSubmit}>Create Offer</Button>
            <Button size="sm" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </div>
      )}
      {offers.map((offer) => (
        <div key={offer.id} className="flex items-center gap-3 bg-muted rounded-xl p-3">
          <Gift className="h-8 w-8 text-accent flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground">{offer.title}</p>
            <p className="text-xs text-muted-foreground">{offer.description}</p>
            {offer.discount_percent && <p className="text-xs text-accent font-medium">{offer.discount_percent}% OFF</p>}
          </div>
          <button onClick={() => deleteOffer(offer.id)} className="p-2 hover:bg-background rounded-lg">
            <Trash2 className="h-4 w-4 text-destructive" />
          </button>
        </div>
      ))}
    </div>
  );
};

// ==================== NOTIFICATIONS MANAGER ====================
const NotificationsManager = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();
  const [form, setForm] = useState({ title: "", message: "", type: "general" });

  const fetchNotifications = async () => {
    const { data } = await supabase.from("notifications").select("*").order("created_at", { ascending: false });
    setNotifications(data || []);
  };

  useEffect(() => { fetchNotifications(); }, []);

  const handleSubmit = async () => {
    if (!form.title || !form.message) {
      toast({ title: "Fill all fields", variant: "destructive" });
      return;
    }
    await supabase.from("notifications").insert({ title: form.title, message: form.message, type: form.type });
    toast({ title: "Notification sent to all users!" });
    setShowForm(false);
    setForm({ title: "", message: "", type: "general" });
    fetchNotifications();
  };

  const deleteNotification = async (id: string) => {
    await supabase.from("notifications").update({ is_active: false }).eq("id", id);
    toast({ title: "Notification removed" });
    fetchNotifications();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-foreground">Push Notifications ({notifications.length})</h3>
          <p className="text-xs text-muted-foreground">Send alerts to all customers</p>
        </div>
        <Button size="sm" onClick={() => setShowForm(!showForm)}>
          <Send className="h-4 w-4 mr-1" /> Send Alert
        </Button>
      </div>
      {showForm && (
        <div className="bg-muted rounded-xl p-4 space-y-3">
          <Input placeholder="Notification Title *" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <textarea
            placeholder="Notification message *"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
          <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm">
            <option value="general">General</option>
            <option value="offer">Offer</option>
            <option value="product">Product Update</option>
            <option value="alert">Urgent Alert</option>
          </select>
          <div className="flex gap-2">
            <Button size="sm" onClick={handleSubmit}><Send className="h-4 w-4 mr-1" /> Send to All</Button>
            <Button size="sm" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </div>
      )}
      {notifications.map((n) => (
        <div key={n.id} className="flex items-center gap-3 bg-muted rounded-xl p-3">
          <Bell className="h-8 w-8 text-accent flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground">{n.title}</p>
            <p className="text-xs text-muted-foreground truncate">{n.message}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">{n.type} · {new Date(n.created_at).toLocaleDateString()}</p>
          </div>
          <button onClick={() => deleteNotification(n.id)} className="p-2 hover:bg-background rounded-lg">
            <Trash2 className="h-4 w-4 text-destructive" />
          </button>
        </div>
      ))}
    </div>
  );
};

// ==================== ORDER ALERTS MANAGER ====================
const OrderAlertsManager = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [code, setCode] = useState("");
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    // Check if alerts are enabled
    const checkAlerts = async () => {
      if (!user) return;
      const { data } = await supabase.from("order_alerts").select("*").eq("user_id", user.id).maybeSingle();
      if (data) setIsEnabled(data.is_enabled);
    };
    checkAlerts();

    // Fetch recent orders
    const fetchOrders = async () => {
      const { data } = await supabase.from("orders").select("*, order_items(*)").order("created_at", { ascending: false }).limit(10);
      setRecentOrders(data || []);
    };
    fetchOrders();

    // Realtime order subscription
    const channel = supabase
      .channel("admin-orders")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "orders" }, (payload) => {
        setRecentOrders((prev) => [payload.new as any, ...prev]);
        if (isEnabled) {
          // Play unique notification sound
          try {
            const ctx = new AudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.frequency.setValueAtTime(880, ctx.currentTime);
            osc.frequency.setValueAtTime(1100, ctx.currentTime + 0.1);
            osc.frequency.setValueAtTime(880, ctx.currentTime + 0.2);
            osc.frequency.setValueAtTime(1320, ctx.currentTime + 0.3);
            gain.gain.setValueAtTime(0.3, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 0.5);
          } catch {}
          toast({ title: "🔔 New Order!", description: `Order received - ₹${(payload.new as any).total_amount}` });
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user, isEnabled]);

  const handleActivate = async () => {
    if (code !== "4594") {
      toast({ title: "Invalid Code", description: "Please enter the correct activation code.", variant: "destructive" });
      return;
    }
    if (!user) return;
    const { data: existing } = await supabase.from("order_alerts").select("id").eq("user_id", user.id).maybeSingle();
    if (existing) {
      await supabase.from("order_alerts").update({ is_enabled: true }).eq("id", existing.id);
    } else {
      await supabase.from("order_alerts").insert({ user_id: user.id, is_enabled: true });
    }
    setIsEnabled(true);
    setShowCodeInput(false);
    setCode("");
    toast({ title: "Order Alerts Activated! 🔔", description: "You'll now receive sound notifications for new orders." });
  };

  const handleDeactivate = async () => {
    if (!user) return;
    await supabase.from("order_alerts").update({ is_enabled: false }).eq("user_id", user.id);
    setIsEnabled(false);
    toast({ title: "Order Alerts Deactivated" });
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(price);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-foreground">Order Alerts</h3>
          <p className="text-xs text-muted-foreground">Get notified when customers place orders</p>
        </div>
        {isEnabled ? (
          <Button size="sm" variant="outline" onClick={handleDeactivate}>
            <VolumeX className="h-4 w-4 mr-1" /> Disable
          </Button>
        ) : (
          <Button size="sm" onClick={() => setShowCodeInput(true)}>
            <Volume2 className="h-4 w-4 mr-1" /> Enable Alerts
          </Button>
        )}
      </div>

      {/* Status */}
      <div className={`rounded-xl p-4 flex items-center gap-3 ${isEnabled ? "bg-green-500/10 border border-green-500/20" : "bg-muted"}`}>
        {isEnabled ? <Volume2 className="h-6 w-6 text-green-500" /> : <VolumeX className="h-6 w-6 text-muted-foreground" />}
        <div>
          <p className="font-medium text-foreground text-sm">{isEnabled ? "Alerts Active" : "Alerts Inactive"}</p>
          <p className="text-xs text-muted-foreground">{isEnabled ? "You'll hear a sound for every new order" : "Enable to get order notifications"}</p>
        </div>
      </div>

      {/* Code Input */}
      {showCodeInput && !isEnabled && (
        <div className="bg-muted rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-2 text-yellow-500 mb-2">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-sm font-medium">Enter Activation Code</span>
          </div>
          <Input type="password" placeholder="Enter 4-digit code" value={code} onChange={(e) => setCode(e.target.value)} maxLength={4} />
          <div className="flex gap-2">
            <Button size="sm" onClick={handleActivate}>Activate</Button>
            <Button size="sm" variant="outline" onClick={() => { setShowCodeInput(false); setCode(""); }}>Cancel</Button>
          </div>
        </div>
      )}

      {/* Recent Orders */}
      <div>
        <h4 className="font-medium text-foreground text-sm mb-2">Recent Orders ({recentOrders.length})</h4>
        {recentOrders.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-4">No orders yet.</p>
        ) : (
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center gap-3 bg-muted rounded-xl p-3">
                <ShoppingBag className="h-5 w-5 text-accent flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{order.delivery_name || "Customer"}</p>
                  <p className="text-xs text-muted-foreground capitalize">{order.status} · {order.payment_method}</p>
                </div>
                <p className="text-sm font-bold text-foreground">{formatPrice(order.total_amount)}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ==================== ANALYTICS DASHBOARD ====================
const AnalyticsDashboard = () => {
  const [stats, setStats] = useState({ products: 0, orders: 0, totalRevenue: 0, reels: 0, posts: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      const [productsRes, ordersRes, reelsRes, postsRes] = await Promise.all([
        supabase.from("products").select("id", { count: "exact", head: true }).eq("is_active", true),
        supabase.from("orders").select("total_amount"),
        supabase.from("reels").select("id", { count: "exact", head: true }).eq("is_active", true),
        supabase.from("posts").select("id", { count: "exact", head: true }).eq("is_active", true),
      ]);
      const totalRevenue = (ordersRes.data || []).reduce((sum: number, o: any) => sum + (o.total_amount || 0), 0);
      setStats({
        products: productsRes.count || 0,
        orders: ordersRes.data?.length || 0,
        totalRevenue,
        reels: reelsRes.count || 0,
        posts: postsRes.count || 0,
      });
    };
    fetchStats();
  }, []);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(price);

  const statCards = [
    { label: "Total Products", value: stats.products, icon: Package, color: "text-blue-500 bg-blue-500/10" },
    { label: "Total Orders", value: stats.orders, icon: ShoppingBag, color: "text-green-500 bg-green-500/10" },
    { label: "Revenue", value: formatPrice(stats.totalRevenue), icon: TrendingUp, color: "text-accent bg-accent/10" },
    { label: "Active Reels", value: stats.reels, icon: Film, color: "text-pink-500 bg-pink-500/10" },
    { label: "Active Posts", value: stats.posts, icon: Image, color: "text-purple-500 bg-purple-500/10" },
    { label: "Views Today", value: "—", icon: Eye, color: "text-yellow-500 bg-yellow-500/10" },
  ];

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-foreground">Shop Analytics</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {statCards.map((stat, i) => (
          <div key={i} className="bg-muted rounded-xl p-4">
            <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center mb-3`}>
              <stat.icon className="h-5 w-5" />
            </div>
            <p className="text-xl md:text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPanel;

// ==================== PANORAMA MANAGER ====================
const PanoramaManager = () => {
  const [panoramas, setPanoramas] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState("Shop View");
  const { toast } = useToast();

  const fetchPanoramas = async () => {
    const { data } = await supabase.from("panoramas").select("*").order("created_at", { ascending: false });
    setPanoramas(data || []);
  };

  useEffect(() => { fetchPanoramas(); }, []);

  const handleUpload = async (file: File) => {
    setUploading(true);
    const filePath = `${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from("panorama-images").upload(filePath, file);
    if (error) {
      toast({ title: "Upload failed", description: error.message, variant: "destructive" });
      setUploading(false);
      return;
    }
    const { data: urlData } = supabase.storage.from("panorama-images").getPublicUrl(filePath);
    await supabase.from("panoramas").insert({ title, image_url: urlData.publicUrl });
    toast({ title: "360° view uploaded!" });
    setTitle("Shop View");
    setUploading(false);
    fetchPanoramas();
  };

  const deletePanorama = async (id: string) => {
    await supabase.from("panoramas").update({ is_active: false }).eq("id", id);
    toast({ title: "Panorama removed" });
    fetchPanoramas();
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-foreground">360° Shop Tour</h3>
      <p className="text-xs text-muted-foreground">Upload panoramic images for virtual shop tours. Use a 360° camera app or wide panorama photos.</p>
      <div className="bg-muted rounded-xl p-4 space-y-3">
        <Input placeholder="View title (e.g., Entrance, Display Area)" value={title} onChange={(e) => setTitle(e.target.value)} />
        <label className="cursor-pointer">
          <Button size="sm" variant="outline" asChild disabled={uploading}>
            <span><Camera className="h-4 w-4 mr-1" /> {uploading ? "Uploading..." : "Upload Panorama Image"}</span>
          </Button>
          <input type="file" accept="image/*" className="hidden" onChange={(e) => {
            if (e.target.files?.[0]) handleUpload(e.target.files[0]);
          }} />
        </label>
      </div>
      {panoramas.map((p) => (
        <div key={p.id} className="flex items-center gap-3 bg-muted rounded-xl p-3">
          <img src={p.image_url} alt="" className="w-20 h-12 rounded-lg object-cover flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground">{p.title}</p>
            <p className="text-xs text-muted-foreground">{new Date(p.created_at).toLocaleDateString()}</p>
          </div>
          <button onClick={() => deletePanorama(p.id)} className="p-2 hover:bg-background rounded-lg">
            <Trash2 className="h-4 w-4 text-destructive" />
          </button>
        </div>
      ))}
    </div>
  );
};