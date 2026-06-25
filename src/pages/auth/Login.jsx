import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FiBox,
  FiMail,
  FiLock,
  FiTrendingUp,
  FiShield,
  FiPackage,
} from "react-icons/fi";

import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import useAuth from "../../hooks/useAuth";
import parseApiError from "../../utils/apiError";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email.trim(), password);
      navigate(from, { replace: true });
    } catch (err) {
      const { message } = parseApiError(err);
      setError(
        err?.response?.status === 401
          ? "Invalid email or password."
          : message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-hero">
        <div className="login-hero__brand">
          <span className="login-hero__brand-icon">
            <FiBox />
          </span>
          Trackora
        </div>
        <h2>Run your hardware store with confidence.</h2>
        <p>
          Track inventory, record stock movements, process sales, and watch your
          numbers — all in one place.
        </p>
        <div className="login-hero__features">
          <div className="login-hero__feature">
            <FiPackage /> Real-time inventory & low-stock alerts
          </div>
          <div className="login-hero__feature">
            <FiTrendingUp /> Sales, profit & best-seller reports
          </div>
          <div className="login-hero__feature">
            <FiShield /> Role-based access for your team
          </div>
        </div>
      </div>

      <div className="login-form-side">
        <form className="login-form" onSubmit={onSubmit}>
          <h1>Welcome back</h1>
          <p className="login-form__sub">Sign in to your Trackora account.</p>

          {error && <div className="alert alert--error">{error}</div>}

          <Input
            label="Email address"
            type="email"
            name="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            icon={<FiMail />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            label="Password"
            type="password"
            name="password"
            required
            autoComplete="current-password"
            placeholder="••••••••"
            icon={<FiLock />}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            type="submit"
            block
            loading={loading}
            className="mt"
            style={{ marginTop: 8 }}
          >
            Sign in
          </Button>
        </form>
      </div>
    </div>
  );
}
