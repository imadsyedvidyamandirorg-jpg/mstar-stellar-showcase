import { useState, useEffect } from "react";
import { Play, Instagram, Heart, MessageCircle, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const ReelsPage = () => {
  const [reels, setReels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [playingReel, setPlayingReel] = useState<any | null>(null);

  useEffect(() => {
    const fetchReels = async () => {
      const { data } = await supabase
        .from("reels")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });
      setReels(data || []);
      setLoading(false);
    };
    fetchReels();
  }, []);

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
                onClick={() => setPlayingReel(reel)}
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

      {/* Video Player Modal */}
      {playingReel && (
        <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center" onClick={() => setPlayingReel(null)}>
          <button className="absolute top-4 right-4 z-10 p-2 bg-white/20 rounded-full" onClick={() => setPlayingReel(null)}>
            <X className="h-6 w-6 text-white" />
          </button>
          <video
            src={playingReel.video_url}
            className="max-h-[90vh] max-w-full rounded-xl"
            autoPlay
            controls
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
};

export default ReelsPage;
