import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Scrolls window to top whenever the route pathname changes.
 * Fixes the "page opens at footer" issue caused by browser scroll restoration.
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);

  return null;
};

export default ScrollToTop;