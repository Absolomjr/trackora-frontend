import useReveal from "../../hooks/useReveal";

/**
 * Standard marketing section: a max-width container on an optional dark/light
 * band, with a reveal-on-scroll animation and an optional header block.
 */
export default function Section({
  id,
  tone = "light",
  eyebrow,
  title,
  subtitle,
  center,
  children,
  className = "",
}) {
  const [ref, visible] = useReveal();

  return (
    <section
      id={id}
      ref={ref}
      className={`section section--${tone} reveal ${visible ? "is-visible" : ""} ${className}`}
    >
      <div className="section__inner">
        {(eyebrow || title || subtitle) && (
          <header className={`section__head ${center ? "section__head--center" : ""}`}>
            {eyebrow && <span className="section__eyebrow">{eyebrow}</span>}
            {title && <h2 className="section__title">{title}</h2>}
            {subtitle && <p className="section__subtitle">{subtitle}</p>}
          </header>
        )}
        {children}
      </div>
    </section>
  );
}
