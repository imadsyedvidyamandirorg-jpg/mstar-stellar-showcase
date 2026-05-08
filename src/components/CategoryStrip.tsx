import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Smartphone,
  Headphones,
  Watch,
  Speaker,
  Battery,
  Tv,
  Cable,
  Camera,
  Gamepad2,
  Tablet,
} from "lucide-react";

const categories = [
  { name: "Phones", icon: Smartphone, href: "/dashboard/store?cat=smartphones" },
  { name: "Earbuds", icon: Headphones, href: "/dashboard/store?cat=accessories" },
  { name: "Watches", icon: Watch, href: "/dashboard/store?cat=accessories" },
  { name: "Speakers", icon: Speaker, href: "/dashboard/store?cat=accessories" },
  { name: "Chargers", icon: Battery, href: "/dashboard/store?cat=accessories" },
  { name: "Cables", icon: Cable, href: "/dashboard/store?cat=accessories" },
  { name: "TVs", icon: Tv, href: "/dashboard/store?cat=electronics" },
  { name: "Cameras", icon: Camera, href: "/dashboard/store?cat=electronics" },
  { name: "Gaming", icon: Gamepad2, href: "/dashboard/store?cat=electronics" },
  { name: "Tablets", icon: Tablet, href: "/dashboard/store?cat=electronics" },
];

const CategoryStrip = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
      className="bg-card rounded-2xl shadow-elegant border border-border/50 px-2 py-3 md:px-4 md:py-4"
    >
      <div className="flex items-center justify-between mb-2 px-2">
        <h3 className="text-sm md:text-base font-semibold text-foreground">Shop by Category</h3>
        <Link to="/dashboard/store" className="text-xs md:text-sm text-accent font-medium hover:underline">
          View All
        </Link>
      </div>
      <div className="flex items-stretch gap-2 md:gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory -mx-1 px-1 pb-1">
        {categories.map((c, i) => (
          <motion.div
            key={c.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.05 * i }}
            className="snap-start flex-shrink-0"
          >
            <Link
              to={c.href}
              className="group flex flex-col items-center gap-1.5 md:gap-2 w-16 md:w-20"
            >
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-background border border-border flex items-center justify-center transition-all group-hover:border-accent group-hover:shadow-[0_0_0_3px_hsl(var(--accent)/0.15)] group-hover:-translate-y-0.5">
                <c.icon className="h-6 w-6 md:h-7 md:w-7 text-foreground group-hover:text-accent transition-colors" strokeWidth={1.6} />
              </div>
              <span className="text-[11px] md:text-xs font-medium text-foreground text-center leading-tight line-clamp-2">
                {c.name}
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default CategoryStrip;