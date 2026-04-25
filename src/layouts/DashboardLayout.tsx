import { Outlet } from "react-router-dom";
import DashboardNav from "@/components/DashboardNav";
import Footer from "@/components/Footer";
import ChatBot from "@/components/ChatBot";
import { useWebNotifications } from "@/hooks/use-web-notifications";

const DashboardLayout = () => {
  useWebNotifications();
  return (
    <div className="min-h-screen bg-background">
      <DashboardNav />
      <main className="container mx-auto px-4 py-4 md:py-8 pb-20 md:pb-8">
        <Outlet />
      </main>
      <Footer showMap />

      <ChatBot />
    </div>
  );
};

export default DashboardLayout;
