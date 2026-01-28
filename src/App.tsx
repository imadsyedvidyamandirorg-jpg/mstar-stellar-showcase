import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import DashboardLayout from "./layouts/DashboardLayout";
import DashboardHome from "./pages/dashboard/DashboardHome";
import ReelsPage from "./pages/dashboard/ReelsPage";
import PostsPage from "./pages/dashboard/PostsPage";
import NotificationsPage from "./pages/dashboard/NotificationsPage";
import OffersPage from "./pages/dashboard/OffersPage";
import StorePage from "./pages/dashboard/StorePage";
import CartPage from "./pages/dashboard/CartPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <CartProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<DashboardHome />} />
              <Route path="reels" element={<ReelsPage />} />
              <Route path="posts" element={<PostsPage />} />
              <Route path="notifications" element={<NotificationsPage />} />
              <Route path="offers" element={<OffersPage />} />
              <Route path="store" element={<StorePage />} />
              <Route path="cart" element={<CartPage />} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </CartProvider>
  </QueryClientProvider>
);

export default App;
