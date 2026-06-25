import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { FiLock } from "react-icons/fi";

import PageHeader from "../../components/common/PageHeader";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import { RoleBadge } from "../../components/common/Badge";
import { LoadingBlock } from "../../components/common/Spinner";
import authApi from "../../api/authApi";
import useAuth from "../../hooks/useAuth";
import parseApiError from "../../utils/apiError";

export default function Profile() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({ full_name: "", email: "", phone: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    authApi
      .getProfile()
      .then((p) => {
        setForm({
          full_name: p.full_name || p.name || "",
          email: p.email || "",
          phone: p.phone || "",
        });
        setUser(p);
      })
      .catch((err) => toast.error(parseApiError(err).message))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    try {
      const updated = await authApi.updateProfile({
        full_name: form.full_name,
        phone: form.phone,
      });
      setUser(updated);
      toast.success("Profile updated");
    } catch (err) {
      const { message, fields } = parseApiError(err);
      setErrors(fields);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingBlock />;

  return (
    <div>
      <PageHeader title="My Profile" subtitle="Manage your account details." />

      <div style={{ maxWidth: 640 }}>
        <Card
          title="Account"
          actions={<RoleBadge role={user?.role} />}
        >
          <form onSubmit={save}>
            <div className="form-grid">
              <Input
                label="Full name"
                value={form.full_name}
                onChange={set("full_name")}
                error={errors.full_name}
              />
              <Input
                label="Email"
                value={form.email}
                disabled
                hint="Email can't be changed."
              />
              <Input
                label="Phone"
                value={form.phone}
                onChange={set("phone")}
                error={errors.phone}
              />
            </div>
            <div className="row gap-sm mt">
              <Button variant="success" onClick={save} loading={saving}>
                Save changes
              </Button>
              <Link to="/change-password">
                <Button variant="ghost" icon={<FiLock />}>
                  Change password
                </Button>
              </Link>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
