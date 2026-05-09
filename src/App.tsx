import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import AuthPage from "./pages/AuthPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import NotFound from "./pages/NotFound";
import DashboardLayout from "./layouts/DashboardLayout";
import DashboardHome from "./pages/dashboard/DashboardHome";
import ReelsPage from "./pages/dashboard/ReelsPage";
import PostsPage from "./pages/dashboard/PostsPage";
import NotificationsPage from "./pages/dashboard/NotificationsPage";
import OffersPage from "./pages/dashboard/OffersPage";
import StorePage from "./pages/dashboard/StorePage";
import CartPage from "./pages/dashboard/CartPage";
import ProductPage from "./pages/dashboard/ProductPage";
import VirtualTourPage from "./pages/dashboard/VirtualTourPage";
import OrdersPage from "./pages/dashboard/OrdersPage";
import ScrollToTop from "./components/ScrollToTop";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CartProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<DashboardHome />} />
              <Route path="reels" element={<ReelsPage />} />
              <Route path="posts" element={<PostsPage />} />
              <Route path="notifications" element={<NotificationsPage />} />
              <Route path="offers" element={<OffersPage />} />
              <Route path="store" element={<StorePage />} />
              <Route path="cart" element={<CartPage />} />
              <Route path="product/:id" element={<ProductPage />} />
              <Route path="virtual-tour" element={<VirtualTourPage />} />
              <Route path="orders" element={<OrdersPage />} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
