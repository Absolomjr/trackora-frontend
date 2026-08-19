import { useState } from "react";
import { Link } from "react-router-dom";
import { FiUser, FiMail, FiPhone, FiHome, FiArrowRight } from "react-icons/fi";
import { LuMailCheck } from "react-icons/lu";

import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Checkbox from "../../components/common/Checkbox";
import { TrackoraWordmark } from "../../components/common/TrackoraLogo";
import leadsApi from "../../api/leadsApi";
import parseApiError from "../../utils/apiError";

const EMPTY = { full_name: "", email: "", business_name: "", phone: "" };

/**
 * Public "Create account" page. Registration is admin-provisioned, so this
 * captures an account request (lead) that an admin approves — no password is
 * collected here. Visually mirrors the sign-up mockup.
 */
export default function CreateAccount() {
  const [form, setForm] = useState(EMPTY);
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setMessage("");
    if (!agree) {
      setMessage("Please accept the Terms of Service and Privacy Policy.");
      return;
    }
    setLoading(true);
    try {
      await leadsApi.requestAccount({ ...form, source: "signup-page" });
      setDone(true);
    } catch (err) {
      const { message: msg, fields } = parseApiError(err);
      setErrors(fields);
      setMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page auth-page--tint-hex">
      <div className="auth-shell auth-shell--wide">
        <TrackoraWordmark className="auth-logo" size={34} />

        <div className="auth-card">
          {done ? (
            <div className="auth-done">
              <div className="auth-done__icon"><LuMailCheck /></div>
              <h1>Request received</h1>
              <p>
                Thanks, {form.full_name.split(" ")[0] || "there"} — we've got your
                details and will set up your Trackora account and be in touch
                shortly to get you started.
              </p>
              <Link to="/login" className="btn btn--primary btn--block">
                Back to sign in
              </Link>
            </div>
          ) : (
            <>
              <div className="auth-card__head">
                <h1>Create your account</h1>
                <p>Join Trackora and start managing your business smarter.</p>
              </div>

              <form onSubmit={onSubmit} noValidate>
                {message && <div className="alert alert--error">{message}</div>}

                <Input
                  label="Full name"
                  name="full_name"
                  required
                  autoComplete="name"
                  placeholder="Enter your full name"
                  icon={<FiUser />}
                  value={form.full_name}
                  onChange={set("full_name")}
                  error={errors.full_name}
                />
                <Input
                  label="Email address"
                  type="email"
                  name="email"
                  required
                  autoComplete="email"
                  placeholder="name@yourstore.com"
                  icon={<FiMail />}
                  value={form.email}
                  onChange={set("email")}
                  error={errors.email}
                />
                <Input
                  label="Business name"
                  name="business_name"
                  placeholder="Your hardware store"
                  icon={<FiHome />}
                  value={form.business_name}
                  onChange={set("business_name")}
                  error={errors.business_name}
                />
                <Input
                  label="Phone"
                  name="phone"
                  autoComplete="tel"
                  placeholder="+256 700 000 000"
                  icon={<FiPhone />}
                  value={form.phone}
                  onChange={set("phone")}
                  error={errors.phone}
                />

                <div className="auth-row">
                  <Checkbox checked={agree} onChange={setAgree}>
                    I agree to the <Link to="/terms">Terms of Service</Link> and{" "}
                    <Link to="/privacy">Privacy Policy</Link>
                  </Checkbox>
                </div>

                <Button type="submit" block loading={loading} icon={!loading && <FiArrowRight />} className="btn--iconafter">
                  Create account
                </Button>
                <p className="auth-fineprint">
                  Accounts are activated by your store administrator. We'll email
                  you once yours is ready.
                </p>
              </form>
            </>
          )}
        </div>

        <p className="auth-alt">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
