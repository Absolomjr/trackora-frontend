import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiMail, FiArrowRight } from "react-icons/fi";

import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import PasswordInput from "../../components/common/PasswordInput";
import Checkbox from "../../components/common/Checkbox";
import { TrackoraWordmark } from "../../components/common/TrackoraLogo";
import useAuth from "../../hooks/useAuth";
import parseApiError from "../../utils/apiError";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email.trim(), password, remember);
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
    <div className="auth-page auth-page--tint-green">
      <div className="auth-shell">
        <TrackoraWordmark className="auth-logo" size={34} />

        <div className="auth-card">
          <div className="auth-card__head">
            <h1>Welcome back</h1>
            <p>Sign in to access your Trackora account.</p>
          </div>

          <form onSubmit={onSubmit} noValidate>
            {error && <div className="alert alert--error">{error}</div>}

            <Input
              label="Email address"
              type="email"
              name="email"
              required
              autoComplete="email"
              placeholder="name@yourstore.com"
              icon={<FiMail />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <PasswordInput
              label="Password"
              name="password"
              required
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              labelRight={
                <Link to="/forgot-password" className="auth-link">
                  Forgot password?
                </Link>
              }
            />

            <div className="auth-row">
              <Checkbox checked={remember} onChange={setRemember} label="Remember me" />
            </div>

            <Button type="submit" block loading={loading} icon={!loading && <FiArrowRight />} className="btn--iconafter">
              Sign in
            </Button>
          </form>
        </div>

        <p className="auth-alt">
          New to Trackora? <Link to="/signup">Create an account</Link>
        </p>
      </div>
    </div>
  );
}
