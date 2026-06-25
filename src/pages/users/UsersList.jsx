import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FiPlus, FiEdit2, FiTrash2, FiUserCheck } from "react-icons/fi";

import PageHeader from "../../components/common/PageHeader";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Select from "../../components/common/Select";
import Modal from "../../components/common/Modal";
import SearchInput from "../../components/common/SearchInput";
import DataTable from "../../components/common/DataTable";
import Pagination from "../../components/common/Pagination";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import Badge, { RoleBadge } from "../../components/common/Badge";
import useDebounce from "../../hooks/useDebounce";
import authApi from "../../api/authApi";
import useAuth from "../../hooks/useAuth";
import { ROLE_OPTIONS, ROLES } from "../../utils/constants";
import parseApiError from "../../utils/apiError";
import { asCount, asResults } from "../../utils/pagination";

const EMPTY = {
  full_name: "",
  email: "",
  role: ROLES.STAFF,
  password: "",
  is_active: true,
};

export default function UsersList() {
  const { user: currentUser } = useAuth();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const debounced = useDebounce(search, 400);

  const [data, setData] = useState({ count: 0, results: [] });
  const [loading, setLoading] = useState(true);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const [deleting, setDeleting] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page };
      if (debounced) params.search = debounced;
      const result = await authApi.users.list(params);
      setData({ count: asCount(result), results: asResults(result) });
    } catch (err) {
      toast.error(parseApiError(err).message);
    } finally {
      setLoading(false);
    }
  }, [page, debounced]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  useEffect(() => setPage(1), [debounced]);

  const set = (key) => (e) =>
    setForm((f) => ({
      ...f,
      [key]: e.target.type === "checkbox" ? e.target.checked : e.target.value,
    }));

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY);
    setErrors({});
    setFormOpen(true);
  };
  const openEdit = (u) => {
    setEditing(u);
    setForm({
      full_name: u.full_name || u.name || "",
      email: u.email || "",
      role: u.role || ROLES.STAFF,
      password: "",
      is_active: u.is_active ?? true,
    });
    setErrors({});
    setFormOpen(true);
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});

    const payload = { ...form };
    // Don't send an empty password on edit (it would overwrite with blank).
    if (editing && !payload.password) delete payload.password;

    try {
      if (editing) {
        await authApi.users.update(editing.id, payload);
        toast.success("User updated");
      } else {
        await authApi.users.create(payload);
        toast.success("User created");
      }
      setFormOpen(false);
      fetchData();
    } catch (err) {
      const { message, fields } = parseApiError(err);
      setErrors(fields);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    setDeleteLoading(true);
    try {
      await authApi.users.remove(deleting.id);
      toast.success("User deleted");
      setDeleting(null);
      if (data.results.length === 1 && page > 1) setPage((p) => p - 1);
      else fetchData();
    } catch (err) {
      toast.error(parseApiError(err).message);
    } finally {
      setDeleteLoading(false);
    }
  };

  const columns = [
    {
      key: "full_name",
      header: "Name",
      render: (u) => <span className="cell-strong">{u.full_name || u.name || "—"}</span>,
    },
    { key: "email", header: "Email", render: (u) => u.email },
    { key: "role", header: "Role", render: (u) => <RoleBadge role={u.role} /> },
    {
      key: "is_active",
      header: "Status",
      render: (u) =>
        u.is_active ? (
          <Badge tone="green">Active</Badge>
        ) : (
          <Badge tone="slate">Inactive</Badge>
        ),
    },
    {
      key: "actions",
      header: "",
      align: "right",
      render: (u) => (
        <div className="table__actions">
          <Button variant="warning" size="sm" onClick={() => openEdit(u)}>
            <FiEdit2 />
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => setDeleting(u)}
            disabled={u.id === currentUser?.id}
            title={u.id === currentUser?.id ? "You can't delete yourself" : "Delete"}
          >
            <FiTrash2 />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="User Management"
        subtitle="Create and manage staff, manager, and admin accounts."
        actions={
          <Button icon={<FiPlus />} onClick={openCreate}>
            Add user
          </Button>
        }
      />

      <Card>
        <div className="toolbar">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search users…"
            className="toolbar__search"
          />
        </div>
        <DataTable
          columns={columns}
          rows={data.results}
          loading={loading}
          emptyTitle="No users found"
          emptyIcon={<FiUserCheck />}
        />
        <Pagination page={page} count={data.count} onChange={setPage} />
      </Card>

      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? "Edit user" : "Add user"}
        footer={
          <>
            <Button variant="ghost" onClick={() => setFormOpen(false)} disabled={saving}>
              Cancel
            </Button>
            <Button variant="success" onClick={save} loading={saving}>
              {editing ? "Save changes" : "Create user"}
            </Button>
          </>
        }
      >
        <form onSubmit={save}>
          <div className="form-grid">
            <Input
              label="Full name"
              required
              value={form.full_name}
              onChange={set("full_name")}
              error={errors.full_name || errors.name}
            />
            <Input
              label="Email"
              type="email"
              required
              value={form.email}
              onChange={set("email")}
              error={errors.email}
            />
            <Select
              label="Role"
              required
              includeBlank={false}
              value={form.role}
              onChange={set("role")}
              options={ROLE_OPTIONS}
              error={errors.role}
            />
            <Input
              label={editing ? "New password" : "Password"}
              type="password"
              required={!editing}
              value={form.password}
              onChange={set("password")}
              error={errors.password}
              hint={editing ? "Leave blank to keep current password." : undefined}
              autoComplete="new-password"
            />
            <label className="row gap-sm field--full" style={{ cursor: "pointer" }}>
              <input type="checkbox" checked={form.is_active} onChange={set("is_active")} />
              <span>Active account</span>
            </label>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(deleting)}
        title="Delete user"
        message={`Delete "${deleting?.full_name || deleting?.email}"? This cannot be undone.`}
        confirmLabel="Delete"
        loading={deleteLoading}
        onConfirm={confirmDelete}
        onClose={() => setDeleting(null)}
      />
    </div>
  );
}
