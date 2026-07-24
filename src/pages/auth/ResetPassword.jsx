import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { FiLock } from "react-icons/fi";
import { LuCircleCheckBig, LuCircleAlert } from "react-icons/lu";
import { toast } from "react-toastify";

import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
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
      setTimeout(() => navigate("/login", { replace: true }), 2200);
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
      <div className="auth-simple">
        <div className="auth-card auth-done">
          <div className="auth-done__icon auth-done__icon--warn"><LuCircleAlert /></div>
          <h1>Invalid reset link</h1>
          <p>This link is missing information or has been altered. Please request a new password-reset link.</p>
          <Link to="/forgot-password" className="btn btn--primary btn--block">
            Request a new link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-simple">
      <div className="auth-card">
        {done ? (
          <div className="auth-done">
            <div className="auth-done__icon"><LuCircleCheckBig /></div>
            <h1>Password reset</h1>
            <p>You're all set. Taking you to the sign-in page…</p>
          </div>
        ) : (
          <form className="login-form" onSubmit={onSubmit}>
            <h1>Choose a new password</h1>
            <p className="login-form__sub">Pick a strong password you don't use elsewhere.</p>

            {message && <div className="alert alert--error">{message}</div>}

            <Input
              label="New password"
              type="password"
              name="new_password"
              required
              autoComplete="new-password"
              placeholder="••••••••"
              icon={<FiLock />}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.new_password}
              hint="At least 8 characters."
            />
            <Input
              label="Confirm new password"
              type="password"
              name="confirm"
              required
              autoComplete="new-password"
              placeholder="••••••••"
              icon={<FiLock />}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              error={errors.confirm}
            />

            <Button type="submit" block loading={loading} style={{ marginTop: 8 }}>
              Reset password
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
