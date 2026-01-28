import { Gift, Clock, Percent, Tag, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const OffersPage = () => {
  const offers = [
    {
      id: 1,
      title: "Weekend Mega Sale",
      description: "Get up to 30% off on all smartphones! Limited time offer.",
      discount: "30% OFF",
      validUntil: "2 days left",
      code: "WEEKEND30",
      color: "from-accent to-orange-500",
      featured: true,
    },
    {
      id: 2,
      title: "Accessory Bundle Deal",
      description: "Buy any phone and get a free case + screen protector worth ₹1,999!",
      discount: "FREE GIFT",
      validUntil: "5 days left",
      code: "BUNDLE2024",
      color: "from-green-500 to-emerald-500",
      featured: false,
    },
    {
      id: 3,
      title: "Exchange Bonus",
      description: "Trade in your old phone and get extra ₹5,000 on new Samsung phones.",
      discount: "₹5,000 EXTRA",
      validUntil: "7 days left",
      code: "EXCHANGE5K",
      color: "from-blue-500 to-indigo-500",
      featured: false,
    },
    {
      id: 4,
      title: "Student Discount",
      description: "Students get 10% off on all products. Valid student ID required.",
      discount: "10% OFF",
      validUntil: "Ongoing",
      code: "STUDENT10",
      color: "from-purple-500 to-pink-500",
      featured: false,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">New Offers</h1>
        <p className="text-muted-foreground">Exclusive deals and discounts just for you</p>
      </div>

      {/* Featured Offer */}
      {offers.filter((o) => o.featured).map((offer) => (
        <div
          key={offer.id}
          className={`relative rounded-3xl p-8 overflow-hidden bg-gradient-to-r ${offer.color}`}
        >
          <div className="absolute top-4 right-4">
            <Badge className="bg-white/20 text-white backdrop-blur-sm">
              <Sparkles className="h-3 w-3 mr-1" />
              Featured
            </Badge>
          </div>
          <div className="relative z-10 max-w-xl">
            <span className="text-5xl font-bold text-white">{offer.discount}</span>
            <h2 className="text-2xl font-bold text-white mt-4">{offer.title}</h2>
            <p className="text-white/90 mt-2">{offer.description}</p>
            <div className="flex items-center gap-4 mt-6">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                <span className="text-white font-mono font-bold">{offer.code}</span>
              </div>
              <span className="flex items-center gap-1 text-white/80 text-sm">
                <Clock className="h-4 w-4" />
                {offer.validUntil}
              </span>
            </div>
            <Link to="/dashboard/store">
              <Button className="mt-6 bg-white text-foreground hover:bg-white/90">
                Shop Now
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      ))}

      {/* Other Offers */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {offers.filter((o) => !o.featured).map((offer) => (
          <div
            key={offer.id}
            className="bg-card rounded-2xl p-6 shadow-elegant hover:shadow-deep transition-all"
          >
            <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${offer.color} flex items-center justify-center mb-4`}>
              <Percent className="h-7 w-7 text-white" />
            </div>
            <Badge variant="secondary" className="mb-3">{offer.discount}</Badge>
            <h3 className="font-semibold text-foreground text-lg">{offer.title}</h3>
            <p className="text-muted-foreground text-sm mt-2">{offer.description}</p>
            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex items-center justify-between">
                <div className="bg-muted rounded-lg px-3 py-1.5">
                  <span className="font-mono text-sm font-medium text-foreground">{offer.code}</span>
                </div>
                <span className="flex items-center gap-1 text-muted-foreground text-xs">
                  <Clock className="h-3 w-3" />
                  {offer.validUntil}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

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
