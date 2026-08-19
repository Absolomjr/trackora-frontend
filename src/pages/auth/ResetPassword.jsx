import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import { LuCircleCheckBig, LuCircleAlert } from "react-icons/lu";
import { toast } from "react-toastify";

import Button from "../../components/common/Button";
import PasswordInput from "../../components/common/PasswordInput";
import PasswordStrength from "../../components/common/PasswordStrength";
import { TrackoraWordmark } from "../../components/common/TrackoraLogo";
import authApi from "../../api/authApi";
import parseApiError from "../../utils/apiError";

export default function ResetPassword() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const uid = params.get("uid");
  const token = params.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const linkValid = uid && token;

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setMessage("");
    if (password !== confirm) {
      setErrors({ confirm: "Passwords do not match." });
      return;
    }
    setLoading(true);
    try {
      await authApi.confirmPasswordReset({ uid, token, new_password: password });
      setDone(true);
      toast.success("Password reset. You can now sign in.");
      setTimeout(() => navigate("/login", { replace: true }), 2000);
    } catch (err) {
      const { message: msg, fields } = parseApiError(err);
      setErrors(fields);
      setMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!linkValid) {
    return (
      <div className="auth-page auth-page--tint-green">
        <div className="auth-shell">
          <TrackoraWordmark className="auth-logo" size={34} />
          <div className="auth-card auth-done">
            <div className="auth-done__icon auth-done__icon--warn"><LuCircleAlert /></div>
            <h1>Invalid reset link</h1>
            <p>This link is missing information or has been altered. Please request a new one.</p>
            <Link to="/forgot-password" className="btn btn--primary btn--block">
              Request a new link
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page auth-page--tint-green">
      <div className="auth-shell">
        <TrackoraWordmark className="auth-logo" size={34} />
        <div className="auth-card">
          {done ? (
            <div className="auth-done">
              <div className="auth-done__icon"><LuCircleCheckBig /></div>
              <h1>Password reset</h1>
              <p>You're all set. Taking you to the sign-in page…</p>
            </div>
          ) : (
            <>
              <div className="auth-card__head">
                <h1>Reset password</h1>
                <p>Create a strong new password for your Trackora account.</p>
              </div>

              <form onSubmit={onSubmit} noValidate>
                {message && <div className="alert alert--error">{message}</div>}

                <PasswordInput
                  label="New password"
                  name="new_password"
                  required
                  autoComplete="new-password"
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={errors.new_password}
                />
                <PasswordStrength value={password} />
                <p className="auth-hint">Use 8+ characters with a mix of letters, numbers &amp; symbols.</p>

                <PasswordInput
                  label="Confirm new password"
                  name="confirm"
                  required
                  autoComplete="new-password"
                  placeholder="Confirm new password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  error={errors.confirm}
                />

                <Button type="submit" block loading={loading} icon={!loading && <FiArrowRight />} className="btn--iconafter">
                  Reset password
                </Button>
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
