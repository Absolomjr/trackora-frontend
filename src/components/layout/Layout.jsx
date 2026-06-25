import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

// Maps a path prefix to the page title shown in the top bar.
const TITLES = [
  ["/dashboard", "Dashboard"],
  ["/products", "Products"],
  ["/categories", "Categories"],
  ["/suppliers", "Suppliers"],
  ["/stock-in", "Stock In"],
  ["/stock-out", "Stock Out"],
  ["/orders", "Orders"],
  ["/customers", "Customers"],
  ["/reports", "Reports"],
  ["/users", "User Management"],
  ["/profile", "My Profile"],
  ["/change-password", "Change Password"],
];

function titleFor(pathname) {
  const match = TITLES.find(([prefix]) => pathname.startsWith(prefix));
  return match ? match[1] : "Trackora";
}

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { pathname } = useLocation();

  return (
    <div className="app-shell">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="app-main">
        <Topbar title={titleFor(pathname)} onMenu={() => setSidebarOpen(true)} />
        <main className="app-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
