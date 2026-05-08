import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const brands = [
  "Apple",
  "Samsung",
  "OnePlus",
  "Xiaomi",
  "Realme",
  "Vivo",
  "OPPO",
  "Nothing",
  "Sony",
  "JBL",
];

const BrandStrip = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base md:text-xl font-semibold text-foreground">Top Brands</h2>
        <Link to="/dashboard/store" className="text-xs md:text-sm text-accent font-medium hover:underline">
          View All
        </Link>
      </div>
      <div className="flex items-stretch gap-2 md:gap-3 overflow-x-auto no-scrollbar -mx-4 px-4 md:mx-0 md:px-0 pb-1">
        {brands.map((b, i) => (
          <motion.div
            key={b}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.04 * i }}
            className="flex-shrink-0"
          >
            <Link
              to={`/dashboard/store?brand=${encodeURIComponent(b)}`}
              className="flex items-center justify-center h-14 md:h-16 px-4 md:px-6 rounded-xl bg-card border border-border shadow-elegant hover:border-accent hover:shadow-deep transition-all"
            >
              <span className="font-display text-sm md:text-base font-semibold text-foreground tracking-wide">
                {b}
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default BrandStrip;