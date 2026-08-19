import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";

/**
 * Primary/secondary CTA pair used across the marketing site.
 * Primary → create-account (request access) page; secondary → book a demo.
 */
export default function CTAButtons({ align = "start", size = "lg" }) {
  const btn = size === "lg" ? "landing-btn landing-btn--lg" : "landing-btn";
  return (
    <div className={`cta-group cta-group--${align}`}>
      <Link to="/signup" className={`${btn} landing-btn--primary`}>
        Start free trial <FiArrowRight />
      </Link>
      <Link to="/demo" className={`${btn} landing-btn--secondary`}>
        Book a demo
      </Link>
    </div>
  );
}
