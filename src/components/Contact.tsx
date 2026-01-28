import { MapPin, Phone, Clock, Mail, Instagram, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const Contact = () => {
  const contactInfo = [
    {
      icon: MapPin,
      title: "Visit Us",
      content: "R.D Complex, Moti Bazaar Rd",
      subContent: "Palanpur, Gujarat 385001",
    },
    {
      icon: Phone,
      title: "Call Us",
      content: "080002 96786",
      subContent: "+91 8888 0808 46",
    },
    {
      icon: Clock,
      title: "Hours",
      content: "Mon - Sun",
      subContent: "10 AM - 9 PM",
    },
    {
      icon: Mail,
      title: "Email",
      content: "mstarmobile77",
      subContent: "@gmail.com",
    },
  ];

  return (
    <section id="contact" className="py-12 md:py-20 bg-secondary">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 md:mb-16">
          <span className="text-accent font-medium text-xs md:text-sm uppercase tracking-wider">Get in Touch</span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mt-2 md:mt-3 mb-3 md:mb-4">
            Contact & Location
          </h2>
          <p className="text-sm md:text-base text-muted-foreground">
            Visit our store or reach out to us anytime.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 md:gap-12">
          {/* Contact Info */}
          <div className="grid grid-cols-2 gap-3 md:gap-6">
            {contactInfo.map((item) => (
              <div
                key={item.title}
                className="bg-card rounded-xl md:rounded-2xl p-4 md:p-6 shadow-elegant hover:shadow-deep transition-all duration-300"
              >
                <div className="w-10 h-10 md:w-12 md:h-12 bg-accent/10 rounded-lg md:rounded-xl flex items-center justify-center mb-3 md:mb-4">
                  <item.icon className="h-5 w-5 md:h-6 md:w-6 text-accent" />
                </div>
                <h3 className="font-semibold text-foreground text-sm md:text-base mb-1 md:mb-2">{item.title}</h3>
                <p className="text-foreground font-medium text-xs md:text-base">{item.content}</p>
                <p className="text-muted-foreground text-xs md:text-sm">{item.subContent}</p>
              </div>
            ))}
          </div>

          {/* Map */}
          <div className="bg-card rounded-xl md:rounded-2xl overflow-hidden shadow-elegant">
            <div className="aspect-video md:aspect-[4/3] w-full">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3645.8983655893!2d72.43677!3d24.17245!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395ce972f02e71c5%3A0xf2d1e3c3c3c3c3c3!2sMoti%20Bazaar%20Rd%2C%20Palanpur%2C%20Gujarat%20385001!5e0!3m2!1sen!2sin!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="MStar Mobile Location"
              />
            </div>
            <div className="p-4 md:p-6">
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                <a
                  href="https://maps.google.com/?q=R.D+Complex,+Moti+Bazaar+Rd,+Palanpur,+Gujarat+385001"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1"
                >
                  <Button variant="default" className="w-full h-11 md:h-12 text-sm md:text-base">
                    <MapPin className="h-4 w-4 mr-2" />
                    Get Directions
                    <ExternalLink className="h-3 w-3 md:h-4 md:w-4 ml-2" />
                  </Button>
                </a>
                <a
                  href="https://www.instagram.com/mstar_mobile"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1"
                >
                  <Button variant="outline" className="w-full h-11 md:h-12 text-sm md:text-base">
                    <Instagram className="h-4 w-4 mr-2" />
                    Follow Us
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
