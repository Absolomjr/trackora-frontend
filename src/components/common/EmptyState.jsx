import { FiInbox } from "react-icons/fi";

export default function EmptyState({ icon, title = "Nothing here yet", message, action }) {
  return (
    <div className="empty-state">
      <div className="empty-state__icon">{icon || <FiInbox />}</div>
      <div className="empty-state__title">{title}</div>
      {message && <p style={{ margin: "0 auto", maxWidth: 360 }}>{message}</p>}
      {action && <div style={{ marginTop: 16 }}>{action}</div>}
    </div>
  );
}
