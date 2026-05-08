import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Gift, Tag } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const OffersRow = () => {
  const [offers, setOffers] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("offers")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(8);
      setOffers(data || []);
    })();
  }, []);

  if (offers.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.25 }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Gift className="h-4 w-4 md:h-5 md:w-5 text-accent" />
          <h2 className="text-base md:text-xl font-semibold text-foreground">Live Offers</h2>
        </div>
        <Link to="/dashboard/offers" className="text-xs md:text-sm text-accent font-medium hover:underline">
          View All
        </Link>
      </div>
      <div className="flex gap-3 overflow-x-auto no-scrollbar snap-x snap-mandatory -mx-4 px-4 md:mx-0 md:px-0 pb-1">
        {offers.map((o, i) => (
          <motion.div
            key={o.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.05 * i }}
            className="snap-start flex-shrink-0 w-64 md:w-72"
          >
            <Link to="/dashboard/offers" className="block group">
              <div className="relative h-32 md:h-36 rounded-xl overflow-hidden bg-gradient-to-br from-accent to-accent/70 shadow-elegant group-hover:shadow-deep transition-all">
                {o.image_url && (
                  <img src={o.image_url} alt={o.title} className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-50 transition" />
                )}
                <div className="relative z-10 p-4 h-full flex flex-col justify-between text-primary-foreground">
                  <div className="flex items-start justify-between">
                    <Tag className="h-5 w-5" />
                    {o.discount_percent && (
                      <span className="bg-white text-accent font-bold text-sm px-2 py-0.5 rounded-full">
                        {o.discount_percent}% OFF
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-base md:text-lg line-clamp-1">{o.title}</h3>
                    {o.description && (
                      <p className="text-xs opacity-90 line-clamp-1 mt-0.5">{o.description}</p>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default OffersRow;
