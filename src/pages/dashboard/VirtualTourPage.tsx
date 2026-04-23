import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Eye, Loader2, Move } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const VirtualTourPage = () => {
  const [panoramas, setPanoramas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("panoramas")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });
      setPanoramas(data || []);
      setLoading(false);
    };
    fetch();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  if (panoramas.length === 0) {
    return (
      <div className="text-center py-20">
        <Eye className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-lg font-semibold text-foreground mb-2">Virtual Tour Coming Soon</h2>
        <p className="text-muted-foreground text-sm">360° views of our shop will be available soon!</p>
        <Link to="/dashboard" className="text-accent hover:underline text-sm mt-4 inline-block">← Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Link to="/dashboard" className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-lg md:text-xl font-bold text-foreground">Explore Our Shop</h1>
      </div>

      <PanoramaViewer imageUrl={panoramas[activeIndex]?.image_url} />

      <div className="flex items-center gap-2 text-xs text-muted-foreground justify-center">
        <Move className="h-3 w-3" /> Drag to look around
      </div>

      {panoramas.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {panoramas.map((p: any, i: number) => (
            <button
              key={p.id}
              onClick={() => setActiveIndex(i)}
              className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                activeIndex === i ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"
              }`}
            >
              {p.title}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const PanoramaViewer = ({ imageUrl }: { imageUrl: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [startOffset, setStartOffset] = useState({ x: 0, y: 0 });

  const handlePointerDown = (e: React.PointerEvent) => {
    setDragging(true);
    setStartPos({ x: e.clientX, y: e.clientY });
    setStartOffset({ ...position });
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragging) return;
    const dx = e.clientX - startPos.x;
    const dy = e.clientY - startPos.y;
    setPosition({
      x: startOffset.x + dx * 0.3,
      y: Math.max(-30, Math.min(30, startOffset.y + dy * 0.3)),
    });
  };

  const handlePointerUp = () => setDragging(false);

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-[16/9] md:aspect-[21/9] rounded-2xl overflow-hidden bg-muted cursor-grab active:cursor-grabbing select-none"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <img
        src={imageUrl}
        alt="360° Shop View"
        className="absolute h-full min-w-[200%] object-cover pointer-events-none"
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
          transition: dragging ? "none" : "transform 0.3s ease-out",
        }}
        draggable={false}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
      <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full text-white text-xs">
        360° View
      </div>
    </div>
  );
};

export default VirtualTourPage;