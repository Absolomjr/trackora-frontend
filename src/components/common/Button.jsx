const VARIANTS = {
  primary: "btn--primary",
  success: "btn--success",
  warning: "btn--warning",
  danger: "btn--danger",
  accent: "btn--accent",
  ghost: "btn--ghost",
  subtle: "btn--subtle",
};

export default function Button({
  variant = "primary",
  size,
  block,
  icon,
  loading,
  disabled,
  children,
  className = "",
  type = "button",
  ...rest
}) {
  const classes = [
    "btn",
    VARIANTS[variant] || VARIANTS.primary,
    size === "sm" && "btn--sm",
    !children && "btn--icon",
    block && "btn--block",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? (
        <span className="spinner spinner--sm spinner--light" />
      ) : (
        icon
      )}
      {children}
    </button>
  );
}
