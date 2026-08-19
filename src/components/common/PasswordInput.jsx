import { useState } from "react";
import { FiLock, FiEye, FiEyeOff } from "react-icons/fi";

/**
 * Password field with a lock icon and a show/hide toggle, matching the auth
 * mockups. Forwards all other props (value, onChange, name, etc.) to Input.
 */
export default function PasswordInput({
  label,
  required,
  error,
  hint,
  labelRight,
  ...rest
}) {
  const [show, setShow] = useState(false);
  const inputId = rest.id || rest.name;

  return (
    <div className="field">
      {(label || labelRight) && (
        <div className="field__labelrow">
          {label && (
            <label className="label" htmlFor={inputId}>
              {label}
              {required && <span className="req">*</span>}
            </label>
          )}
          {labelRight}
        </div>
      )}
      <div className="input-icon input-icon--password">
        <FiLock />
        <input
          id={inputId}
          type={show ? "text" : "password"}
          className={`input ${error ? "has-error" : ""}`}
          {...rest}
        />
        <button
          type="button"
          className="input-eye"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? "Hide password" : "Show password"}
          tabIndex={-1}
        >
          {show ? <FiEyeOff /> : <FiEye />}
        </button>
      </div>
      {error && <span className="field__error">{error}</span>}
      {hint && !error && <span className="field__hint">{hint}</span>}
    </div>
  );
}
