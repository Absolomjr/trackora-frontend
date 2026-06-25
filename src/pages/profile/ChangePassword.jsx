import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import PageHeader from "../../components/common/PageHeader";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import authApi from "../../api/authApi";
import parseApiError from "../../utils/apiError";

export default function ChangePassword() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const save = async (e) => {
    e.preventDefault();
    setErrors({});

    if (form.new_password !== form.confirm_password) {
      setErrors({ confirm_password: "Passwords do not match." });
      return;
    }

    setSaving(true);
    try {
      await authApi.changePassword({
        old_password: form.old_password,
        new_password: form.new_password,
      });
      toast.success("Password changed");
      navigate("/profile");
    } catch (err) {
      const { message, fields } = parseApiError(err);
      setErrors(fields);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHeader title="Change Password" subtitle="Keep your account secure." />

      <div style={{ maxWidth: 480 }}>
        <Card>
          <form onSubmit={save}>
            <Input
              label="Current password"
              type="password"
              required
              autoComplete="current-password"
              value={form.old_password}
              onChange={set("old_password")}
              error={errors.old_password}
            />
            <Input
              label="New password"
              type="password"
              required
              autoComplete="new-password"
              value={form.new_password}
              onChange={set("new_password")}
              error={errors.new_password}
            />
            <Input
              label="Confirm new password"
              type="password"
              required
              autoComplete="new-password"
              value={form.confirm_password}
              onChange={set("confirm_password")}
              error={errors.confirm_password}
            />
            <Button variant="success" onClick={save} loading={saving} className="mt">
              Update password
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
