import { useState } from "react";
import { Menu, X, Phone, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import mstarLogo from "@/assets/mstar-logo.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "Services", href: "#services" },
    { name: "Store", href: "#store" },
    { name: "Reels", href: "#reels" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 hero-gradient border-b border-mstar-gray/20">
      {/* Top Bar */}
      <div className="hidden md:block border-b border-mstar-gray/20 py-2">
        <div className="container mx-auto px-4 flex justify-between items-center text-sm text-muted-foreground">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2">
              <Phone className="h-3 w-3 text-accent" />
              080002 96786
            </span>
            <span className="flex items-center gap-2">
              <Clock className="h-3 w-3 text-accent" />
              Open · Closes 9 PM
            </span>
          </div>
          <span className="flex items-center gap-2">
            <MapPin className="h-3 w-3 text-accent" />
            Moti Bazaar Rd, Palanpur, Gujarat
          </span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="#home" className="flex items-center gap-3">
            <img src={mstarLogo} alt="MStar Mobile" className="h-12 w-auto" />
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-primary-foreground/80 hover:text-accent transition-colors font-medium"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Button variant="accent" size="lg">
              Visit Store
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-primary-foreground"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-mstar-gray/20 pt-4 animate-slide-up">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-primary-foreground/80 hover:text-accent transition-colors font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              <Button variant="accent" className="mt-2">
                Visit Store
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
