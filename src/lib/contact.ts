// Central business contact info — change here to update across the site.
export const BUSINESS = {
  name: "M Star Mobile",
  phoneDisplay: "080002 96786",
  phoneTel: "+918000296786",
  whatsappNumber: "918000296786",
  whatsapp: "https://wa.me/918000296786",
  email: "mstarmobile77@gmail.com",
  hours: "Mon – Sun · 10 AM – 9 PM",
  address:
    "R.D Complex, Moti Bazaar Rd, opp. Sukhadia Sweet Mart, near Janta Kachori, Palliviya Nagar, Parshvanath Nagar, Palanpur, Gujarat 385001",
  mapsQuery: encodeURIComponent(
    "M Star Mobile, R.D Complex, Moti Bazaar Rd, Palliviya Nagar, Palanpur, Gujarat 385001"
  ),
  socials: {
    instagram: "https://www.instagram.com/mstar_mobile",
    facebook: "https://www.facebook.com/mstarmobile7777/",
    youtube: "https://www.youtube.com/@mstar_mobile",
    telegram: "https://t.me/mstarmobile",
  },
};

export const MAPS_LINK = `https://www.google.com/maps/search/?api=1&query=${BUSINESS.mapsQuery}`;
export const MAPS_EMBED = `https://maps.google.com/maps?q=${BUSINESS.mapsQuery}&t=m&z=16&output=embed&iwloc=near`;