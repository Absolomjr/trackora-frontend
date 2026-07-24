import { LuCheck } from "react-icons/lu";

import Section from "../../components/landing/Section";
import LeadForm from "../../components/landing/LeadForm";
import { LEAD_KIND } from "../../api/leadsApi";

const POINTS = [
  "A 20-minute walkthrough of the exact features your shop would use",
  "Answers on pricing, multi-branch and getting your stock imported",
  "No pressure — see it working, then decide",
];

export default function Demo() {
  return (
    <Section
      tone="light"
      eyebrow="Book a demo"
      title="See Trackora working on your kind of shop."
      center
    >
      <div className="demo-layout">
        <div className="demo-copy">
          <p className="demo-copy__lead">
            Tell us a little about your store and we'll set up a live
            walkthrough at a time that suits you.
          </p>
          <ul className="demo-points">
            {POINTS.map((p) => (
              <li key={p}><LuCheck /> {p}</li>
            ))}
          </ul>
        </div>
        <div className="demo-form-card">
          <LeadForm kind={LEAD_KIND.DEMO} source="demo-page" />
        </div>
      </div>
    </Section>
  );
}
