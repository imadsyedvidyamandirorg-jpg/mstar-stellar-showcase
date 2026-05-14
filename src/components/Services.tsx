import { Headphones, Watch, Sparkles, BadgeCheck, Plane, Zap } from "lucide-react";

const services = [
  {
    icon: Headphones,
    title: "Premium Audio",
    description: "Earbuds, headphones & speakers from boAt, Noise, JBL and more.",
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    icon: Watch,
    title: "Smart Wearables",
    description: "Smart watches and fitness trackers built for everyday life.",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    icon: Plane,
    title: "Drones & Gadgets",
    description: "Hand-picked drones and lifestyle gadgets for enthusiasts.",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    icon: Zap,
    title: "Power & Charging",
    description: "Powerbanks, fast chargers and reliable cables.",
    color: "text-mstar-gold",
    bgColor: "bg-mstar-gold/10",
  },
  {
    icon: Sparkles,
    title: "Lifestyle Tech",
    description: "Hair dryers, gaming controllers, tablets and more.",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    icon: BadgeCheck,
    title: "Genuine Products",
    description: "100% original products with brand warranty support.",
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
  },
];

const Services = () => {
  return (
    <section id="services" className="py-12 md:py-20 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-8 md:mb-16">
          <span className="text-accent font-medium text-xs md:text-sm uppercase tracking-wider">What We Offer</span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mt-2 md:mt-3 mb-3 md:mb-4">
            Premium Accessories & Smart Gadgets
          </h2>
          <p className="text-sm md:text-base text-muted-foreground">
            A curated selection of audio, wearables and lifestyle tech from brands you trust.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
          {services.map((service) => (
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

        <div className="mt-10 md:mt-20 text-center">
          <p className="text-muted-foreground mb-4 md:mb-8 text-sm md:text-base">Top Brands We Stock</p>
          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8 lg:gap-12">
            {["boAt", "Noise", "JBL", "Sony", "DJI", "Realme", "Mi", "Anker", "pTron", "Zebronics"].map((brand) => (
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
