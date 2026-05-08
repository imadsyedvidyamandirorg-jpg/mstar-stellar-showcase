import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Play, Film } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const ReelsRow = () => {
  const [reels, setReels] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("reels")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(10);
      setReels(data || []);
    })();
  }, []);

  if (reels.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Film className="h-4 w-4 md:h-5 md:w-5 text-accent" />
          <h2 className="text-base md:text-xl font-semibold text-foreground">Shorts</h2>
        </div>
        <Link to="/dashboard/reels" className="text-xs md:text-sm text-accent font-medium hover:underline">
          View All
        </Link>
      </div>
      <div className="flex gap-3 overflow-x-auto no-scrollbar snap-x snap-mandatory -mx-4 px-4 md:mx-0 md:px-0 pb-1">
        {reels.map((r, i) => (
          <motion.div
            key={r.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.04 * i }}
            className="snap-start flex-shrink-0 w-32 md:w-40"
          >
            <Link to="/dashboard/reels" className="block group">
              <div className="relative aspect-[9/16] rounded-xl overflow-hidden bg-muted shadow-elegant group-hover:shadow-deep transition-all">
                {r.thumbnail_url ? (
                  <img src={r.thumbnail_url} alt={r.caption || "reel"} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <video src={r.video_url} muted playsInline preload="metadata" className="w-full h-full object-cover" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute top-2 left-2 bg-accent text-accent-foreground text-[10px] font-bold px-2 py-0.5 rounded">
                  Shorts
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-80 group-hover:opacity-100 transition">
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Play className="h-5 w-5 text-white fill-white ml-0.5" />
                  </div>
                </div>
                {r.caption && (
                  <p className="absolute bottom-2 left-2 right-2 text-[11px] text-white font-medium line-clamp-2">
                    {r.caption}
                  </p>
                )}
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ReelsRow;
