import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LuMenu, LuX } from "react-icons/lu";

import useAuth from "../../hooks/useAuth";
import TrackoraLogo from "../common/TrackoraLogo";

const LINKS = [
  { href: "/#features", label: "Features" },
  { href: "/#how", label: "How it works" },
  { href: "/#faq", label: "FAQ" },
  { href: "/pricing", label: "Pricing" },
];

export default function LandingNav() {
  const { isAuthenticated } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className={`lnav ${scrolled ? "lnav--scrolled" : ""}`}>
      <div className="lnav__inner">
        <Link to="/" className="lnav__brand" onClick={closeMenu}>
          <TrackoraLogo size={30} />
          Trackora
        </Link>

        <nav className="lnav__links">
          {LINKS.map((l) =>
            l.href.includes("#") ? (
              <a key={l.href} href={l.href} className="lnav__link">{l.label}</a>
            ) : (
              <Link key={l.href} to={l.href} className="lnav__link">{l.label}</Link>
            )
          )}
        </nav>

        <div className="lnav__actions">
          {isAuthenticated ? (
            <Link to="/dashboard" className="landing-btn landing-btn--primary">
              Go to dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" className="lnav__signin">Sign in</Link>
              <Link to="/signup" className="landing-btn landing-btn--primary">
                Create account
              </Link>
            </>
          )}
        </div>

        <button
          className="lnav__menu-btn"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          {menuOpen ? <LuX /> : <LuMenu />}
        </button>
      </div>

      {menuOpen && (
        <div className="lnav__mobile">
          {LINKS.map((l) =>
            l.href.includes("#") ? (
              <a key={l.href} href={l.href} className="lnav__mobile-link" onClick={closeMenu}>
                {l.label}
              </a>
            ) : (
              <Link key={l.href} to={l.href} className="lnav__mobile-link" onClick={closeMenu}>
                {l.label}
              </Link>
            )
          )}
          <div className="lnav__mobile-actions">
            {isAuthenticated ? (
              <Link to="/dashboard" className="landing-btn landing-btn--primary landing-btn--lg" onClick={closeMenu}>
                Go to dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="landing-btn landing-btn--secondary landing-btn--lg" onClick={closeMenu}>
                  Sign in
                </Link>
                <Link to="/signup" className="landing-btn landing-btn--primary landing-btn--lg" onClick={closeMenu}>
                  Create account
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
