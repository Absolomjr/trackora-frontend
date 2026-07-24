import { useState } from "react";
import { Link } from "react-router-dom";
import { FiMail, FiArrowLeft } from "react-icons/fi";
import { LuMailCheck } from "react-icons/lu";

import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import authApi from "../../api/authApi";
import parseApiError from "../../utils/apiError";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await authApi.requestPasswordReset(email.trim());
      setSent(true);
    } catch (err) {
      setError(parseApiError(err).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-simple">
      <div className="auth-card">
        {sent ? (
          <div className="auth-done">
            <div className="auth-done__icon"><LuMailCheck /></div>
            <h1>Check your email</h1>
            <p>
              If an account exists for <strong>{email}</strong>, we've sent a link
              to reset your password. It may take a minute to arrive — check your
              spam folder too.
            </p>
            <Link to="/login" className="btn btn--primary btn--block">
              Back to sign in
            </Link>
          </div>
        ) : (
          <form className="login-form" onSubmit={onSubmit}>
            <h1>Reset your password</h1>
            <p className="login-form__sub">
              Enter the email for your account and we'll send you a link to set a
              new password.
            </p>

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

            <Button type="submit" block loading={loading} style={{ marginTop: 8 }}>
              Send reset link
            </Button>

            <Link to="/login" className="auth-back">
              <FiArrowLeft /> Back to sign in
            </Link>
          </form>
        )}
      </div>
    </div>
  );
}
