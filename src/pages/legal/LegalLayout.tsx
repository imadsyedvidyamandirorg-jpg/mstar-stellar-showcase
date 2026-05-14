import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import DashboardNav from "@/components/DashboardNav";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

interface Props {
  title: string;
  updated?: string;
  children: ReactNode;
}

const LegalLayout = ({ title, updated = "May 2026", children }: Props) => {
  return (
    <div className="min-h-screen bg-background">
      <DashboardNav />
      <main className="container mx-auto px-4 py-8 md:py-12 pb-24 md:pb-12">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-accent mb-5"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>
          <div className="bg-card border border-border/60 rounded-2xl md:rounded-3xl shadow-elegant p-6 md:p-10">
            <p className="text-[11px] uppercase tracking-[0.2em] text-accent font-semibold mb-2">
              MStar Mobile · Legal
            </p>
            <h1 className="text-2xl md:text-4xl font-bold text-foreground tracking-tight">
              {title}
            </h1>
            <p className="text-xs text-muted-foreground mt-2">Last updated: {updated}</p>
            <div className="mt-6 md:mt-8 prose prose-sm md:prose-base max-w-none text-foreground/85 [&_h2]:text-foreground [&_h2]:font-semibold [&_h2]:text-lg [&_h2]:md:text-xl [&_h2]:mt-8 [&_h2]:mb-3 [&_h3]:text-foreground [&_h3]:font-semibold [&_h3]:text-base [&_h3]:mt-5 [&_h3]:mb-2 [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_li]:text-foreground/80">
              {children}
            </div>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default LegalLayout;