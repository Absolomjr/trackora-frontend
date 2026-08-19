import { FiCheck } from "react-icons/fi";

/** Green custom checkbox matching the auth mockups. */
export default function Checkbox({ checked, onChange, label, children, id }) {
  const cbId = id || undefined;
  return (
    <label className="checkbox" htmlFor={cbId}>
      <input
        id={cbId}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange?.(e.target.checked)}
      />
      <span className={`checkbox__box ${checked ? "is-checked" : ""}`}>
        {checked && <FiCheck />}
      </span>
      <span className="checkbox__label">{label || children}</span>
    </label>
  );
}
