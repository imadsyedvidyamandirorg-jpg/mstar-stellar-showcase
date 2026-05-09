import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const categories = [
  { name: "Earbuds", img: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=200&h=200&fit=crop", cat: "accessories" },
  { name: "Watches", img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop", cat: "accessories" },
  { name: "Speakers", img: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=200&h=200&fit=crop", cat: "accessories" },
  { name: "Headphones", img: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=200&h=200&fit=crop", cat: "accessories" },
  { name: "Powerbanks", img: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=200&h=200&fit=crop", cat: "accessories" },
  { name: "Drones", img: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=200&h=200&fit=crop", cat: "electronics" },
  { name: "Hair Dryer", img: "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=200&h=200&fit=crop", cat: "electronics" },
  { name: "Gaming", img: "https://images.unsplash.com/photo-1592840496694-26d035b52b48?w=200&h=200&fit=crop", cat: "electronics" },
  { name: "Tablets", img: "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=200&h=200&fit=crop", cat: "electronics" },
];

const CategoryStrip = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
      className="bg-card rounded-2xl shadow-elegant border border-border/50 px-2 py-3 md:px-4 md:py-4"
    >
      <div className="flex items-center justify-between mb-3 px-2">
        <h3 className="text-sm md:text-base font-semibold text-foreground">Shop by Category</h3>
        <Link to="/dashboard/store" className="text-xs md:text-sm text-accent font-medium hover:underline">
          View All
        </Link>
      </div>
      <div className="flex items-stretch gap-3 md:gap-5 overflow-x-auto no-scrollbar snap-x snap-mandatory -mx-1 px-1 pb-1">
        {categories.map((c, i) => (
          <motion.div
            key={c.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.05 * i }}
            className="snap-start flex-shrink-0"
          >
            <Link
              to={`/dashboard/store?cat=${c.cat}`}
              className="group flex flex-col items-center gap-1.5 md:gap-2 w-16 md:w-20"
            >
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden bg-background border border-border transition-all group-hover:border-accent group-hover:shadow-[0_0_0_3px_hsl(var(--accent)/0.15)] group-hover:-translate-y-0.5">
                <img src={c.img} alt={c.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
              </div>
              <span className="text-[11px] md:text-xs font-medium text-foreground text-center leading-tight">
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
