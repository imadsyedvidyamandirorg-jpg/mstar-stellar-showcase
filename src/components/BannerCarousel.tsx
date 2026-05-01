import { useEffect, useState, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";

interface Banner {
  id: string;
  image_url: string;
  link_url: string | null;
  title: string | null;
}

const BannerCarousel = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const fetchBanners = async () => {
      const { data } = await supabase
        .from("banners")
        .select("id, image_url, link_url, title")
        .eq("is_active", true)
        .order("position", { ascending: true })
        .order("created_at", { ascending: false });
      setBanners(data || []);
      setLoading(false);
    };
    fetchBanners();
  }, []);

  // Auto-scroll
  useEffect(() => {
    if (!emblaApi || banners.length <= 1) return;
    const interval = setInterval(() => emblaApi.scrollNext(), 4500);
    return () => clearInterval(interval);
  }, [emblaApi, banners.length]);

  // Track selected
  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((idx: number) => emblaApi?.scrollTo(idx), [emblaApi]);

  if (loading) {
    return <div className="aspect-[16/6] md:aspect-[16/5] w-full rounded-2xl md:rounded-3xl bg-muted animate-pulse" />;
  }
  if (banners.length === 0) return null;

  const renderSlide = (b: Banner) => {
    const inner = (
      <img
        src={b.image_url}
        alt={b.title || "Banner"}
        className="w-full h-full object-cover"
        loading="lazy"
      />
    );
    const wrapClass = "relative block w-full aspect-[16/6] md:aspect-[16/5] overflow-hidden rounded-2xl md:rounded-3xl";
    if (b.link_url) {
      const isExternal = /^https?:\/\//i.test(b.link_url);
      if (isExternal) {
        return (
          <a key={b.id} href={b.link_url} target="_blank" rel="noopener noreferrer" className={wrapClass}>
            {inner}
          </a>
        );
      }
      return (
        <a key={b.id} href={b.link_url} className={wrapClass}>
          {inner}
        </a>
      );
    }
    return <div key={b.id} className={wrapClass}>{inner}</div>;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative group"
    >
      <div className="overflow-hidden rounded-2xl md:rounded-3xl shadow-deep" ref={emblaRef}>
        <div className="flex">
          {banners.map((b) => (
            <div key={b.id} className="flex-[0_0_100%] min-w-0">
              {renderSlide(b)}
            </div>
          ))}
        </div>
      </div>

      {banners.length > 1 && (
        <>
          <button
            onClick={scrollPrev}
            aria-label="Previous banner"
            className="absolute left-2 md:left-3 top-1/2 -translate-y-1/2 h-9 w-9 md:h-11 md:w-11 rounded-full bg-background/70 backdrop-blur border border-border/50 flex items-center justify-center text-foreground shadow-elegant opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={scrollNext}
            aria-label="Next banner"
            className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 h-9 w-9 md:h-11 md:w-11 rounded-full bg-background/70 backdrop-blur border border-border/50 flex items-center justify-center text-foreground shadow-elegant opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Pagination dots */}
          <div className="absolute bottom-2 md:bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-background/40 backdrop-blur">
            {banners.map((_, i) => (
              <button
                key={i}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => scrollTo(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === selectedIndex ? "w-6 bg-accent" : "w-1.5 bg-foreground/40 hover:bg-foreground/60"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </motion.div>
  );
};

export default BannerCarousel;
