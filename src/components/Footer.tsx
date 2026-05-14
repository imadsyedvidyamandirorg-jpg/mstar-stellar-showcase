import { Instagram, Phone, Mail, MapPin, Facebook, Youtube, Send, MessageCircle, Clock, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import mstarLogo from "@/assets/mstar-logo.png";

interface FooterProps {
  showMap?: boolean;
}

const ADDRESS_FULL = "R.D Complex, Opp. Sukhadia Sweet Mart, Near Janta Kachori, Moti Bazar, Palanpur — 385001, Gujarat, India";
const MAPS_QUERY = encodeURIComponent("M Star Mobile, R.D Complex, Moti Bazar, Palanpur, Gujarat 385001");
const MAPS_LINK = `https://www.google.com/maps/search/?api=1&query=${MAPS_QUERY}`;
const MAPS_EMBED = `https://maps.google.com/maps?q=${MAPS_QUERY}&t=m&z=16&output=embed&iwloc=near`;
const PHONE = "+919327188556";
const WHATSAPP = "https://wa.me/919327188556";
const EMAIL = "mstarmobile77@gmail.com";

const Footer = ({ showMap = false }: FooterProps) => {
  const policyLinks = [
    { name: "Privacy Policy", href: "/privacy-policy" },
    { name: "Refund & Cancellation", href: "/refund-policy" },
    { name: "Shipping & Delivery", href: "/shipping-policy" },
    { name: "Terms & Conditions", href: "/terms-and-conditions" },
  ];

  const shopLinks = [
    { name: "Home", href: "/dashboard" },
    { name: "Store", href: "/dashboard/store" },
    { name: "Offers", href: "/dashboard/offers" },
    { name: "Orders", href: "/dashboard/orders" },
  ];

  const socials = [
    { Icon: Instagram, href: "https://www.instagram.com/mstar_mobile", label: "Instagram" },
    { Icon: Facebook, href: "https://www.facebook.com/mstarmobile7777/", label: "Facebook" },
    { Icon: Youtube, href: "https://www.youtube.com/@mstar_mobile", label: "YouTube" },
    { Icon: Send, href: "https://t.me/mstarmobile", label: "Telegram" },
    { Icon: MessageCircle, href: WHATSAPP, label: "WhatsApp" },
    { Icon: Mail, href: `mailto:${EMAIL}`, label: "Email" },
  ];

  return (
    <footer className="hero-gradient border-t border-mstar-gray/20">
      <div className="container mx-auto px-4 py-10 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <img src={mstarLogo} alt="MStar Mobile" className="h-12 md:h-16 w-auto mb-3 md:mb-4" />
            <p className="text-primary-foreground/70 text-sm mb-4 md:mb-6">
              Your trusted destination for premium accessories and smart gadgets.
            </p>
            <div className="flex flex-wrap gap-2">
              {socials.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  title={label}
                  className="w-9 h-9 md:w-10 md:h-10 bg-mstar-dark rounded-full flex items-center justify-center hover:bg-accent transition-colors"
                >
                  <Icon className="h-4 w-4 md:h-[18px] md:w-[18px] text-primary-foreground" />
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-primary-foreground font-semibold mb-3 md:mb-4 text-sm md:text-base">Shop</h4>
            <ul className="space-y-2 md:space-y-3">
              {shopLinks.map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="text-primary-foreground/70 hover:text-accent transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h4 className="text-primary-foreground font-semibold mb-3 md:mb-4 text-sm md:text-base">Policies</h4>
            <ul className="space-y-2 md:space-y-3">
              {policyLinks.map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="text-primary-foreground/70 hover:text-accent transition-colors text-sm">
                    {link.name}
                  </Link>
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
                <span className="text-primary-foreground/70 text-xs md:text-sm leading-relaxed">{ADDRESS_FULL}</span>
              </li>
              <li className="flex items-center gap-2 md:gap-3">
                <Phone className="h-4 w-4 md:h-5 md:w-5 text-accent flex-shrink-0" />
                <a href={`tel:${PHONE}`} className="text-primary-foreground/70 hover:text-accent text-xs md:text-sm">
                  +91 93271 88556
                </a>
              </li>
              <li className="flex items-center gap-2 md:gap-3">
                <Mail className="h-4 w-4 md:h-5 md:w-5 text-accent flex-shrink-0" />
                <a href={`mailto:${EMAIL}`} className="text-primary-foreground/70 hover:text-accent text-xs md:text-sm break-all">
                  {EMAIL}
                </a>
              </li>
              <li className="flex items-center gap-2 md:gap-3">
                <Clock className="h-4 w-4 md:h-5 md:w-5 text-accent flex-shrink-0" />
                <span className="text-primary-foreground/70 text-xs md:text-sm">Mon – Sun · 10 AM – 9 PM</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Map */}
        {showMap && (
          <div className="mt-8 md:mt-12 rounded-xl overflow-hidden border border-mstar-gray/20 bg-mstar-dark">
            <iframe
              src={MAPS_EMBED}
              width="100%"
              height="220"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="M Star Mobile Location"
              className="w-full block"
            />
            <a
              href={MAPS_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-3 text-sm font-medium text-primary-foreground hover:text-accent transition-colors border-t border-mstar-gray/20"
            >
              <MapPin className="h-4 w-4" />
              Open in Google Maps
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        )}

        {/* Copyright */}
        <div className="mt-8 md:mt-12 pt-6 md:pt-8 border-t border-mstar-gray/20 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-primary-foreground/50 text-xs md:text-sm text-center md:text-left">
            © 2026 M Star Mobile. All rights reserved.
          </p>
          <p className="text-primary-foreground/50 text-xs md:text-sm flex items-center gap-1">
            Powered by <span className="text-accent font-semibold">Dami AI</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
