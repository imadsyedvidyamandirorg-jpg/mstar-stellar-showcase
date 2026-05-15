import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Tag } from "lucide-react";

const FALLBACK = [
  { name: "Earbuds", image_url: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=200&h=200&fit=crop", slug: "earbuds" },
  { name: "Watches", image_url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop", slug: "watches" },
  { name: "Headphones", image_url: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=200&h=200&fit=crop", slug: "headphones" },
  { name: "Powerbanks", image_url: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=200&h=200&fit=crop", slug: "powerbanks" },
  { name: "Drones", image_url: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=200&h=200&fit=crop", slug: "drones" },
];

const CategoryStrip = () => {
  const [categories, setCategories] = useState<{ name: string; image_url: string | null; slug: string }[]>(FALLBACK);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("categories")
        .select("name,image_url,slug")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });
      if (data && data.length) setCategories(data as any);
    })();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
      className="bg-card rounded-2xl shadow-elegant border border-border/50 px-2 py-3 md:px-4 md:py-4"
    >
      <div className="flex items-center justify-between mb-3 px-2">
        <h3 className="text-sm md:text-base font-semibold text-foreground">Shop by Category</h3>
        <Link to="/dashboard/store" className="text-xs md:text-sm text-accent font-medium hover:underline">
          View All
        </Link>
      </div>
      <div className="flex items-stretch gap-3 md:gap-5 overflow-x-auto no-scrollbar snap-x snap-mandatory -mx-1 px-1 pb-1">
        {categories.map((c, i) => (
          <motion.div
            key={c.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.05 * i }}
            className="snap-start flex-shrink-0"
          >
            <Link
              to={`/dashboard/store?cat=${c.slug}`}
              className="group flex flex-col items-center gap-1.5 md:gap-2 w-16 md:w-20"
            >
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden bg-background border border-border flex items-center justify-center transition-all group-hover:border-accent group-hover:shadow-[0_0_0_3px_hsl(var(--accent)/0.15)] group-hover:-translate-y-0.5">
                {c.image_url ? (
                  <img src={c.image_url} alt={c.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                ) : (
                  <Tag className="h-6 w-6 text-muted-foreground" />
                )}
              </div>
              <span className="text-[11px] md:text-xs font-medium text-foreground text-center leading-tight">
                {c.name}
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default CategoryStrip;
