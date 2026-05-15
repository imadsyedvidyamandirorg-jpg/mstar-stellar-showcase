import { useState } from "react";
import { Menu, X, Phone, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import mstarLogo from "@/assets/mstar-logo.png";
import { BUSINESS } from "@/lib/contact";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "Services", href: "#services" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 hero-gradient border-b border-mstar-gray/20">
      {/* Top Bar - Hidden on mobile */}
      <div className="hidden lg:block border-b border-mstar-gray/20 py-2">
        <div className="container mx-auto px-4 flex justify-between items-center text-sm text-muted-foreground">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2">
              <Phone className="h-3 w-3 text-accent" />
              {BUSINESS.phoneDisplay}
            </span>
            <span className="flex items-center gap-2">
              <Clock className="h-3 w-3 text-accent" />
              Open · Closes 9 PM
            </span>
          </div>
          <span className="flex items-center gap-2">
            <MapPin className="h-3 w-3 text-accent" />
            Moti Bazaar Rd, Palliviya Nagar, Palanpur
          </span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="container mx-auto px-4 py-3 md:py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="#home" className="flex items-center gap-3">
            <img src={mstarLogo} alt="MStar Mobile" className="h-10 md:h-12 w-auto" />
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-primary-foreground/80 hover:text-accent transition-colors font-medium text-sm lg:text-base"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Link to="/dashboard">
              <Button variant="accent" size="default" className="lg:text-base">
                Dashboard
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-primary-foreground p-2 -mr-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-mstar-gray/20 pt-4 animate-slide-up">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-primary-foreground/80 hover:text-accent transition-colors font-medium py-3 px-2 rounded-lg hover:bg-mstar-dark/50"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              <div className="pt-3 mt-2 border-t border-mstar-gray/20">
                <Link to="/dashboard" onClick={() => setIsOpen(false)}>
                  <Button variant="accent" className="w-full h-12">
                    Go to Dashboard
                  </Button>
                </Link>
              </div>
              {/* Mobile Quick Info */}
              <div className="mt-4 pt-4 border-t border-mstar-gray/20 space-y-2 text-sm text-primary-foreground/60">
                <p className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-accent" />
                  {BUSINESS.phoneDisplay}
                </p>
                <p className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-accent" />
                  Open · Closes 9 PM
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
