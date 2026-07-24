import { Link } from "react-router-dom";
import { LuBoxes } from "react-icons/lu";

const COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "/#features" },
      { label: "How it works", href: "/#how" },
      { label: "Pricing", to: "/pricing" },
      { label: "Book a demo", to: "/demo" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", to: "/about" },
      { label: "Contact", to: "/contact" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Contact us", to: "/contact" },
      { label: "Sign in", to: "/login" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy policy", to: "/privacy" },
      { label: "Terms of service", to: "/terms" },
    ],
  },
];

export default function LandingFooter() {
  return (
    <footer className="lfooter">
      <div className="lfooter__inner">
        <div className="lfooter__brand-col">
          <span className="lfooter__brand">
            <span className="lnav__logo"><LuBoxes /></span>
            Trackora
          </span>
          <p className="lfooter__tagline">
            Inventory software built for hardware stores.
          </p>
        </div>

        <div className="lfooter__cols">
          {COLUMNS.map((col) => (
            <div key={col.title} className="lfooter__col">
              <h4 className="lfooter__col-title">{col.title}</h4>
              <ul className="lfooter__list">
                {col.links.map((l) => (
                  <li key={l.label}>
                    {l.to ? (
                      <Link to={l.to} className="lfooter__link">{l.label}</Link>
                    ) : (
                      <a href={l.href} className="lfooter__link">{l.label}</a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="lfooter__bottom">
        <span>© 2026 Trackora. Built for hardware stores.</span>
      </div>
    </footer>
  );
}
