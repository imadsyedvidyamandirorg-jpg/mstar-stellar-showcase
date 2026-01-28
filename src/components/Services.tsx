import { Smartphone, RefreshCw, Wrench, Headphones, Tv, BadgeCheck } from "lucide-react";

const services = [
  {
    icon: Smartphone,
    title: "Latest Smartphones",
    description: "Explore a curated selection of the newest models from Samsung, Vivo, Oppo, MI, Realme, Nokia, iPhone & OnePlus.",
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    icon: RefreshCw,
    title: "Mobile Exchange",
    description: "Trade in your old smartphone and get the best value towards your new device purchase.",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    icon: Wrench,
    title: "Expert Service",
    description: "Professional repair and maintenance services for all smartphone brands and models.",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    icon: Headphones,
    title: "Accessories",
    description: "Find everything from protective cases to high-quality chargers, earphones, and more.",
    color: "text-mstar-gold",
    bgColor: "bg-mstar-gold/10",
  },
  {
    icon: Tv,
    title: "Electronics",
    description: "Discover a range of home electronics including TVs, refrigerators from Haier & LG.",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    icon: BadgeCheck,
    title: "Expert Advice",
    description: "Receive personalized recommendations to choose the right products for your needs.",
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
  },
];

const Services = () => {
  return (
    <section id="services" className="py-20 bg-secondary">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-accent font-medium text-sm uppercase tracking-wider">Our Services</span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-3 mb-4">
            What We Offer
          </h2>
          <p className="text-muted-foreground">
            From the latest smartphones to expert repair services, we've got everything you need to stay connected.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <div
              key={service.title}
              className="group bg-card rounded-2xl p-6 shadow-elegant hover:shadow-deep transition-all duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`${service.bgColor} w-14 h-14 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                <service.icon className={`h-7 w-7 ${service.color}`} />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                {service.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>

        {/* Brands */}
        <div className="mt-20 text-center">
          <p className="text-muted-foreground mb-8">Authorized Dealer for Top Brands</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            {["Samsung", "Vivo", "Oppo", "MI", "Realme", "Nokia", "iPhone", "OnePlus", "Haier", "LG"].map((brand) => (
              <span
                key={brand}
                className="text-lg font-semibold text-mstar-gray/60 hover:text-accent transition-colors cursor-default"
              >
                {brand}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
