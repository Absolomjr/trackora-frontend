/**
 * Presentational renderer for legal/policy pages. `sections` is an array of
 * { heading, body } where body is a string or array of paragraph strings.
 */
export default function LegalPage({ title, updated, intro, sections }) {
  return (
    <section className="section section--light">
      <div className="legal">
        <h1 className="legal__title">{title}</h1>
        {updated && <p className="legal__updated">Last updated: {updated}</p>}
        {intro && <p className="legal__intro">{intro}</p>}

        {sections.map((s) => (
          <div key={s.heading} className="legal__section">
            <h2 className="legal__heading">{s.heading}</h2>
            {(Array.isArray(s.body) ? s.body : [s.body]).map((p, i) => (
              <p key={i} className="legal__text">{p}</p>
            ))}
          </div>
        ))}

        <p className="legal__note">
          This is a general template provided for launch. Have it reviewed by a
          qualified adviser before relying on it, and replace the contact details
          below with your registered business information.
        </p>
      </div>
    </section>
  );
}
