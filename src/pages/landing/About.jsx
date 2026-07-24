import { LuTarget, LuHeartHandshake, LuZap } from "react-icons/lu";

import Section from "../../components/landing/Section";
import CTAButtons from "../../components/landing/CTAButtons";

const VALUES = [
  {
    icon: LuTarget,
    tone: "blue",
    title: "Built for the counter, not the boardroom",
    text: "Every screen is designed for a busy shop — quick to learn, fast to use, and readable on a phone while you're serving a customer.",
  },
  {
    icon: LuHeartHandshake,
    tone: "green",
    title: "We start with your reality",
    text: "Paper books, mobile money, walk-in customers, unreliable power. Trackora is shaped around how hardware stores here actually work.",
  },
  {
    icon: LuZap,
    tone: "orange",
    title: "Small steps, real results",
    text: "You don't need to digitise everything on day one. Load your fastest sellers, start recording sales, and grow from there.",
  },
];

export default function About() {
  return (
    <>
      <Section
        tone="light"
        eyebrow="About Trackora"
        title="We help hardware stores swap the counter book for something that adds up."
        subtitle="Trackora started from a simple observation: hardware shops across the region run on paper and memory, and lose real money to stockouts, mismatched counts and items that quietly never turned a profit. We built a tool to close those leaks — without asking owners to become computer experts."
        center
      >
        <div className="about-values">
          {VALUES.map(({ icon: Icon, tone, title, text }) => (
            <div key={title} className="feature-card">
              <span className={`feature-card__icon feature-card__icon--${tone}`}>
                <Icon />
              </span>
              <h3 className="feature-card__title">{title}</h3>
              <p className="feature-card__desc">{text}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section tone="dark" center>
        <div className="about-cta">
          <h2 className="section__title">See if Trackora fits your shop</h2>
          <p className="section__subtitle" style={{ marginBottom: 28 }}>
            Create a free account or book a walkthrough — we'll help you get your
            first products in.
          </p>
          <CTAButtons source="about" align="center" />
        </div>
      </Section>
    </>
  );
}
