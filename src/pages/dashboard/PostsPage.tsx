import { useState, useEffect } from "react";
import { Image as ImageIcon, Heart, MessageCircle, Share2, Loader2, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const PostsPage = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [openComments, setOpenComments] = useState<string | null>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchAll = async () => {
    const { data } = await supabase
      .from("posts")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });
    setPosts(data || []);
    setLoading(false);
    if (user) {
      const { data: likes } = await supabase
        .from("post_likes")
        .select("post_id")
        .eq("user_id", user.id);
      setLikedPosts(new Set((likes || []).map((l: any) => l.post_id)));
    }
  };

  useEffect(() => { fetchAll(); }, [user]);

  const fetchComments = async (postId: string) => {
    const { data } = await supabase
      .from("post_comments")
      .select("*")
      .eq("post_id", postId)
      .order("created_at", { ascending: false });
    setComments(data || []);
  };

  const handleLike = async (postId: string) => {
    if (!user) {
      toast({ title: "Please sign in to like", variant: "destructive" });
      return;
    }
    const isLiked = likedPosts.has(postId);
    if (isLiked) {
      await supabase.from("post_likes").delete().eq("post_id", postId).eq("user_id", user.id);
      setLikedPosts((prev) => {
        const next = new Set(prev);
        next.delete(postId);
        return next;
      });
      setPosts((prev) => prev.map((p) => p.id === postId ? { ...p, likes_count: Math.max(0, (p.likes_count || 0) - 1) } : p));
    } else {
      await supabase.from("post_likes").insert({ post_id: postId, user_id: user.id });
      setLikedPosts((prev) => new Set(prev).add(postId));
      setPosts((prev) => prev.map((p) => p.id === postId ? { ...p, likes_count: (p.likes_count || 0) + 1 } : p));
    }
  };

  const openCommentSheet = (postId: string) => {
    setOpenComments(postId);
    fetchComments(postId);
  };

  const addComment = async () => {
    if (!user) { toast({ title: "Please sign in to comment", variant: "destructive" }); return; }
    if (!newComment.trim() || !openComments) return;
    await supabase.from("post_comments").insert({ post_id: openComments, user_id: user.id, content: newComment.trim() });
    setNewComment("");
    fetchComments(openComments);
  };

  const handleShare = async (postId: string, caption: string) => {
    const url = `https://mstar-mobile.vercel.app/dashboard/posts#${postId}`;
    const shareData = { title: "MStar Mobile", text: caption || "Check this out from MStar Mobile!", url };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(url);
        toast({ title: "Link copied!", description: "Share it with your friends." });
      }
    } catch {}
  };

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-foreground">Posts & Updates</h1>
        <p className="text-muted-foreground">Latest news and announcements from MStar Mobile</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </div>
      ) : posts.length === 0 ? (
        <div className="bg-card rounded-2xl p-8 md:p-12 text-center">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <ImageIcon className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No Posts Yet</h3>
          <p className="text-muted-foreground">Stay tuned for updates from MStar Mobile!</p>
        </div>
      ) : (
        <div className="space-y-6 max-w-2xl mx-auto">
          {posts.map((post) => (
            <article id={post.id} key={post.id} className="bg-card rounded-2xl shadow-elegant overflow-hidden">
              {/* Header */}
              <div className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                  <span className="text-accent-foreground font-bold text-sm">M</span>
                </div>
                <div>
                  <p className="font-semibold text-foreground">MStar Mobile</p>
                  <p className="text-xs text-muted-foreground">{timeAgo(post.created_at)}</p>
                </div>
              </div>

              {/* Image - fit fully (object-contain on dark backdrop) */}
              {post.images?.[0] && (
                <div className="bg-mstar-dark flex items-center justify-center max-h-[80vh]">
                  <img
                    src={post.images[0]}
                    alt={post.caption || "Post image"}
                    className="w-full h-auto max-h-[80vh] object-contain"
                    loading="lazy"
                  />
                </div>
              )}

              {/* Actions */}
              <div className="p-4 border-b border-border">
                <div className="flex items-center gap-4">
                  <button onClick={() => handleLike(post.id)} className="transition-colors">
                    <Heart className={`h-6 w-6 ${likedPosts.has(post.id) ? "fill-red-500 text-red-500" : "text-muted-foreground hover:text-accent"}`} />
                  </button>
                  <button onClick={() => openCommentSheet(post.id)} className="text-muted-foreground hover:text-foreground">
                    <MessageCircle className="h-6 w-6" />
                  </button>
                  <button onClick={() => handleShare(post.id, post.caption || "")} className="text-muted-foreground hover:text-foreground">
                    <Share2 className="h-6 w-6" />
                  </button>
                </div>
                <p className="mt-2 text-sm font-medium text-foreground">
                  {(post.likes_count || 0).toLocaleString()} likes • {post.comments_count || 0} comments
                </p>
              </div>

              {post.caption && (
                <div className="p-4">
                  <p className="text-foreground whitespace-pre-wrap">{post.caption}</p>
                </div>
              )}
            </article>
          ))}
        </div>
      )}

      {/* Comments sheet */}
      {openComments && (
        <div className="fixed inset-0 z-[100] bg-black/70 flex items-end md:items-center justify-center p-2 md:p-4" onClick={() => setOpenComments(null)}>
          <div className="bg-card w-full max-w-md max-h-[80vh] rounded-2xl flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="font-semibold text-foreground">Comments ({comments.length})</h3>
              <button onClick={() => setOpenComments(null)} className="p-1 hover:bg-muted rounded">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {comments.length === 0 ? (
                <p className="text-muted-foreground text-sm text-center py-8">Be the first to comment!</p>
              ) : comments.map((c) => (
                <div key={c.id} className="flex gap-2">
                  <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-accent">U</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-foreground">{c.content}</p>
                    <p className="text-[10px] text-muted-foreground">{new Date(c.created_at).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
            {user && (
              <div className="p-3 border-t border-border flex gap-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-1 h-9 bg-muted rounded-full px-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
                  onKeyDown={(e) => e.key === "Enter" && addComment()}
                />
                <Button size="icon" className="rounded-full w-9 h-9" onClick={addComment} disabled={!newComment.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PostsPage;
