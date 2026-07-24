import { FiAlertCircle, FiCheckCircle, FiInfo, FiAlertTriangle } from "react-icons/fi";

const ICONS = {
  error: FiAlertCircle,
  success: FiCheckCircle,
  info: FiInfo,
  warning: FiAlertTriangle,
};

/**
 * Inline status banner. Used to surface load failures (with an optional
 * Retry action) instead of swallowing them silently.
 */
export default function Alert({ variant = "info", title, children, action }) {
  const Icon = ICONS[variant] || FiInfo;
  return (
    <div className={`alert alert--${variant}`} role={variant === "error" ? "alert" : "status"}>
      <span className="alert__icon">
        <Icon />
      </span>
      <div className="alert__body">
        {title && <div className="alert__title">{title}</div>}
        {children && <div className="alert__text">{children}</div>}
      </div>
      {action && <div className="alert__action">{action}</div>}
    </div>
  );
}
