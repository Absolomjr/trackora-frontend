export default function Input({
  label,
  required,
  error,
  hint,
  icon,
  className = "",
  id,
  ...rest
}) {
  const inputId = id || rest.name;
  const control = (
    <input
      id={inputId}
      className={`input ${error ? "has-error" : ""} ${className}`}
      {...rest}
    />
  );

  return (
    <div className="field">
      {label && (
        <label className="label" htmlFor={inputId}>
          {label}
          {required && <span className="req">*</span>}
        </label>
      )}
      {icon ? (
        <div className="input-icon">
          {icon}
          {control}
        </div>
      ) : (
        control
      )}
      {error && <span className="field__error">{error}</span>}
      {hint && !error && <span className="field__hint">{hint}</span>}
    </div>
  );
}
