import { Instagram, Phone, Mail, MapPin, Heart } from "lucide-react";
import mstarLogo from "@/assets/mstar-logo.png";

const Footer = () => {
  const quickLinks = [
    { name: "Home", href: "#home" },
    { name: "Services", href: "#services" },
    { name: "Contact", href: "#contact" },
  ];

  const services = [
    "Smartphones",
    "Exchange",
    "Repairs",
    "Accessories",
  ];

  return (
    <footer className="hero-gradient border-t border-mstar-gray/20">
      <div className="container mx-auto px-4 py-10 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <img src={mstarLogo} alt="MStar Mobile" className="h-12 md:h-16 w-auto mb-3 md:mb-4" />
            <p className="text-primary-foreground/70 text-sm mb-4 md:mb-6">
              Your trusted destination for smartphones and accessories.
            </p>
            <div className="flex gap-3">
              <a
                href="https://www.instagram.com/mstar_mobile"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 md:w-10 md:h-10 bg-mstar-dark rounded-full flex items-center justify-center hover:bg-accent transition-colors"
              >
                <Instagram className="h-4 w-4 md:h-5 md:w-5 text-primary-foreground" />
              </a>
              <a
                href="tel:08000296786"
                className="w-9 h-9 md:w-10 md:h-10 bg-mstar-dark rounded-full flex items-center justify-center hover:bg-accent transition-colors"
              >
                <Phone className="h-4 w-4 md:h-5 md:w-5 text-primary-foreground" />
              </a>
              <a
                href="mailto:mstarmobile77@gmail.com"
                className="w-9 h-9 md:w-10 md:h-10 bg-mstar-dark rounded-full flex items-center justify-center hover:bg-accent transition-colors"
              >
                <Mail className="h-4 w-4 md:h-5 md:w-5 text-primary-foreground" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-primary-foreground font-semibold mb-3 md:mb-4 text-sm md:text-base">Quick Links</h4>
            <ul className="space-y-2 md:space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-primary-foreground/70 hover:text-accent transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-primary-foreground font-semibold mb-3 md:mb-4 text-sm md:text-base">Services</h4>
            <ul className="space-y-2 md:space-y-3">
              {services.map((service) => (
                <li key={service}>
                  <span className="text-primary-foreground/70 text-sm">{service}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-2 md:col-span-1">
            <h4 className="text-primary-foreground font-semibold mb-3 md:mb-4 text-sm md:text-base">Contact</h4>
            <ul className="space-y-3 md:space-y-4">
              <li className="flex items-start gap-2 md:gap-3">
                <MapPin className="h-4 w-4 md:h-5 md:w-5 text-accent flex-shrink-0 mt-0.5" />
                <span className="text-primary-foreground/70 text-xs md:text-sm">
                  Moti Bazaar Rd, Palanpur, Gujarat 385001
                </span>
              </li>
              <li className="flex items-center gap-2 md:gap-3">
                <Phone className="h-4 w-4 md:h-5 md:w-5 text-accent flex-shrink-0" />
                <span className="text-primary-foreground/70 text-xs md:text-sm">080002 96786</span>
              </li>
              <li className="flex items-center gap-2 md:gap-3">
                <Mail className="h-4 w-4 md:h-5 md:w-5 text-accent flex-shrink-0" />
                <span className="text-primary-foreground/70 text-xs md:text-sm break-all">mstarmobile77@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 md:mt-12 pt-6 md:pt-8 border-t border-mstar-gray/20 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-primary-foreground/50 text-xs md:text-sm text-center md:text-left">
            © 2024 MStar Mobile. All rights reserved.
          </p>
          <p className="text-primary-foreground/50 text-xs md:text-sm flex items-center gap-1">
            Made with <Heart className="h-3 w-3 md:h-4 md:w-4 text-accent fill-accent" /> in Palanpur
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
