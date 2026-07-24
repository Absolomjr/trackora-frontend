import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiMail, FiLock } from "react-icons/fi";
import { LuBoxes } from "react-icons/lu";

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
        err?.response?.status === 401 ? "Invalid email or password." : message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-simple">
      <div className="auth-card">
        <Link to="/" className="auth-brand">
          <span className="auth-brand__logo"><LuBoxes /></span>
          Trackora
        </Link>

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

          <div className="login-form__row">
            <Link to="/forgot-password" className="login-form__link">
              Forgot password?
            </Link>
          </div>

          <Button type="submit" block loading={loading} style={{ marginTop: 8 }}>
            Sign in
          </Button>
        </form>

        <p className="auth-alt">
          New to Trackora? <Link to="/demo">Book a demo</Link>
        </p>
      </div>
    </div>
  );
}
