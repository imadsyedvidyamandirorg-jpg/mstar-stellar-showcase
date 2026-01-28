import { Instagram, Phone, Mail, MapPin, Heart } from "lucide-react";
import mstarLogo from "@/assets/mstar-logo.png";

const Footer = () => {
  const quickLinks = [
    { name: "Home", href: "#home" },
    { name: "Services", href: "#services" },
    { name: "Online Store", href: "#store" },
    { name: "Reels", href: "#reels" },
    { name: "Contact", href: "#contact" },
  ];

  const services = [
    "Latest Smartphones",
    "Mobile Exchange",
    "Expert Repairs",
    "Accessories",
    "Electronics",
  ];

  const brands = [
    "Samsung", "Vivo", "Oppo", "MI", "Realme",
    "Nokia", "iPhone", "OnePlus", "Haier", "LG"
  ];

  return (
    <footer className="hero-gradient border-t border-mstar-gray/20">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <img src={mstarLogo} alt="MStar Mobile" className="h-16 w-auto mb-4" />
            <p className="text-primary-foreground/70 mb-6">
              Your trusted destination for the latest smartphones and mobile accessories. 
              We are the Quality!
            </p>
            <div className="flex gap-4">
              <a
                href="https://www.instagram.com/mstar_mobile"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-mstar-dark rounded-full flex items-center justify-center hover:bg-accent transition-colors"
              >
                <Instagram className="h-5 w-5 text-primary-foreground" />
              </a>
              <a
                href="tel:08000296786"
                className="w-10 h-10 bg-mstar-dark rounded-full flex items-center justify-center hover:bg-accent transition-colors"
              >
                <Phone className="h-5 w-5 text-primary-foreground" />
              </a>
              <a
                href="mailto:mstarmobile77@gmail.com"
                className="w-10 h-10 bg-mstar-dark rounded-full flex items-center justify-center hover:bg-accent transition-colors"
              >
                <Mail className="h-5 w-5 text-primary-foreground" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-primary-foreground font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-primary-foreground/70 hover:text-accent transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-primary-foreground font-semibold mb-4">Our Services</h4>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service}>
                  <span className="text-primary-foreground/70">{service}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-primary-foreground font-semibold mb-4">Contact Info</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                <span className="text-primary-foreground/70 text-sm">
                  R.D Complex, Moti Bazaar Rd, Palanpur, Gujarat 385001
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-accent flex-shrink-0" />
                <span className="text-primary-foreground/70">080002 96786</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-accent flex-shrink-0" />
                <span className="text-primary-foreground/70">mstarmobile77@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Brands Ticker */}
        <div className="mt-12 pt-8 border-t border-mstar-gray/20">
          <p className="text-center text-primary-foreground/50 text-sm mb-4">Authorized Dealer</p>
          <div className="flex flex-wrap justify-center gap-4 md:gap-8">
            {brands.map((brand) => (
              <span key={brand} className="text-primary-foreground/40 text-sm font-medium">
                {brand}
              </span>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-mstar-gray/20 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-primary-foreground/50 text-sm">
            © 2024 MStar Mobile. All rights reserved.
          </p>
          <p className="text-primary-foreground/50 text-sm flex items-center gap-1">
            Made with <Heart className="h-4 w-4 text-accent fill-accent" /> in Palanpur
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
