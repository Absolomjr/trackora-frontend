import { useState } from "react";
import { Link } from "react-router-dom";
import { FiMail, FiArrowRight } from "react-icons/fi";
import { LuMailCheck, LuShieldCheck } from "react-icons/lu";

import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import { TrackoraWordmark } from "../../components/common/TrackoraLogo";
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
    <div className="auth-page auth-page--tint-amber">
      <div className="auth-shell">
        <TrackoraWordmark className="auth-logo" size={34} />

        <div className="auth-card">
          {sent ? (
            <div className="auth-done">
              <div className="auth-done__icon"><LuMailCheck /></div>
              <h1>Check your email</h1>
              <p>
                If an account exists for <strong>{email}</strong>, we've sent a
                secure link to reset your password.
              </p>
              <Link to="/login" className="btn btn--primary btn--block">
                Back to sign in
              </Link>
            </div>
          ) : (
            <>
              <div className="auth-card__head">
                <h1>Forgot password?</h1>
                <p>No worries. Enter your email and we'll send you a link to reset your password.</p>
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

                <Button type="submit" block loading={loading} icon={!loading && <FiArrowRight />} className="btn--iconafter">
                  Send reset link
                </Button>

                <div className="auth-note">
                  <LuShieldCheck />
                  <span>We'll email you a secure link that expires in 15 minutes.</span>
                </div>
              </form>
            </>
          )}
        </div>

        <p className="auth-alt">
          Remember your password? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
