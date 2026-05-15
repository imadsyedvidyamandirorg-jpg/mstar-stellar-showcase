import { Phone, Mail, MessageCircle, MapPin, X } from "lucide-react";
import { useState } from "react";
import { BUSINESS, MAPS_LINK } from "@/lib/contact";

const ContactButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  const contactOptions = [
    {
      icon: Phone,
      label: "Call Us",
      value: BUSINESS.phoneDisplay,
      href: `tel:${BUSINESS.phoneTel}`,
      color: "bg-green-500 hover:bg-green-600",
    },
    {
      icon: MessageCircle,
      label: "WhatsApp",
      value: BUSINESS.phoneDisplay,
      href: BUSINESS.whatsapp,
      color: "bg-emerald-500 hover:bg-emerald-600",
    },
    {
      icon: Mail,
      label: "Email",
      value: BUSINESS.email,
      href: `mailto:${BUSINESS.email}`,
      color: "bg-blue-500 hover:bg-blue-600",
    },
    {
      icon: MapPin,
      label: "Visit Store",
      value: "Get Directions",
      href: MAPS_LINK,
      color: "bg-accent hover:bg-accent/90",
    },
  ];

  return (
    <>
      {/* Floating Contact Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 w-12 h-12 md:w-14 md:h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${
          isOpen ? "bg-mstar-dark rotate-180" : "bg-accent glow-red"
        }`}
      >
        {isOpen ? (
          <X className="h-5 w-5 md:h-6 md:w-6 text-primary-foreground" />
        ) : (
          <MessageCircle className="h-5 w-5 md:h-6 md:w-6 text-accent-foreground" />
        )}
      </button>

      {/* Contact Options Panel */}
      {isOpen && (
        <div className="fixed bottom-20 md:bottom-24 right-4 md:right-6 z-50 w-[calc(100%-2rem)] max-w-72 bg-card rounded-2xl shadow-deep border border-border overflow-hidden animate-scale-in">
          <div className="p-3 md:p-4 hero-gradient border-b border-mstar-gray/20">
            <h3 className="text-base md:text-lg font-semibold text-primary-foreground">Contact Us</h3>
            <p className="text-xs md:text-sm text-primary-foreground/70">We're here to help!</p>
          </div>
          
          <div className="p-2 md:p-3 space-y-1 md:space-y-2">
            {contactOptions.map((option) => (
              <a
                key={option.label}
                href={option.href}
                target={option.label === "Visit Store" ? "_blank" : undefined}
                rel={option.label === "Visit Store" ? "noopener noreferrer" : undefined}
                className="flex items-center gap-3 p-2.5 md:p-3 rounded-xl hover:bg-muted transition-colors group active:scale-98"
                onClick={() => setIsOpen(false)}
              >
                <div className={`w-9 h-9 md:w-10 md:h-10 rounded-full ${option.color} flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110`}>
                  <option.icon className="h-4 w-4 md:h-5 md:w-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground text-sm">{option.label}</p>
                  <p className="text-xs text-muted-foreground truncate">{option.value}</p>
                </div>
              </a>
            ))}
          </div>

          <div className="p-2 md:p-3 bg-muted/50 border-t border-border">
            <p className="text-xs text-muted-foreground text-center">
              Mon - Sun: 10 AM - 9 PM
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default ContactButton;
