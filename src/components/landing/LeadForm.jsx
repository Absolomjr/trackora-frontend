import { useState } from "react";
import { LuCircleCheckBig } from "react-icons/lu";

import Input from "../common/Input";
import Textarea from "../common/Textarea";
import Button from "../common/Button";
import Alert from "../common/Alert";
import leadsApi, { LEAD_KIND } from "../../api/leadsApi";
import { parseApiError } from "../../utils/apiError";

const EMPTY = {
  full_name: "",
  email: "",
  phone: "",
  business_name: "",
  location: "",
  message: "",
};

/**
 * The lead-capture form body. Usable inside the modal or embedded inline (e.g.
 * a future /demo page). `kind` decides the submit endpoint and labels; `source`
 * records which landing section the visitor converted from.
 */
export default function LeadForm({
  kind = LEAD_KIND.SIGNUP,
  source = "",
  ctaLabel,
  onDone,
}) {
  const isDemo = kind === LEAD_KIND.DEMO;
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});
    setMessage("");

    const payload = { ...form, source };
    const request = isDemo ? leadsApi.requestDemo : leadsApi.requestAccount;

    try {
      const res = await request(payload);
      setDone(true);
      onDone?.(res);
    } catch (err) {
      const { message: msg, fields } = parseApiError(err);
      setErrors(fields);
      setMessage(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="lead-done">
        <div className="lead-done__icon">
          <LuCircleCheckBig />
        </div>
        <h3 className="lead-done__title">
          {isDemo ? "Your demo request is in." : "You're on the list."}
        </h3>
        <p className="lead-done__text">
          Thanks, {form.full_name.split(" ")[0] || "there"} — we've received your
          details and will be in touch shortly to get you started.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate>
      {message && (
        <Alert variant="error">{message}</Alert>
      )}

      <div className="form-grid form-grid--2">
        <Input
          label="Full name"
          name="full_name"
          required
          value={form.full_name}
          onChange={set("full_name")}
          error={errors.full_name}
          autoComplete="name"
        />
        <Input
          label="Email"
          name="email"
          type="email"
          required
          value={form.email}
          onChange={set("email")}
          error={errors.email}
          autoComplete="email"
        />
        <Input
          label="Phone"
          name="phone"
          value={form.phone}
          onChange={set("phone")}
          error={errors.phone}
          hint={isDemo ? "So we can reach you to schedule." : undefined}
          autoComplete="tel"
        />
        <Input
          label="Business name"
          name="business_name"
          value={form.business_name}
          onChange={set("business_name")}
          error={errors.business_name}
        />
        <Input
          label="Location"
          name="location"
          value={form.location}
          onChange={set("location")}
          error={errors.location}
          className="span-2"
        />
      </div>

      <Textarea
        label={isDemo ? "Tell us about your shop" : "Anything we should know? (optional)"}
        name="message"
        rows={3}
        value={form.message}
        onChange={set("message")}
        error={errors.message}
        hint="How many products, how many branches, what you use today."
      />

      <Button type="submit" block loading={submitting}>
        {ctaLabel || (isDemo ? "Request my demo" : "Create my account")}
      </Button>
      <p className="lead-form__fineprint">
        We'll only use your details to get you started. No spam.
      </p>
    </form>
  );
}
