import { LEAD_KIND } from "../../api/leadsApi";
import { useLeadModal } from "./leadModal";

/**
 * The primary/secondary CTA pair used across the marketing site. `source`
 * names the section it sits in so we can see which part of the page converts.
 */
export default function CTAButtons({ source = "", align = "start", size = "lg" }) {
  const { openLead } = useLeadModal();
  const btn = size === "lg" ? "landing-btn landing-btn--lg" : "landing-btn";

  return (
    <div className={`cta-group cta-group--${align}`}>
      <button
        className={`${btn} landing-btn--primary`}
        onClick={() => openLead(LEAD_KIND.SIGNUP, source)}
      >
        Create your free account
      </button>
      <button
        className={`${btn} landing-btn--secondary`}
        onClick={() => openLead(LEAD_KIND.DEMO, source)}
      >
        Book a live demo
      </button>
    </div>
  );
}
