import { useState, useEffect } from "react";
import { Play, Instagram, Heart, MessageCircle, Loader2, X, Send, Volume2, VolumeX, Share2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const ReelsPage = () => {
  const [reels, setReels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [playingReel, setPlayingReel] = useState<any | null>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [likedReels, setLikedReels] = useState<Set<string>>(new Set());
  const [muted, setMuted] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchReels = async () => {
      const { data } = await supabase
        .from("reels")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });
      setReels(data || []);
      setLoading(false);
      // Fetch user's likes
      if (user) {
        const { data: likes } = await supabase
          .from("reel_likes")
          .select("reel_id")
          .eq("user_id", user.id);
        setLikedReels(new Set((likes || []).map((l: any) => l.reel_id)));
      }
    };
    fetchReels();
  }, [user]);

  const fetchComments = async (reelId: string) => {
    const { data } = await supabase
      .from("reel_comments")
      .select("*")
      .eq("reel_id", reelId)
      .order("created_at", { ascending: false });
    setComments(data || []);
  };

  const openReel = (reel: any) => {
    setPlayingReel(reel);
    fetchComments(reel.id);
  };

  const toggleLike = async (reelId: string) => {
    if (!user) {
      toast({ title: "Please sign in to like", variant: "destructive" });
      return;
    }
    const isLiked = likedReels.has(reelId);
    if (isLiked) {
      await supabase.from("reel_likes").delete().eq("reel_id", reelId).eq("user_id", user.id);
      setLikedReels((prev) => {
        const next = new Set(prev);
        next.delete(reelId);
        return next;
      });
      setReels((prev) => prev.map((r) => r.id === reelId ? { ...r, likes_count: Math.max(0, (r.likes_count || 0) - 1) } : r));
      if (playingReel?.id === reelId) setPlayingReel({ ...playingReel, likes_count: Math.max(0, (playingReel.likes_count || 0) - 1) });
    } else {
      await supabase.from("reel_likes").insert({ reel_id: reelId, user_id: user.id });
      setLikedReels((prev) => new Set(prev).add(reelId));
      setReels((prev) => prev.map((r) => r.id === reelId ? { ...r, likes_count: (r.likes_count || 0) + 1 } : r));
      if (playingReel?.id === reelId) setPlayingReel({ ...playingReel, likes_count: (playingReel.likes_count || 0) + 1 });
    }
  };

  const addComment = async () => {
    if (!user) { toast({ title: "Please sign in to comment", variant: "destructive" }); return; }
    if (!newComment.trim() || !playingReel) return;
    const text = newComment.trim();
    const { data: inserted, error } = await supabase.from("reel_comments").insert({
      reel_id: playingReel.id,
      user_id: user.id,
      content: text,
    }).select().single();
    if (!error) {
      setNewComment("");
      fetchComments(playingReel.id);
      // Trigger AI auto-reply (best-effort)
      if (inserted?.id) {
        supabase.functions.invoke("comment-ai-reply", {
          body: { comment_id: inserted.id, comment_text: text, product_name: playingReel.caption || "this reel", target: "reel" },
        }).then(() => fetchComments(playingReel.id)).catch(() => {});
      }
    }
  };

  const handleShare = async (reelId: string, caption: string) => {
    const url = `https://mstar-mobile.vercel.app/dashboard/reels#${reelId}`;
    const data = { title: "MStar Mobile Reel", text: caption || "Watch this reel on MStar Mobile!", url };
    try {
      if (navigator.share) {
        await navigator.share(data);
      } else {
        await navigator.clipboard.writeText(url);
        toast({ title: "Reel link copied!", description: "Share it with your friends." });
      }
    } catch {}
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-foreground">Watch Reels</h1>
            <p className="text-muted-foreground">Product reviews, unboxings, and mobile tips</p>
          </div>
          <a href="https://www.instagram.com/mstar_mobile" target="_blank" rel="noopener noreferrer">
            <Button variant="accent">
              <Instagram className="h-5 w-5 mr-2" />
              Follow @mstar_mobile
            </Button>
          </a>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-accent" />
          </div>
        ) : reels.length === 0 ? (
          <div className="bg-card rounded-2xl p-8 text-center">
            <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Play className="h-10 w-10 text-accent" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No Reels Yet</h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-4">
              Follow us on Instagram to see our latest reels and stay updated!
            </p>
            <a href="https://www.instagram.com/mstar_mobile" target="_blank" rel="noopener noreferrer">
              <Button variant="outline">
                <Instagram className="h-4 w-4 mr-2" />
                Visit Instagram
              </Button>
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {reels.map((reel) => (
              <div
                key={reel.id}
                id={reel.id}
                onClick={() => openReel(reel)}
                className="group relative aspect-[9/16] bg-mstar-dark rounded-2xl overflow-hidden border border-mstar-gray/20 hover:border-accent/50 transition-all cursor-pointer"
              >
                {reel.thumbnail_url ? (
                  <img src={reel.thumbnail_url} alt={reel.caption || ""} className="w-full h-full object-cover" />
                ) : (
                  <video src={reel.video_url} className="w-full h-full object-cover" muted preload="metadata" />
                )}
                {/* Play overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                  <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Play className="h-6 w-6 text-white fill-white" />
                  </div>
                </div>
                {/* Info overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                  {reel.caption && <p className="text-white text-xs line-clamp-2">{reel.caption}</p>}
                  <div className="flex items-center gap-3 text-white/70 text-xs mt-1">
                    <span className="flex items-center gap-1"><Heart className="h-3 w-3" />{reel.likes_count || 0}</span>
                    <span className="flex items-center gap-1"><MessageCircle className="h-3 w-3" />{reel.comments_count || 0}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Instagram-style Reel Player Modal */}
      {playingReel && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-2 md:p-4" onClick={() => setPlayingReel(null)}>
          <button className="absolute top-4 right-4 z-20 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors" onClick={() => setPlayingReel(null)}>
            <X className="h-6 w-6 text-white" />
          </button>

          <div className="flex gap-0 md:gap-4 max-h-[95vh] w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            {/* Reel video (Instagram-style 9:16) */}
            <div className="relative aspect-[9/16] h-[85vh] max-h-[800px] bg-black rounded-2xl overflow-hidden flex-shrink-0 mx-auto">
              <video
                src={playingReel.video_url}
                className="w-full h-full object-cover"
                autoPlay
                loop
                muted={muted}
                playsInline
                onClick={(e) => { e.stopPropagation(); (e.currentTarget as HTMLVideoElement).paused ? (e.currentTarget as HTMLVideoElement).play() : (e.currentTarget as HTMLVideoElement).pause(); }}
              />

              {/* Mute toggle */}
              <button onClick={() => setMuted(!muted)} className="absolute top-4 left-4 p-2 bg-black/40 hover:bg-black/60 rounded-full transition-colors">
                {muted ? <VolumeX className="h-4 w-4 text-white" /> : <Volume2 className="h-4 w-4 text-white" />}
              </button>

              {/* Right action bar (Instagram style) */}
              <div className="absolute right-3 bottom-24 flex flex-col items-center gap-5 md:hidden">
                <button onClick={() => toggleLike(playingReel.id)} className="flex flex-col items-center gap-1">
                  <Heart className={`h-7 w-7 transition-colors ${likedReels.has(playingReel.id) ? "fill-red-500 text-red-500" : "text-white"}`} />
                  <span className="text-white text-xs font-medium">{playingReel.likes_count || 0}</span>
                </button>
                <div className="flex flex-col items-center gap-1">
                  <MessageCircle className="h-7 w-7 text-white" />
                  <span className="text-white text-xs font-medium">{comments.length}</span>
                </div>
              </div>

              {/* Bottom info gradient */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/60 to-transparent">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                    <span className="text-xs font-bold text-white">M</span>
                  </div>
                  <span className="text-white text-sm font-semibold">@mstar_mobile</span>
                </div>
                {playingReel.caption && <p className="text-white text-sm line-clamp-3">{playingReel.caption}</p>}
              </div>
            </div>

            {/* Comments sidebar (desktop) */}
            <div className="hidden md:flex flex-col w-80 bg-card rounded-2xl overflow-hidden">
              <div className="p-4 border-b border-border flex items-center justify-between">
                <h3 className="font-semibold text-foreground text-sm">Comments ({comments.length})</h3>
                <button onClick={() => toggleLike(playingReel.id)} className="flex items-center gap-1.5">
                  <Heart className={`h-5 w-5 transition-colors ${likedReels.has(playingReel.id) ? "fill-red-500 text-red-500" : "text-muted-foreground"}`} />
                  <span className="text-sm text-foreground font-medium">{playingReel.likes_count || 0}</span>
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
                      <p className="text-[10px] text-muted-foreground">{new Date(c.created_at).toLocaleDateString()}</p>
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
        </div>
      )}
    </>
  );
};

export default ReelsPage;
