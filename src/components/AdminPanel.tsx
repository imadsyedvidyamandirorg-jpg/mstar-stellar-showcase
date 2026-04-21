import { useState, useEffect } from "react";
import { X, Package, Plus, Trash2, Edit, ShoppingBag, Image, Film, Gift, FileText, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type Tab = "products" | "orders" | "reels" | "posts" | "offers";

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
  ];

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-card w-full max-w-5xl max-h-[90vh] rounded-2xl shadow-deep overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center">
              <Users className="h-5 w-5 text-accent-foreground" />
            </div>
            <div>
              <h2 className="font-bold text-foreground">Admin Panel</h2>
              <p className="text-xs text-muted-foreground">Manage your shop</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
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
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === "products" && <ProductsManager />}
          {activeTab === "orders" && <OrdersManager />}
          {activeTab === "reels" && <ReelsManager />}
          {activeTab === "posts" && <PostsManager />}
          {activeTab === "offers" && <OffersManager />}
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
  const { toast } = useToast();
  const [form, setForm] = useState({
    name: "", brand: "", category: "smartphones", description: "",
    price: "", original_price: "", stock: "0", badge: "",
    badge_color: "bg-accent", emi_available: false,
    is_new_arrival: false, is_bestseller: false,
  });

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
      await supabase.from("products").update(payload).eq("id", editingId);
      toast({ title: "Product updated!" });
    } else {
      await supabase.from("products").insert(payload);
      toast({ title: "Product added!" });
    }
    setShowForm(false);
    setEditingId(null);
    setForm({ name: "", brand: "", category: "smartphones", description: "", price: "", original_price: "", stock: "0", badge: "", badge_color: "bg-accent", emi_available: false, is_new_arrival: false, is_bestseller: false });
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
          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
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
                <p className="text-xs text-muted-foreground">{product.brand} · Stock: {product.stock}</p>
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
  const { toast } = useToast();

  const fetchReels = async () => {
    setLoading(true);
    const { data } = await supabase.from("reels").select("*").order("created_at", { ascending: false });
    setReels(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchReels(); }, []);

  const handleUpload = async (file: File, caption: string) => {
    setUploading(true);
    const filePath = `${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from("reel-videos").upload(filePath, file);
    if (error) {
      toast({ title: "Upload failed", description: error.message, variant: "destructive" });
      setUploading(false);
      return;
    }
    const { data: urlData } = supabase.storage.from("reel-videos").getPublicUrl(filePath);
    await supabase.from("reels").insert({ video_url: urlData.publicUrl, caption });
    toast({ title: "Reel uploaded!" });
    setUploading(false);
    fetchReels();
  };

  const deleteReel = async (id: string) => {
    await supabase.from("reels").update({ is_active: false }).eq("id", id);
    toast({ title: "Reel removed" });
    fetchReels();
  };

  const [caption, setCaption] = useState("");

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-foreground">Reels ({reels.length})</h3>
      <div className="bg-muted rounded-xl p-4 space-y-3">
        <Input placeholder="Reel caption..." value={caption} onChange={(e) => setCaption(e.target.value)} />
        <div className="flex gap-2">
          <label className="cursor-pointer">
            <Button size="sm" variant="outline" asChild disabled={uploading}>
              <span><Film className="h-4 w-4 mr-1" /> {uploading ? "Uploading..." : "Upload Video"}</span>
            </Button>
            <input type="file" accept="video/*" className="hidden" onChange={(e) => {
              if (e.target.files?.[0]) handleUpload(e.target.files[0], caption);
            }} />
          </label>
        </div>
      </div>
      {reels.map((reel) => (
        <div key={reel.id} className="flex items-center gap-3 bg-muted rounded-xl p-3">
          <Film className="h-8 w-8 text-muted-foreground flex-shrink-0" />
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

export default AdminPanel;