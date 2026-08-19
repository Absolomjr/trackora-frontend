import { NavLink } from "react-router-dom";
import {
  FiGrid, FiBox, FiTag, FiTruck, FiArrowDownCircle, FiArrowUpCircle,
  FiShoppingCart, FiUsers, FiBarChart2, FiUserCheck, FiSettings,
  FiChevronLeft, FiChevronRight, FiAward, FiCheck,
} from "react-icons/fi";

import useAuth from "../../hooks/useAuth";
import { ROLES } from "../../utils/constants";
import TrackoraLogo from "../common/TrackoraLogo";

const ITEMS = {
  dashboard: { to: "/dashboard", label: "Dashboard", icon: <FiGrid /> },
  products: { to: "/products", label: "Products", icon: <FiBox /> },
  categories: { to: "/categories", label: "Categories", icon: <FiTag /> },
  suppliers: { to: "/suppliers", label: "Suppliers", icon: <FiTruck /> },
  customers: { to: "/customers", label: "Customers", icon: <FiUsers /> },
  orders: { to: "/orders", label: "Orders", icon: <FiShoppingCart /> },
  stockIn: { to: "/stock-in", label: "Stock In", icon: <FiArrowDownCircle /> },
  stockOut: { to: "/stock-out", label: "Stock Out", icon: <FiArrowUpCircle /> },
  reports: { to: "/reports", label: "Reports", icon: <FiBarChart2 /> },
  users: { to: "/users", label: "Users", icon: <FiUserCheck /> },
  profile: { to: "/profile", label: "Settings", icon: <FiSettings /> },
};

// Role → grouped navigation (mirrors the dashboard mockups).
function navFor(role) {
  if (role === ROLES.STAFF) {
    return [
      { section: "Main", items: [ITEMS.dashboard, ITEMS.orders, ITEMS.customers, ITEMS.stockIn, ITEMS.stockOut] },
    ];
  }
  if (role === ROLES.MANAGER) {
    return [
      { section: "Manager", items: [ITEMS.dashboard, ITEMS.products, ITEMS.categories, ITEMS.suppliers, ITEMS.customers, ITEMS.orders] },
      { section: "Inventory", items: [ITEMS.stockIn, ITEMS.stockOut] },
      { section: "Analytics", items: [ITEMS.reports] },
      { section: "Settings", items: [ITEMS.profile] },
    ];
  }
  // admin
  return [
    { section: "Main", items: [ITEMS.dashboard, ITEMS.products, ITEMS.categories, ITEMS.suppliers, ITEMS.customers, ITEMS.orders] },
    { section: "Inventory", items: [ITEMS.stockIn, ITEMS.stockOut] },
    { section: "Analytics", items: [ITEMS.reports] },
    { section: "Management", items: [ITEMS.users, ITEMS.profile] },
  ];
}

export default function Sidebar({ open, onClose, collapsed, onToggleCollapse }) {
  const { role } = useAuth();
  const groups = navFor(role);
  const showPro = role !== ROLES.STAFF;

  return (
    <>
      {open && <div className="sidebar__backdrop" onClick={onClose} />}
      <aside className={`sidebar ${open ? "open" : ""} ${collapsed ? "sidebar--collapsed" : ""}`}>
        <div className="sidebar__brand">
          <TrackoraLogo size={30} />
          <span className="sidebar__brand-text">Trackora</span>
        </div>

        <nav className="sidebar__nav">
          {groups.map((group) => (
            <div className="sidebar__group" key={group.section}>
              <div className="sidebar__section">{group.section}</div>
              {group.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/dashboard"}
                  className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
                  onClick={onClose}
                  title={collapsed ? item.label : undefined}
                >
                  {item.icon}
                  <span className="nav-link__label">{item.label}</span>
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        {showPro && (
          <div className="sidebar__pro">
            <div className="sidebar__pro-head">
              <FiAward /> Unlock more with <strong>Trackora Pro</strong>
            </div>
            <ul className="sidebar__pro-list">
              <li><FiCheck /> Advanced analytics</li>
              <li><FiCheck /> Automated reorder</li>
              <li><FiCheck /> Multi-location stock</li>
            </ul>
            <NavLink to="/pricing" className="sidebar__pro-btn">Upgrade now</NavLink>
          </div>
        )}

        <button className="sidebar__collapse" onClick={onToggleCollapse}>
          {collapsed ? <FiChevronRight /> : <FiChevronLeft />}
          <span className="nav-link__label">Collapse</span>
        </button>
      </aside>
    </>
  );
}
