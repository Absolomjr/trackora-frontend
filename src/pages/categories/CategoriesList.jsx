import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FiPlus, FiEdit2, FiTrash2, FiTag } from "react-icons/fi";

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
import categoriesApi from "../../api/categoriesApi";
import { MANAGER_ADMIN } from "../../utils/constants";
import parseApiError from "../../utils/apiError";
import { asCount, asResults } from "../../utils/pagination";

export default function CategoriesList() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const debounced = useDebounce(search, 400);

  const [data, setData] = useState({ count: 0, results: [] });
  const [loading, setLoading] = useState(true);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", description: "" });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const [deleting, setDeleting] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page };
      if (debounced) params.search = debounced;
      const result = await categoriesApi.list(params);
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

  const openCreate = () => {
    setEditing(null);
    setForm({ name: "", description: "" });
    setErrors({});
    setFormOpen(true);
  };
  const openEdit = (cat) => {
    setEditing(cat);
    setForm({ name: cat.name || "", description: cat.description || "" });
    setErrors({});
    setFormOpen(true);
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    try {
      if (editing) {
        await categoriesApi.update(editing.id, form);
        toast.success("Category updated");
      } else {
        await categoriesApi.create(form);
        toast.success("Category created");
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
      await categoriesApi.remove(deleting.id);
      toast.success("Category deleted");
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
    { key: "name", header: "Name", render: (c) => <span className="cell-strong">{c.name}</span> },
    {
      key: "description",
      header: "Description",
      render: (c) => c.description || <span className="faint">—</span>,
    },
    {
      key: "product_count",
      header: "Products",
      align: "right",
      render: (c) => c.product_count ?? c.products_count ?? "—",
    },
    {
      key: "actions",
      header: "",
      align: "right",
      render: (c) => (
        <RoleGate allow={MANAGER_ADMIN}>
          <div className="table__actions">
            <Button variant="warning" size="sm" onClick={() => openEdit(c)}>
              <FiEdit2 />
            </Button>
            <Button variant="danger" size="sm" onClick={() => setDeleting(c)}>
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
        title="Categories"
        subtitle="Group products for easier browsing."
        actions={
          <RoleGate allow={MANAGER_ADMIN}>
            <Button icon={<FiPlus />} onClick={openCreate}>
              Add category
            </Button>
          </RoleGate>
        }
      />

      <Card>
        <div className="toolbar">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search categories…"
            className="toolbar__search"
          />
        </div>
        <DataTable
          columns={columns}
          rows={data.results}
          loading={loading}
          emptyTitle="No categories yet"
          emptyIcon={<FiTag />}
        />
        <Pagination page={page} count={data.count} onChange={setPage} />
      </Card>

      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? "Edit category" : "Add category"}
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
          <Input
            label="Name"
            required
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            error={errors.name}
          />
          <Textarea
            label="Description"
            value={form.description}
            onChange={(e) =>
              setForm((f) => ({ ...f, description: e.target.value }))
            }
            error={errors.description}
          />
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(deleting)}
        title="Delete category"
        message={`Delete "${deleting?.name}"? Products in it won't be deleted.`}
        confirmLabel="Delete"
        loading={deleteLoading}
        onConfirm={confirmDelete}
        onClose={() => setDeleting(null)}
      />
    </div>
  );
}
