import { Play, Instagram, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const ReelsSection = () => {
  // Placeholder reels - will be populated later
  const placeholderReels = [
    { id: 1 },
    { id: 2 },
    { id: 3 },
    { id: 4 },
    { id: 5 },
    { id: 6 },
  ];

  return (
    <section id="reels" className="py-20 hero-gradient">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <span className="text-accent font-medium text-sm uppercase tracking-wider">Follow Us</span>
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mt-3">
              Latest Reels & Updates
            </h2>
            <p className="text-primary-foreground/70 mt-2">
              Stay tuned for product reviews, tips, and exclusive offers
            </p>
          </div>
          <a
            href="https://www.instagram.com/mstar_mobile"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="accent" size="lg">
              <Instagram className="h-5 w-5 mr-2" />
              Follow @mstar_mobile
            </Button>
          </a>
        </div>

        {/* Reels Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {placeholderReels.map((reel) => (
            <div
              key={reel.id}
              className="group relative aspect-[9/16] bg-mstar-dark rounded-2xl overflow-hidden border border-mstar-gray/20 hover:border-accent/50 transition-all duration-300"
            >
              {/* Placeholder Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-primary-foreground/40">
                <div className="w-16 h-16 rounded-full border-2 border-dashed border-current flex items-center justify-center mb-3 group-hover:border-accent group-hover:text-accent transition-colors">
                  <Play className="h-6 w-6" />
                </div>
                <span className="text-xs font-medium">Coming Soon</span>
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-accent/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>

        {/* Add Reels CTA */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-4 bg-mstar-dark/50 backdrop-blur-sm border border-mstar-gray/20 rounded-2xl px-8 py-6">
            <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center">
              <Plus className="h-7 w-7 text-accent" />
            </div>
            <div className="text-left">
              <h4 className="text-primary-foreground font-semibold">Reels Dashboard</h4>
              <p className="text-primary-foreground/60 text-sm">Content will be added from admin panel</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReelsSection;
