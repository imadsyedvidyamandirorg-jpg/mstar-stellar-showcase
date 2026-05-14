import { useState } from "react";
import { MapPin, Phone, Clock, Mail, MessageCircle, ExternalLink, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const ADDRESS = "R.D Complex, Opp. Sukhadia Sweet Mart, Near Janta Kachori, Moti Bazar, Palanpur — 385001, Gujarat, India";
const PHONE_DISPLAY = "+91 93271 88556";
const PHONE_TEL = "+919327188556";
const WHATSAPP = "https://wa.me/919327188556";
const EMAIL = "mstarmobile77@gmail.com";
const MAPS_QUERY = encodeURIComponent("M Star Mobile, R.D Complex, Moti Bazar, Palanpur, Gujarat 385001");
const MAPS_LINK = `https://www.google.com/maps/search/?api=1&query=${MAPS_QUERY}`;
const MAPS_EMBED = `https://maps.google.com/maps?q=${MAPS_QUERY}&t=m&z=16&output=embed&iwloc=near`;

const schema = z.object({
  name: z.string().trim().min(1, "Name required").max(100),
  phone: z.string().trim().min(7, "Valid phone required").max(20),
  message: z.string().trim().min(5, "Message too short").max(800),
});

const Contact = () => {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", phone: "", message: "" });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast({ title: "Please check the form", description: parsed.error.issues[0]?.message, variant: "destructive" });
      return;
    }
    const text = `Hi M Star Mobile,%0A%0AName: ${encodeURIComponent(parsed.data.name)}%0APhone: ${encodeURIComponent(parsed.data.phone)}%0A%0A${encodeURIComponent(parsed.data.message)}`;
    window.open(`${WHATSAPP}?text=${text}`, "_blank", "noopener,noreferrer");
  };

  const info = [
    { icon: MapPin, title: "Visit Us", lines: [ADDRESS] },
    { icon: Phone, title: "Call / WhatsApp", lines: [PHONE_DISPLAY] },
    { icon: Clock, title: "Hours", lines: ["Mon – Sun · 10 AM – 9 PM"] },
    { icon: Mail, title: "Email", lines: [EMAIL] },
  ];

  return (
    <section id="contact" className="py-12 md:py-20 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-8 md:mb-14">
          <span className="text-accent font-medium text-xs md:text-sm uppercase tracking-wider">Get in Touch</span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mt-2 md:mt-3 mb-3 md:mb-4">
            Contact & Location
          </h2>
          <p className="text-sm md:text-base text-muted-foreground">
            Visit our store, drop us a message, or reach out on WhatsApp anytime.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 md:gap-10">
          {/* Left: info + form */}
          <div className="space-y-5 md:space-y-6">
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              {info.map((item) => (
                <div key={item.title} className="bg-card rounded-xl md:rounded-2xl p-4 md:p-5 shadow-elegant border border-border/60">
                  <div className="w-10 h-10 md:w-11 md:h-11 bg-accent/10 rounded-lg flex items-center justify-center mb-3">
                    <item.icon className="h-5 w-5 text-accent" />
                  </div>
                  <h3 className="font-semibold text-foreground text-sm md:text-base mb-1">{item.title}</h3>
                  {item.lines.map((l) => (
                    <p key={l} className="text-muted-foreground text-xs md:text-sm leading-relaxed break-words">{l}</p>
                  ))}
                </div>
              ))}
            </div>

            <form onSubmit={submit} className="bg-card rounded-2xl p-5 md:p-6 shadow-elegant border border-border/60 space-y-3">
              <h3 className="font-semibold text-foreground">Send us a message</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                <Input placeholder="Your name" value={form.name} maxLength={100} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                <Input placeholder="Phone number" value={form.phone} maxLength={20} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
              <textarea
                placeholder="How can we help?"
                value={form.message}
                maxLength={800}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full min-h-[110px] rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
              />
              <div className="flex flex-col sm:flex-row gap-2">
                <Button type="submit" className="flex-1 h-11">
                  <Send className="h-4 w-4 mr-2" /> Send via WhatsApp
                </Button>
                <a href={`tel:${PHONE_TEL}`} className="flex-1">
                  <Button type="button" variant="outline" className="w-full h-11">
                    <Phone className="h-4 w-4 mr-2" /> Call Now
                  </Button>
                </a>
              </div>
              <p className="text-[11px] text-muted-foreground text-center">
                We typically reply within store hours (10 AM – 9 PM).
              </p>
            </form>
          </div>

          {/* Right: map */}
          <div className="bg-card rounded-2xl overflow-hidden shadow-elegant border border-border/60">
            <div className="aspect-video md:aspect-[4/3] w-full">
              <iframe
                src={MAPS_EMBED}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="M Star Mobile Location"
              />
            </div>
            <div className="p-4 md:p-5 flex flex-col sm:flex-row gap-3">
              <a href={MAPS_LINK} target="_blank" rel="noopener noreferrer" className="flex-1">
                <Button className="w-full h-11">
                  <MapPin className="h-4 w-4 mr-2" /> Get Directions
                  <ExternalLink className="h-3.5 w-3.5 ml-2" />
                </Button>
              </a>
              <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="flex-1">
                <Button variant="outline" className="w-full h-11">
                  <MessageCircle className="h-4 w-4 mr-2" /> WhatsApp Us
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
