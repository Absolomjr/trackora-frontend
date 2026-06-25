import { Link } from "react-router-dom";

import Button from "../components/common/Button";

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        textAlign: "center",
        padding: 24,
      }}
    >
      <div>
        <div style={{ fontSize: 72, fontWeight: 800, color: "var(--primary)" }}>
          404
        </div>
        <h2 style={{ marginBottom: 8 }}>Page not found</h2>
        <p className="muted" style={{ marginBottom: 20 }}>
          The page you're looking for doesn't exist or has moved.
        </p>
        <Link to="/dashboard">
          <Button>Back to dashboard</Button>
        </Link>
      </div>
    </div>
  );
}
