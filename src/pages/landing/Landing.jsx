import { LuArrowRight, LuCheck } from "react-icons/lu";

import heroImage from "../../assets/hero-team.jpg";
import Hero from "../../components/landing/Hero";
import Section from "../../components/landing/Section";
import ProductPreview from "../../components/landing/ProductPreview";
import FaqItem from "../../components/landing/FaqItem";
import CTAButtons from "../../components/landing/CTAButtons";
import {
  TRUST_ITEMS,
  PROBLEM,
  SOLUTION,
  CLUSTERS,
  STEPS,
  TESTIMONIAL,
  FAQS,
  FINAL_CTA,
} from "./content";

export default function Landing() {
  return (
    <>
      <Hero />

          {/* Trust bar */}
          <div className="trustbar">
            <div className="trustbar__inner">
              {TRUST_ITEMS.map((t) => (
                <span key={t} className="trustbar__item">
                  <LuCheck /> {t}
                </span>
              ))}
            </div>
          </div>

          {/* Problem */}
          <Section
            tone="light"
            eyebrow={PROBLEM.label}
            title={PROBLEM.headline}
            subtitle={PROBLEM.subheadline}
            center
          >
            <div className="problem-grid">
              {PROBLEM.items.map(({ icon: Icon, title, text }) => (
                <div key={title} className="problem-card">
                  <span className="problem-card__icon"><Icon /></span>
                  <div>
                    <div className="problem-card__title">{title}</div>
                    <p className="problem-card__text">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* Solution */}
          <Section
            tone="dark"
            eyebrow={SOLUTION.label}
            title={SOLUTION.headline}
            subtitle={SOLUTION.subheadline}
            center
          >
            <div className="value-grid">
              {SOLUTION.items.map(({ feature, outcome }) => (
                <div key={feature} className="value-row">
                  <span className="value-row__feature">{feature}</span>
                  <span className="value-row__arrow"><LuArrowRight /></span>
                  <span className="value-row__outcome">{outcome}</span>
                </div>
              ))}
            </div>
          </Section>

          {/* Feature clusters */}
          <Section
            id="features"
            tone="light"
            eyebrow="What's inside"
            title="Everything your shop runs on, in one place."
            subtitle="Four areas. No add-ons to buy separately."
            center
          >
            <div className="feature-grid">
              {CLUSTERS.map(({ icon: Icon, tone, title, description, points }) => (
                <div key={title} className="feature-card">
                  <span className={`feature-card__icon feature-card__icon--${tone}`}>
                    <Icon />
                  </span>
                  <h3 className="feature-card__title">{title}</h3>
                  <p className="feature-card__desc">{description}</p>
                  <ul className="feature-card__points">
                    {points.map((p) => (
                      <li key={p}><LuCheck /> {p}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Section>

          {/* Product preview */}
          <Section
            tone="dark"
            eyebrow="See it working"
            title="This is the actual product."
            subtitle="Three screens you'll use every day."
            center
          >
            <ProductPreview />
          </Section>

          {/* How it works */}
          <Section
            id="how"
            tone="light"
            eyebrow="Getting started"
            title="Four steps. You can be running by tomorrow."
            subtitle="Start with your fastest-moving items — not your whole shop."
            center
          >
            <div className="steps">
              {STEPS.map((s, i) => (
                <div key={s.title} className="step">
                  <span className="step__num">{i + 1}</span>
                  <h3 className="step__title">{s.title}</h3>
                  <p className="step__text">{s.text}</p>
                </div>
              ))}
            </div>
          </Section>

          {/* Social proof */}
          <Section tone="dark" center>
            <figure className="testimonial">
              <blockquote className="testimonial__quote">
                “{TESTIMONIAL.quote}”
              </blockquote>
              <figcaption className="testimonial__by">
                <span className="testimonial__avatar">
                  {TESTIMONIAL.name.charAt(0)}
                </span>
                <span>
                  <strong>{TESTIMONIAL.name}</strong>
                  <span className="testimonial__role">{TESTIMONIAL.business}</span>
                  <span className="testimonial__meta">{TESTIMONIAL.meta}</span>
                </span>
              </figcaption>
              <p className="testimonial__note">Illustrative example</p>
            </figure>
          </Section>

          {/* FAQ */}
          <Section
            id="faq"
            tone="light"
            eyebrow="FAQ"
            title="Questions shop owners ask us"
            center
          >
            <div className="faq-list">
              {FAQS.map((f, i) => (
                <FaqItem key={f.q} q={f.q} a={f.a} defaultOpen={i === 0} />
              ))}
            </div>
          </Section>

          {/* Final CTA */}
          <section className="final-cta">
            <div
              className="final-cta__photo"
              aria-hidden="true"
              style={{ backgroundImage: `url(${heroImage})` }}
            />
            <div className="final-cta__glow" aria-hidden="true" />
            <div className="final-cta__inner">
              <h2 className="final-cta__title">{FINAL_CTA.headline}</h2>
              <p className="final-cta__subtitle">{FINAL_CTA.subheadline}</p>
              <CTAButtons source="final-cta" align="center" />
              <p className="final-cta__reassure">{FINAL_CTA.reassurance}</p>
            </div>
          </section>
    </>
  );
}
