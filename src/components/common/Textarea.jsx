export default function Textarea({
  label,
  required,
  error,
  hint,
  className = "",
  id,
  ...rest
}) {
  const fieldId = id || rest.name;
  return (
    <div className="field">
      {label && (
        <label className="label" htmlFor={fieldId}>
          {label}
          {required && <span className="req">*</span>}
        </label>
      )}
      <textarea
        id={fieldId}
        className={`textarea ${error ? "has-error" : ""} ${className}`}
        {...rest}
      />
      {error && <span className="field__error">{error}</span>}
      {hint && !error && <span className="field__hint">{hint}</span>}
    </div>
  );
}
