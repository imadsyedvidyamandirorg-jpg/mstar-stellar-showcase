import { useState, useEffect } from "react";
import { Gift, Clock, Percent, ArrowRight, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const OffersPage = () => {
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOffers = async () => {
      const { data } = await supabase
        .from("offers")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });
      setOffers(data || []);
      setLoading(false);
    };
    fetchOffers();
  }, []);

  const gradientColors = [
    "from-accent to-orange-500",
    "from-green-500 to-emerald-500",
    "from-blue-500 to-indigo-500",
    "from-purple-500 to-pink-500",
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-foreground">New Offers</h1>
        <p className="text-muted-foreground">Exclusive deals and discounts just for you</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </div>
      ) : offers.length === 0 ? (
        <div className="bg-card rounded-2xl p-8 md:p-12 text-center">
          <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Gift className="h-10 w-10 text-accent" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No Offers Right Now</h3>
          <p className="text-muted-foreground mb-4">Check back soon for exclusive deals!</p>
          <Link to="/dashboard/store">
            <Button variant="accent">Shop Now</Button>
          </Link>
        </div>
      ) : (
        <>
          {/* Featured - first offer */}
          {offers.length > 0 && (
            <div className={`relative rounded-3xl p-6 md:p-8 overflow-hidden bg-gradient-to-r ${gradientColors[0]}`}>
              <div className="absolute top-4 right-4">
                <Badge className="bg-white/20 text-white backdrop-blur-sm">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Featured
                </Badge>
              </div>
              <div className="relative z-10 max-w-xl">
                {offers[0].discount_percent && (
                  <span className="text-4xl md:text-5xl font-bold text-white">{offers[0].discount_percent}% OFF</span>
                )}
                <h2 className="text-xl md:text-2xl font-bold text-white mt-4">{offers[0].title}</h2>
                {offers[0].description && <p className="text-white/90 mt-2">{offers[0].description}</p>}
                {offers[0].valid_until && (
                  <span className="flex items-center gap-1 text-white/80 text-sm mt-4">
                    <Clock className="h-4 w-4" />
                    Valid until {new Date(offers[0].valid_until).toLocaleDateString()}
                  </span>
                )}
                <Link to="/dashboard/store">
                  <Button className="mt-6 bg-white text-foreground hover:bg-white/90">
                    Shop Now <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {/* Other Offers */}
          {offers.length > 1 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {offers.slice(1).map((offer, i) => (
                <div key={offer.id} className="bg-card rounded-2xl p-6 shadow-elegant hover:shadow-deep transition-all">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${gradientColors[(i + 1) % gradientColors.length]} flex items-center justify-center mb-4`}>
                    <Percent className="h-7 w-7 text-white" />
                  </div>
                  {offer.discount_percent && (
                    <Badge variant="secondary" className="mb-3">{offer.discount_percent}% OFF</Badge>
                  )}
                  <h3 className="font-semibold text-foreground text-lg">{offer.title}</h3>
                  {offer.description && <p className="text-muted-foreground text-sm mt-2">{offer.description}</p>}
                  {offer.valid_until && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <span className="flex items-center gap-1 text-muted-foreground text-xs">
                        <Clock className="h-3 w-3" />
                        Valid until {new Date(offer.valid_until).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* CTA */}
      <div className="bg-muted rounded-2xl p-8 text-center">
        <Gift className="h-12 w-12 text-accent mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-foreground mb-2">Want More Deals?</h3>
        <p className="text-muted-foreground mb-4">Follow us on Instagram for flash sales and exclusive offers!</p>
        <a
          href="https://www.instagram.com/mstar_mobile"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="outline">Follow @mstar_mobile</Button>
        </a>
      </div>
    </div>
  );
};

export default OffersPage;
