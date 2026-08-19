import { LuCheck, LuTriangleAlert } from "react-icons/lu";

import CTAButtons from "./CTAButtons";
import { HERO } from "../../pages/landing/content";
import heroImage from "../../assets/hero-team.jpg";

/**
 * Hero visual: the real photograph, framed, with two small live-data cards
 * floating over it so the shot reads as "software in the field", not stock art.
 */
function HeroVisual() {
  return (
    <div className="hero-visual" aria-hidden="true">
      <div className="hero-photo">
        <img
          src={heroImage}
          alt="Two hardware-store team members checking stock on a laptop and tablet"
          width="1200"
          height="800"
          fetchPriority="high"
        />
        <div className="hero-photo__shade" />
      </div>

      <div className="hero-float hero-float--kpi">
        <span className="hero-float__label">Sales today</span>
        <span className="hero-float__value">UGX 1.84M</span>
        <span className="hero-float__trend">▲ 12% vs yesterday</span>
      </div>

      <div className="hero-float hero-float--alert">
        <span className="hero-float__icon"><LuTriangleAlert /></span>
        <div>
          <div className="hero-float__alert-title">Cement 50kg — 4 left</div>
          <div className="hero-float__alert-text">Below reorder level</div>
        </div>
      </div>
    </div>
  );
}

export default function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero__glow" aria-hidden="true" />
      <div className="hero__inner">
        <div className="hero__text">
          <span className="hero__eyebrow">{HERO.eyebrow}</span>
          <h1 className="hero__headline">
            {HERO.headlineLead}
            <span className="hero__headline-accent">{HERO.headlineAccent}</span>
          </h1>
          <p className="hero__subhead">{HERO.subheadline}</p>

          <ul className="hero__bullets">
            {HERO.bullets.map((b) => (
              <li key={b.title} className="hero__bullet">
                <span className="hero__check"><LuCheck /></span>
                <span><strong>{b.title}</strong>{b.text ? `. ${b.text}` : ""}</span>
              </li>
            ))}
          </ul>

          <CTAButtons />
          {HERO.ctaSupport && <p className="hero__support">{HERO.ctaSupport}</p>}
        </div>

        <HeroVisual />
      </div>
    </section>
  );
}
