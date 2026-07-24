import { LuCheck } from "react-icons/lu";

import Section from "../../components/landing/Section";
import CTAButtons from "../../components/landing/CTAButtons";
import FaqItem from "../../components/landing/FaqItem";
import { FAQS } from "./content";

const INCLUDED = [
  "Unlimited products, categories and suppliers",
  "Unlimited staff accounts — no per-user charge",
  "Sales, orders and the stock in/out ledger",
  "Dashboard, reports, profit and low-stock alerts",
  "Role-based access for admin, manager and staff",
  "Automatic backups and encrypted connections",
  "Setup help and staff training",
  "Support by phone, WhatsApp and email",
];

const PRICING_FAQS = FAQS.filter((f) =>
  /cost|internet|branch|phone/i.test(f.q)
);

export default function Pricing() {
  return (
    <>
      <Section
        tone="light"
        eyebrow="Pricing"
        title="One simple price per shop."
        subtitle="No setup fee. No charge per user. Add as many attendants as you need. Start free while you set up and test it with your own products."
        center
      >
        <div className="pricing-card">
          <div className="pricing-card__head">
            <span className="pricing-card__badge">Per shop</span>
            <div className="pricing-card__price">
              <span className="pricing-card__amount">Let's talk</span>
              <span className="pricing-card__period">billed monthly</span>
            </div>
            <p className="pricing-card__note">
              We quote based on your shop size so you only pay for what fits. Book
              a demo and we'll give you a clear number — no obligation.
            </p>
          </div>
          <ul className="pricing-card__list">
            {INCLUDED.map((item) => (
              <li key={item}><LuCheck /> {item}</li>
            ))}
          </ul>
          <CTAButtons source="pricing" align="center" />
        </div>
      </Section>

      <Section tone="dark" title="Pricing questions" center>
        <div className="faq-list">
          {PRICING_FAQS.map((f, i) => (
            <FaqItem key={f.q} q={f.q} a={f.a} defaultOpen={i === 0} />
          ))}
        </div>
      </Section>
    </>
  );
}
