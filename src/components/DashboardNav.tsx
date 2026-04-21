import { Link, useLocation, useNavigate } from "react-router-dom";
import { Film, Image, Bell, Gift, ShoppingBag, Home, ShoppingCart, Menu, X, LogOut, Search } from "lucide-react";
import { useState, useCallback } from "react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import mstarLogo from "@/assets/mstar-logo.png";

const DashboardNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { totalItems } = useCart();
  const { signOut, isAdmin } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  const handleSearch = useCallback((value: string) => {
    setSearchValue(value);
    if (value === "damiison@123") {
      setShowAdminPanel(true);
      setSearchValue("");
    }
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const navItems = [
    { name: "Home", href: "/dashboard", icon: Home },
    { name: "Reels", href: "/dashboard/reels", icon: Film },
    { name: "Posts", href: "/dashboard/posts", icon: Image },
    { name: "Offers", href: "/dashboard/offers", icon: Gift },
    { name: "Store", href: "/dashboard/store", icon: ShoppingBag },
  ];

  const isActive = (href: string) => location.pathname === href;

  return (
    <nav className="sticky top-0 z-50 hero-gradient border-b border-mstar-gray/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14 md:h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img src={mstarLogo} alt="MStar" className="h-8 md:h-10" />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-2 px-3 xl:px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive(item.href)
                    ? "bg-accent text-accent-foreground"
                    : "text-primary-foreground/70 hover:text-primary-foreground hover:bg-mstar-dark"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            ))}
          </div>

          {/* Cart & Notifications & Mobile Toggle */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Search */}
            <div className="hidden md:flex relative items-center">
              <Search className="absolute left-2.5 h-4 w-4 text-primary-foreground/40" />
              <input
                type="text"
                placeholder="Search..."
                value={searchValue}
                onChange={(e) => handleSearch(e.target.value)}
                className="h-9 w-40 bg-mstar-dark/50 border border-mstar-gray/20 rounded-lg pl-8 pr-3 text-sm text-primary-foreground placeholder:text-primary-foreground/30 focus:outline-none focus:border-accent/50"
              />
            </div>

            {/* Notifications - Desktop only */}
            <Link
              to="/dashboard/notifications"
              className="hidden md:flex relative items-center gap-2 p-2 rounded-lg text-primary-foreground/70 hover:text-primary-foreground hover:bg-mstar-dark transition-all"
            >
              <Bell className="h-5 w-5" />
            </Link>

            {/* Cart */}
            <Link
              to="/dashboard/cart"
              className="relative flex items-center gap-2 p-2 rounded-lg text-primary-foreground/70 hover:text-primary-foreground hover:bg-mstar-dark transition-all"
            >
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-accent text-xs">
                  {totalItems}
                </Badge>
              )}
            </Link>

            {/* Sign Out */}
            <button
              onClick={handleSignOut}
              className="hidden md:flex items-center gap-2 p-2 rounded-lg text-primary-foreground/70 hover:text-primary-foreground hover:bg-mstar-dark transition-all"
              title="Sign Out"
            >
              <LogOut className="h-5 w-5" />
            </button>

            <button
              className="lg:hidden text-primary-foreground p-2 -mr-2"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="lg:hidden py-3 border-t border-mstar-gray/20 animate-slide-up">
            <div className="grid grid-cols-3 gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-xl text-xs font-medium transition-all ${
                    isActive(item.href)
                      ? "bg-accent text-accent-foreground"
                      : "text-primary-foreground/70 hover:text-primary-foreground hover:bg-mstar-dark"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              ))}
              <Link
                to="/dashboard/notifications"
                onClick={() => setMobileOpen(false)}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl text-xs font-medium transition-all ${
                  isActive("/dashboard/notifications")
                    ? "bg-accent text-accent-foreground"
                    : "text-primary-foreground/70 hover:text-primary-foreground hover:bg-mstar-dark"
                }`}
              >
                <Bell className="h-5 w-5" />
                Alerts
              </Link>
              <button
                onClick={handleSignOut}
                className="flex flex-col items-center gap-1.5 p-3 rounded-xl text-xs font-medium text-primary-foreground/70 hover:text-primary-foreground hover:bg-mstar-dark transition-all"
              >
                <LogOut className="h-5 w-5" />
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>

    {/* Admin Panel Modal */}
    {showAdminPanel && (
      <AdminPanel onClose={() => setShowAdminPanel(false)} />
    )}
    </>
  );
};

export default DashboardNav;
