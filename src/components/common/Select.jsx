export default function Select({
  label,
  required,
  error,
  hint,
  options = [],
  placeholder = "Select…",
  includeBlank = true,
  className = "",
  id,
  children,
  ...rest
}) {
  const selectId = id || rest.name;
  return (
    <div className="field">
      {label && (
        <label className="label" htmlFor={selectId}>
          {label}
          {required && <span className="req">*</span>}
        </label>
      )}
      <select
        id={selectId}
        className={`select ${error ? "has-error" : ""} ${className}`}
        {...rest}
      >
        {includeBlank && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
        {children}
      </select>
      {error && <span className="field__error">{error}</span>}
      {hint && !error && <span className="field__hint">{hint}</span>}
    </div>
  );
}
