import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiMenu, FiChevronDown, FiUser, FiLock, FiLogOut } from "react-icons/fi";

import useAuth from "../../hooks/useAuth";

function initials(user) {
  if (!user) return "?";
  const name = user.full_name || user.name || "";
  if (name.trim()) {
    return name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase())
      .join("");
  }
  return (user.email || "?").slice(0, 2).toUpperCase();
}

export default function Topbar({ title, onMenu }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const displayName = user?.full_name || user?.name || user?.email || "User";

  return (
    <header className="topbar">
      <div className="row gap-sm">
        <button className="topbar__menu-btn" onClick={onMenu} aria-label="Menu">
          <FiMenu />
        </button>
        <span className="topbar__title">{title}</span>
      </div>

      <div className="topbar__right">
        <div className="dropdown" ref={ref}>
          <button className="user-chip" onClick={() => setMenuOpen((v) => !v)}>
            <span className="avatar">{initials(user)}</span>
            <span className="user-chip__meta">
              <span className="user-chip__name">{displayName}</span>
              <span className="user-chip__role">{user?.role}</span>
            </span>
            <FiChevronDown />
          </button>

          {menuOpen && (
            <div className="dropdown__menu">
              <button
                className="dropdown__item"
                onClick={() => {
                  setMenuOpen(false);
                  navigate("/profile");
                }}
              >
                <FiUser /> My Profile
              </button>
              <button
                className="dropdown__item"
                onClick={() => {
                  setMenuOpen(false);
                  navigate("/change-password");
                }}
              >
                <FiLock /> Change Password
              </button>
              <div className="dropdown__divider" />
              <button
                className="dropdown__item danger"
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
              >
                <FiLogOut /> Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
