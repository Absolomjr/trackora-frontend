/**
 * Password strength meter (4 segments) matching the auth mockups.
 * Heuristic only — mirrors the "8+ chars, mix of letters/numbers/symbols" hint.
 */
export function scorePassword(pw = "") {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (pw.length >= 12 && score >= 3) score = 4;
  return Math.min(score, 4);
}

const LABELS = ["", "Weak", "Fair", "Good", "Strong"];

export default function PasswordStrength({ value = "" }) {
  if (!value) return null;
  const score = scorePassword(value);
  return (
    <div className="pw-strength">
      <div className="pw-strength__bars">
        {[1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className={`pw-strength__bar ${i <= score ? `is-${score}` : ""}`}
          />
        ))}
      </div>
      <span className={`pw-strength__label is-${score}`}>{LABELS[score]}</span>
    </div>
  );
}
