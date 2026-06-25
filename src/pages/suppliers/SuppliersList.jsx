import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FiPlus, FiEdit2, FiTrash2, FiTruck } from "react-icons/fi";

import PageHeader from "../../components/common/PageHeader";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Textarea from "../../components/common/Textarea";
import Modal from "../../components/common/Modal";
import SearchInput from "../../components/common/SearchInput";
import DataTable from "../../components/common/DataTable";
import Pagination from "../../components/common/Pagination";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import RoleGate from "../../components/common/RoleGate";
import useDebounce from "../../hooks/useDebounce";
import suppliersApi from "../../api/suppliersApi";
import { MANAGER_ADMIN } from "../../utils/constants";
import parseApiError from "../../utils/apiError";
import { asCount, asResults } from "../../utils/pagination";

const EMPTY = {
  name: "",
  contact_person: "",
  phone: "",
  email: "",
  address: "",
};

export default function SuppliersList() {
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
      const result = await suppliersApi.list(params);
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

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY);
    setErrors({});
    setFormOpen(true);
  };
  const openEdit = (s) => {
    setEditing(s);
    setForm({
      name: s.name || "",
      contact_person: s.contact_person || "",
      phone: s.phone || "",
      email: s.email || "",
      address: s.address || "",
    });
    setErrors({});
    setFormOpen(true);
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    try {
      if (editing) {
        await suppliersApi.update(editing.id, form);
        toast.success("Supplier updated");
      } else {
        await suppliersApi.create(form);
        toast.success("Supplier created");
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
      await suppliersApi.remove(deleting.id);
      toast.success("Supplier deleted");
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
    { key: "name", header: "Supplier", render: (s) => <span className="cell-strong">{s.name}</span> },
    {
      key: "contact_person",
      header: "Contact",
      render: (s) => s.contact_person || <span className="faint">—</span>,
    },
    { key: "phone", header: "Phone", render: (s) => s.phone || <span className="faint">—</span> },
    { key: "email", header: "Email", render: (s) => s.email || <span className="faint">—</span> },
    {
      key: "actions",
      header: "",
      align: "right",
      render: (s) => (
        <RoleGate allow={MANAGER_ADMIN}>
          <div className="table__actions">
            <Button variant="warning" size="sm" onClick={() => openEdit(s)}>
              <FiEdit2 />
            </Button>
            <Button variant="danger" size="sm" onClick={() => setDeleting(s)}>
              <FiTrash2 />
            </Button>
          </div>
        </RoleGate>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Suppliers"
        subtitle="Where you source your stock from."
        actions={
          <RoleGate allow={MANAGER_ADMIN}>
            <Button icon={<FiPlus />} onClick={openCreate}>
              Add supplier
            </Button>
          </RoleGate>
        }
      />

      <Card>
        <div className="toolbar">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search suppliers…"
            className="toolbar__search"
          />
        </div>
        <DataTable
          columns={columns}
          rows={data.results}
          loading={loading}
          emptyTitle="No suppliers yet"
          emptyIcon={<FiTruck />}
        />
        <Pagination page={page} count={data.count} onChange={setPage} />
      </Card>

      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? "Edit supplier" : "Add supplier"}
        footer={
          <>
            <Button variant="ghost" onClick={() => setFormOpen(false)} disabled={saving}>
              Cancel
            </Button>
            <Button variant="success" onClick={save} loading={saving}>
              {editing ? "Save changes" : "Create"}
            </Button>
          </>
        }
      >
        <form onSubmit={save}>
          <div className="form-grid">
            <Input label="Name" required value={form.name} onChange={set("name")} error={errors.name} />
            <Input
              label="Contact person"
              value={form.contact_person}
              onChange={set("contact_person")}
              error={errors.contact_person}
            />
            <Input label="Phone" value={form.phone} onChange={set("phone")} error={errors.phone} />
            <Input
              label="Email"
              type="email"
              value={form.email}
              onChange={set("email")}
              error={errors.email}
            />
            <div className="field field--full">
              <Textarea
                label="Address"
                value={form.address}
                onChange={set("address")}
                error={errors.address}
              />
            </div>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(deleting)}
        title="Delete supplier"
        message={`Delete "${deleting?.name}"?`}
        confirmLabel="Delete"
        loading={deleteLoading}
        onConfirm={confirmDelete}
        onClose={() => setDeleting(null)}
      />
    </div>
  );
}
