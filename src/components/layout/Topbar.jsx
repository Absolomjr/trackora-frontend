import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiMenu, FiChevronDown, FiUser, FiLock, FiLogOut, FiSearch,
  FiCalendar, FiBell, FiAlertTriangle,
} from "react-icons/fi";

import useAuth from "../../hooks/useAuth";
import { ROLES, ROLE_LABELS } from "../../utils/constants";
import reportsApi from "../../api/reportsApi";

function initials(user) {
  if (!user) return "?";
  const name = user.full_name || user.name || "";
  if (name.trim()) {
    return name.trim().split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase()).join("");
  }
  return (user.email || "?").slice(0, 2).toUpperCase();
}

function useOutside(ref, onOutside) {
  useEffect(() => {
    const onClick = (e) => { if (ref.current && !ref.current.contains(e.target)) onOutside(); };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [ref, onOutside]);
}

export default function Topbar({ onMenu }) {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [alerts, setAlerts] = useState(null);

  const menuRef = useRef(null);
  const notifRef = useRef(null);
  useOutside(menuRef, () => setMenuOpen(false));
  useOutside(notifRef, () => setNotifOpen(false));

  // Low-stock notifications (managers/admins can read the report).
  useEffect(() => {
    if (role === ROLES.STAFF) { setAlerts([]); return; }
    let active = true;
    reportsApi.lowStock()
      .then((d) => active && setAlerts(Array.isArray(d?.results) ? d.results : Array.isArray(d) ? d : []))
      .catch(() => active && setAlerts([]));
    return () => { active = false; };
  }, [role]);

  const alertCount = alerts?.length || 0;
  const displayName = user?.full_name || user?.name || user?.email || "User";

  const onSearch = (e) => {
    e.preventDefault();
    if (query.trim()) navigate(`/products?search=${encodeURIComponent(query.trim())}`);
  };

  return (
    <header className="topbar">
      <button className="topbar__menu-btn" onClick={onMenu} aria-label="Menu">
        <FiMenu />
      </button>

      <form className="topbar__search" onSubmit={onSearch}>
        <FiSearch />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products, orders, customers…"
        />
        <kbd>⌘K</kbd>
      </form>

      <div className="topbar__right">
        <span className="topbar__daterange">
          <FiCalendar /> Last 7 days
        </span>

        <div className="dropdown" ref={notifRef}>
          <button
            className="topbar__icon-btn"
            onClick={() => setNotifOpen((v) => !v)}
            aria-label="Notifications"
          >
            <FiBell />
            {alertCount > 0 && <span className="topbar__badge">{alertCount > 9 ? "9+" : alertCount}</span>}
          </button>
          {notifOpen && (
            <div className="dropdown__menu dropdown__menu--wide">
              <div className="dropdown__title">Notifications</div>
              {alertCount === 0 ? (
                <div className="dropdown__empty">You're all caught up.</div>
              ) : (
                <>
                  {alerts.slice(0, 5).map((a) => (
                    <button
                      key={a.id || a.sku}
                      className="notif"
                      onClick={() => { setNotifOpen(false); navigate("/products?low_stock=true"); }}
                    >
                      <span className="notif__icon"><FiAlertTriangle /></span>
                      <span>
                        <span className="notif__title">{a.name} is low</span>
                        <span className="notif__sub">{a.quantity} left · reorder at {a.reorder_level}</span>
                      </span>
                    </button>
                  ))}
                  <button
                    className="dropdown__item dropdown__item--center"
                    onClick={() => { setNotifOpen(false); navigate("/products?low_stock=true"); }}
                  >
                    View all low stock
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        <div className="dropdown" ref={menuRef}>
          <button className="user-chip" onClick={() => setMenuOpen((v) => !v)}>
            <span className="avatar">{initials(user)}</span>
            <span className="user-chip__meta">
              <span className="user-chip__name">{displayName}</span>
              <span className="user-chip__role">{ROLE_LABELS[role] || role}</span>
            </span>
            <FiChevronDown />
          </button>

          {menuOpen && (
            <div className="dropdown__menu">
              <button className="dropdown__item" onClick={() => { setMenuOpen(false); navigate("/profile"); }}>
                <FiUser /> My Profile
              </button>
              <button className="dropdown__item" onClick={() => { setMenuOpen(false); navigate("/change-password"); }}>
                <FiLock /> Change Password
              </button>
              <div className="dropdown__divider" />
              <button className="dropdown__item danger" onClick={() => { logout(); navigate("/login"); }}>
                <FiLogOut /> Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
