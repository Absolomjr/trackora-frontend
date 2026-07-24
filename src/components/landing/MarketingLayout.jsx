import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";

import { LeadModalProvider } from "./LeadModalContext";
import LandingNav from "./LandingNav";
import LandingFooter from "./LandingFooter";
import "../../styles/landing.css";

/**
 * Shell for every public marketing page: sticky nav, footer, and the shared
 * lead-capture modal. Scrolls to the top on route change (except when a hash
 * anchor is present, which the browser handles).
 */
export default function MarketingLayout() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) window.scrollTo(0, 0);
  }, [pathname, hash]);

  return (
    <LeadModalProvider>
      <div className="landing">
        <LandingNav />
        <main>
          <Outlet />
        </main>
        <LandingFooter />
      </div>
    </LeadModalProvider>
  );
}
