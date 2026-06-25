import { NavLink } from "react-router-dom";
import {
  FiGrid,
  FiBox,
  FiTag,
  FiTruck,
  FiArrowDownCircle,
  FiArrowUpCircle,
  FiShoppingCart,
  FiUsers,
  FiBarChart2,
  FiUserCheck,
} from "react-icons/fi";

import useAuth from "../../hooks/useAuth";
import { ALL_ROLES, ROLES } from "../../utils/constants";

// Each item declares which roles may see it.
const NAV = [
  { section: "Overview" },
  { to: "/dashboard", label: "Dashboard", icon: <FiGrid />, roles: ALL_ROLES },

  { section: "Inventory" },
  { to: "/products", label: "Products", icon: <FiBox />, roles: ALL_ROLES },
  { to: "/categories", label: "Categories", icon: <FiTag />, roles: ALL_ROLES },
  { to: "/suppliers", label: "Suppliers", icon: <FiTruck />, roles: ALL_ROLES },

  { section: "Operations" },
  { to: "/stock-in", label: "Stock In", icon: <FiArrowDownCircle />, roles: ALL_ROLES },
  { to: "/stock-out", label: "Stock Out", icon: <FiArrowUpCircle />, roles: ALL_ROLES },
  { to: "/orders", label: "Orders", icon: <FiShoppingCart />, roles: ALL_ROLES },
  { to: "/customers", label: "Customers", icon: <FiUsers />, roles: ALL_ROLES },

  { section: "Insights" },
  { to: "/reports", label: "Reports", icon: <FiBarChart2 />, roles: ALL_ROLES },

  { section: "Administration", roles: [ROLES.ADMIN] },
  { to: "/users", label: "Users", icon: <FiUserCheck />, roles: [ROLES.ADMIN] },
];

export default function Sidebar({ open, onClose }) {
  const { hasRole } = useAuth();

  return (
    <>
      {open && <div className="sidebar__backdrop" onClick={onClose} />}
      <aside className={`sidebar ${open ? "open" : ""}`}>
        <div className="sidebar__brand">
          <span className="sidebar__brand-icon">
            <FiBox />
          </span>
          Trackora
        </div>

        <nav className="sidebar__nav">
          {NAV.map((item, idx) => {
            if (item.section) {
              if (item.roles && !hasRole(item.roles)) return null;
              return (
                <div key={`sec-${idx}`} className="sidebar__section">
                  {item.section}
                </div>
              );
            }
            if (!hasRole(item.roles)) return null;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""}`
                }
                onClick={onClose}
              >
                {item.icon}
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar__footer">
          Trackora · Hardware Store
        </div>
      </aside>
    </>
  );
}
