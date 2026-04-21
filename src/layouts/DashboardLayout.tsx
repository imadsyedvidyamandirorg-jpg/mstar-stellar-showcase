import { Outlet } from "react-router-dom";
import DashboardNav from "@/components/DashboardNav";
import ContactButton from "@/components/ContactButton";
import Footer from "@/components/Footer";

const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-background">
      <DashboardNav />
      <main className="container mx-auto px-4 py-4 md:py-8 pb-20 md:pb-8">
        <Outlet />
      </main>
      <Footer />
      <ContactButton />
    </div>
  );
};

export default DashboardLayout;
