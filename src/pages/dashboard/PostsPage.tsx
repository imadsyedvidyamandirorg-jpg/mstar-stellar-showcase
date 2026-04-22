import { useState, useEffect } from "react";
import { Image, Heart, MessageCircle, Share2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const PostsPage = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchPosts = async () => {
      const { data } = await supabase
        .from("posts")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });
      setPosts(data || []);
      setLoading(false);
    };
    fetchPosts();
  }, []);

  const handleLike = async (postId: string) => {
    if (!user) return;
    const { data: existing } = await supabase
      .from("post_likes")
      .select("id")
      .eq("post_id", postId)
      .eq("user_id", user.id)
      .maybeSingle();
    if (existing) {
      await supabase.from("post_likes").delete().eq("id", existing.id);
    } else {
      await supabase.from("post_likes").insert({ post_id: postId, user_id: user.id });
    }
    // Refresh
    const { data } = await supabase.from("posts").select("*").eq("is_active", true).order("created_at", { ascending: false });
    setPosts(data || []);
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
      {/* Header */}
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
            <Image className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No Posts Yet</h3>
          <p className="text-muted-foreground">Stay tuned for updates from MStar Mobile!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
          <article
            key={post.id}
            className="bg-card rounded-2xl shadow-elegant overflow-hidden"
          >
            {/* Post Header */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                  <span className="text-accent-foreground font-bold text-sm">M</span>
                </div>
                <div>
                  <p className="font-semibold text-foreground">MStar Mobile</p>
                  <p className="text-xs text-muted-foreground">{timeAgo(post.created_at)}</p>
                </div>
              </div>
            </div>

            {/* Post Image */}
            {post.images?.[0] && (
              <div className="aspect-video bg-muted">
                <img
                  src={post.images[0]}
                  alt={post.caption || ""}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Post Actions */}
            <div className="p-4 border-b border-border">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleLike(post.id)}
                  className="flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors"
                >
                  <Heart className="h-6 w-6" />
                </button>
                <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                  <MessageCircle className="h-6 w-6" />
                </button>
                <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                  <Share2 className="h-6 w-6" />
                </button>
              </div>
              <p className="mt-2 text-sm font-medium text-foreground">
                {(post.likes_count || 0).toLocaleString()} likes • {post.comments_count || 0} comments
              </p>
            </div>

            {/* Post Content */}
            {post.caption && (
              <div className="p-4">
                <p className="text-foreground">{post.caption}</p>
              </div>
            )}
          </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostsPage;
