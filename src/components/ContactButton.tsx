import { Phone, Mail, MessageCircle, MapPin, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const ContactButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  const contactOptions = [
    {
      icon: Phone,
      label: "Call Us",
      value: "080002 96786",
      href: "tel:08000296786",
      color: "bg-green-500 hover:bg-green-600",
    },
    {
      icon: MessageCircle,
      label: "WhatsApp",
      value: "+91 8888 0808 46",
      href: "https://wa.me/918888080846",
      color: "bg-emerald-500 hover:bg-emerald-600",
    },
    {
      icon: Mail,
      label: "Email",
      value: "mstarmobile77@gmail.com",
      href: "mailto:mstarmobile77@gmail.com",
      color: "bg-blue-500 hover:bg-blue-600",
    },
    {
      icon: MapPin,
      label: "Visit Store",
      value: "Get Directions",
      href: "https://maps.google.com/?q=R.D+Complex,+Moti+Bazaar+Rd,+Palanpur,+Gujarat+385001",
      color: "bg-accent hover:bg-accent/90",
    },
  ];

  return (
    <>
      {/* Floating Contact Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${
          isOpen ? "bg-mstar-dark rotate-180" : "bg-accent glow-red"
        }`}
      >
        {isOpen ? (
          <X className="h-6 w-6 text-primary-foreground" />
        ) : (
          <MessageCircle className="h-6 w-6 text-accent-foreground" />
        )}
      </button>

      {/* Contact Options Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-72 bg-card rounded-2xl shadow-deep border border-border overflow-hidden animate-scale-in">
          <div className="p-4 hero-gradient border-b border-mstar-gray/20">
            <h3 className="text-lg font-semibold text-primary-foreground">Contact Us</h3>
            <p className="text-sm text-primary-foreground/70">We're here to help!</p>
          </div>
          
          <div className="p-3 space-y-2">
            {contactOptions.map((option) => (
              <a
                key={option.label}
                href={option.href}
                target={option.label === "Visit Store" ? "_blank" : undefined}
                rel={option.label === "Visit Store" ? "noopener noreferrer" : undefined}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors group"
              >
                <div className={`w-10 h-10 rounded-full ${option.color} flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110`}>
                  <option.icon className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground text-sm">{option.label}</p>
                  <p className="text-xs text-muted-foreground truncate">{option.value}</p>
                </div>
              </a>
            ))}
          </div>

          <div className="p-3 bg-muted/50 border-t border-border">
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
