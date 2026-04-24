import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ShoppingCart, Heart, Send, Loader2, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from "react-markdown";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(price);

const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      const { data } = await supabase.from("products").select("*").eq("id", id).single();
      setProduct(data);
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  const fetchComments = async () => {
    if (!id) return;
    const { data } = await supabase
      .from("product_comments")
      .select("*")
      .eq("product_id", id)
      .order("created_at", { ascending: false });
    setComments(data || []);
  };

  useEffect(() => { fetchComments(); }, [id]);

  const handleAddComment = async () => {
    if (!newComment.trim() || !user || !id) return;
    setSubmitting(true);
    const { data, error } = await supabase.from("product_comments").insert({
      product_id: id,
      user_id: user.id,
      content: newComment.trim(),
    }).select().single();

    if (!error && data) {
      setNewComment("");
      fetchComments();
      // Trigger AI reply
      supabase.functions.invoke("comment-ai-reply", {
        body: { comment_id: data.id, comment_text: data.content, product_name: product?.name },
      }).then(() => {
        setTimeout(fetchComments, 2000);
      });
    }
    setSubmitting(false);
  };

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({
      id: product.id,
      name: product.name,
      brand: product.brand || "",
      price: product.price,
      originalPrice: product.original_price || product.price,
      image: product.images?.[0] || "/placeholder.svg",
    });
    toast({ title: "Added to Cart!", description: `${product.name} has been added.` });
  };

  const images = product?.images?.length ? product.images : ["/placeholder.svg"];

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Product not found.</p>
        <Link to="/dashboard/store"><Button variant="outline" className="mt-4">Back to Store</Button></Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Back */}
      <Link to="/dashboard/store" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Store
      </Link>

      {/* Product Detail */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
        {/* Images */}
        <div className="space-y-3">
          <div className="relative aspect-square bg-card rounded-2xl overflow-hidden">
            <img src={images[activeImage]} alt={product.name} className="w-full h-full object-cover" />
            {images.length > 1 && (
              <>
                <button
                  onClick={() => setActiveImage((prev) => (prev - 1 + images.length) % images.length)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setActiveImage((prev) => (prev + 1) % images.length)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </>
            )}
            {product.badge && (
              <Badge className={`absolute top-3 left-3 ${product.badge_color || "bg-accent"} text-white`}>{product.badge}</Badge>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {images.map((img: string, i: number) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors ${
                    activeImage === i ? "border-accent" : "border-transparent"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="space-y-4">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">{product.brand}</p>
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground mt-1">{product.name}</h1>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-2xl md:text-3xl font-bold text-foreground">{formatPrice(product.price)}</span>
            {product.original_price && product.original_price > product.price && (
              <>
                <span className="text-lg text-muted-foreground line-through">{formatPrice(product.original_price)}</span>
                <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                  {Math.round(((product.original_price - product.price) / product.original_price) * 100)}% OFF
                </Badge>
              </>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {product.stock > 0 ? (
              <Badge variant="outline" className="text-green-600 border-green-600/30">In Stock</Badge>
            ) : (
              <Badge variant="destructive">Out of Stock</Badge>
            )}
            {product.emi_available && <Badge variant="outline">EMI Available</Badge>}
            {product.is_new_arrival && <Badge className="bg-blue-500 text-white">New Arrival</Badge>}
            {product.is_bestseller && <Badge className="bg-orange-500 text-white">Bestseller</Badge>}
          </div>

          {product.description && (
            <div className="bg-card rounded-xl p-4">
              <h3 className="font-semibold text-foreground text-sm mb-2">Description</h3>
              <div className="prose prose-sm max-w-none text-muted-foreground">
                <ReactMarkdown>{product.description}</ReactMarkdown>
              </div>
            </div>
          )}

          <Button
            className="w-full h-12 text-base"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
          >
            <ShoppingCart className="h-5 w-5 mr-2" />
            {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
          </Button>
        </div>
      </div>

      {/* Comments / Reviews */}
      <div className="bg-card rounded-2xl p-4 md:p-6 space-y-4">
        <h2 className="font-bold text-foreground text-lg">Customer Reviews ({comments.length})</h2>

        {user && (
          <div className="flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a review..."
              className="flex-1 h-10 bg-muted rounded-full px-4 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
              onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
            />
            <Button onClick={handleAddComment} disabled={!newComment.trim() || submitting} size="icon" className="rounded-full w-10 h-10">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        )}

        {comments.length === 0 ? (
          <p className="text-muted-foreground text-sm text-center py-6">No reviews yet. Be the first to review!</p>
        ) : (
          <div className="space-y-3">
            {comments.map((comment) => (
              <div key={comment.id} className="space-y-2">
                <div className="bg-muted rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center">
                      <span className="text-xs font-bold text-accent">U</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(comment.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-foreground">{comment.content}</p>
                </div>
                {comment.ai_reply && (
                  <div className="ml-6 bg-accent/5 border border-accent/10 rounded-xl p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center">
                        <Star className="h-3 w-3 text-white" />
                      </div>
                      <span className="text-xs font-medium text-accent">MStar Mobile</span>
                    </div>
                    <p className="text-sm text-foreground">{comment.ai_reply}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductPage;