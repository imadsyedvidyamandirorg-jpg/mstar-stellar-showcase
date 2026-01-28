import { Smartphone, RefreshCw, Wrench, Headphones, Tv, BadgeCheck } from "lucide-react";

const services = [
  {
    icon: Smartphone,
    title: "Latest Smartphones",
    description: "Samsung, Vivo, Oppo, MI, Realme, Nokia, iPhone & OnePlus.",
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    icon: RefreshCw,
    title: "Mobile Exchange",
    description: "Trade in your old phone and get the best value.",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    icon: Wrench,
    title: "Expert Service",
    description: "Professional repair for all smartphone brands.",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    icon: Headphones,
    title: "Accessories",
    description: "Cases, chargers, earphones, and more.",
    color: "text-mstar-gold",
    bgColor: "bg-mstar-gold/10",
  },
  {
    icon: Tv,
    title: "Electronics",
    description: "TVs, refrigerators from Haier & LG.",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    icon: BadgeCheck,
    title: "Expert Advice",
    description: "Personalized product recommendations.",
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
  },
];

const Services = () => {
  return (
    <section id="services" className="py-12 md:py-20 bg-secondary">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 md:mb-16">
          <span className="text-accent font-medium text-xs md:text-sm uppercase tracking-wider">Our Services</span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mt-2 md:mt-3 mb-3 md:mb-4">
            What We Offer
          </h2>
          <p className="text-sm md:text-base text-muted-foreground">
            Everything you need to stay connected with the best mobile technology.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
          {services.map((service, index) => (
            <div
              key={service.title}
              className="group bg-card rounded-xl md:rounded-2xl p-4 md:p-6 shadow-elegant hover:shadow-deep transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`${service.bgColor} w-10 h-10 md:w-14 md:h-14 rounded-lg md:rounded-xl flex items-center justify-center mb-3 md:mb-5 group-hover:scale-110 transition-transform`}>
                <service.icon className={`h-5 w-5 md:h-7 md:w-7 ${service.color}`} />
              </div>
              <h3 className="text-sm md:text-xl font-semibold text-foreground mb-1 md:mb-3">
                {service.title}
              </h3>
              <p className="text-xs md:text-base text-muted-foreground leading-relaxed hidden sm:block">
                {service.description}
              </p>
            </div>
          ))}
        </div>

        {/* Brands - Scrollable on mobile */}
        <div className="mt-10 md:mt-20 text-center">
          <p className="text-muted-foreground mb-4 md:mb-8 text-sm md:text-base">Authorized Dealer for Top Brands</p>
          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8 lg:gap-12">
            {["Samsung", "Vivo", "Oppo", "MI", "Realme", "Nokia", "iPhone", "OnePlus", "Haier", "LG"].map((brand) => (
              <span
                key={brand}
                className="text-sm md:text-lg font-semibold text-mstar-gray/60 hover:text-accent transition-colors cursor-default"
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
