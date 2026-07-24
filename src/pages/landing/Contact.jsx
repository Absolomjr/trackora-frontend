import { LuMail, LuPhone, LuMessageCircle } from "react-icons/lu";

import Section from "../../components/landing/Section";
import LeadForm from "../../components/landing/LeadForm";
import { LEAD_KIND } from "../../api/leadsApi";

const CHANNELS = [
  { icon: LuMail, label: "Email", value: "hello@trackora.app", href: "mailto:hello@trackora.app" },
  { icon: LuPhone, label: "Phone", value: "+256 700 000 000", href: "tel:+256700000000" },
  { icon: LuMessageCircle, label: "WhatsApp", value: "Chat with us", href: "https://wa.me/256700000000" },
];

export default function Contact() {
  return (
    <Section
      tone="light"
      eyebrow="Contact"
      title="Get in touch."
      subtitle="Questions about Trackora, pricing or getting set up? Send us a message and we'll get back to you during business hours."
      center
    >
      <div className="demo-layout">
        <div className="demo-copy">
          <div className="contact-channels">
            {CHANNELS.map(({ icon: Icon, label, value, href }) => (
              <a key={label} href={href} className="contact-channel">
                <span className="contact-channel__icon"><Icon /></span>
                <span>
                  <span className="contact-channel__label">{label}</span>
                  <span className="contact-channel__value">{value}</span>
                </span>
              </a>
            ))}
          </div>
        </div>
        <div className="demo-form-card">
          <LeadForm kind={LEAD_KIND.DEMO} source="contact" ctaLabel="Send message" />
        </div>
      </div>
    </Section>
  );
}
