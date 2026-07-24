import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { FiPlus, FiEdit2, FiTrash2, FiBox } from "react-icons/fi";

import PageHeader from "../../components/common/PageHeader";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Select from "../../components/common/Select";
import SearchInput from "../../components/common/SearchInput";
import DataTable from "../../components/common/DataTable";
import Pagination from "../../components/common/Pagination";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import RoleGate from "../../components/common/RoleGate";
import { StockBadge } from "../../components/common/Badge";
import ProductForm from "./ProductForm";
import useDebounce from "../../hooks/useDebounce";
import productsApi from "../../api/productsApi";
import categoriesApi from "../../api/categoriesApi";
import suppliersApi from "../../api/suppliersApi";
import { MANAGER_ADMIN } from "../../utils/constants";
import formatCurrency from "../../utils/formatCurrency";
import parseApiError from "../../utils/apiError";
import { asResults } from "../../utils/pagination";

export default function ProductsList() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [lowStock, setLowStock] = useState(
    searchParams.get("low_stock") === "true"
  );
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search, 400);

  const [data, setData] = useState({ count: 0, results: [] });
  const [loading, setLoading] = useState(true);

  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Load filter option lists once.
  useEffect(() => {
    categoriesApi.list({ page_size: 200 }).then((d) => setCategories(asResults(d)));
    suppliersApi.list({ page_size: 200 }).then((d) => setSuppliers(asResults(d)));
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page };
      if (debouncedSearch) params.search = debouncedSearch;
      if (category) params.category = category;
      if (lowStock) params.low_stock = true;
      const result = await productsApi.list(params);
      setData({
        count: result.count ?? asResults(result).length,
        results: asResults(result),
      });
    } catch (err) {
      toast.error(parseApiError(err).message);
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, category, lowStock]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Reset to page 1 whenever a filter changes.
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, category, lowStock]);

  // Keep the low_stock query param in sync (so dashboard deep-links work).
  useEffect(() => {
    const next = new URLSearchParams(searchParams);
    if (lowStock) next.set("low_stock", "true");
    else next.delete("low_stock");
    setSearchParams(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lowStock]);

  const categoryName = useMemo(() => {
    const map = {};
    categories.forEach((c) => (map[c.id] = c.name));
    return map;
  }, [categories]);

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };
  const openEdit = (product) => {
    setEditing(product);
    setFormOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    setDeleteLoading(true);
    try {
      await productsApi.remove(deleting.id);
      toast.success("Product deleted");
      setDeleting(null);
      // If we just removed the last row on a page, step back.
      if (data.results.length === 1 && page > 1) setPage((p) => p - 1);
      else fetchProducts();
    } catch (err) {
      toast.error(parseApiError(err).message);
    } finally {
      setDeleteLoading(false);
    }
  };

  const columns = [
    {
      key: "name",
      header: "Product",
      render: (p) => (
        <div className="product-thumb-cell">
          {p.image ? (
            <img src={p.image} alt={p.name} className="thumb" loading="lazy" decoding="async" />
          ) : (
            <span className="thumb thumb--placeholder">
              <FiBox />
            </span>
          )}
          <div>
            <div className="cell-strong">{p.name}</div>
            <div className="cell-muted">{p.sku}</div>
          </div>
        </div>
      ),
    },
    {
      key: "category",
      header: "Category",
      render: (p) =>
        p.category_name || categoryName[p.category] || (
          <span className="faint">—</span>
        ),
    },
    {
      key: "selling_price",
      header: "Price",
      align: "right",
      render: (p) => formatCurrency(p.selling_price),
    },
    {
      key: "quantity",
      header: "Qty",
      align: "right",
      render: (p) => (
        <span className="strong">
          {p.quantity} <span className="faint">{p.unit}</span>
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (p) => (
        <StockBadge quantity={p.quantity} reorderLevel={p.reorder_level} />
      ),
    },
    {
      key: "actions",
      header: "",
      align: "right",
      render: (p) => (
        <RoleGate allow={MANAGER_ADMIN}>
          <div className="table__actions">
            <Button
              variant="warning"
              size="sm"
              onClick={() => openEdit(p)}
              aria-label="Edit"
            >
              <FiEdit2 />
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => setDeleting(p)}
              aria-label="Delete"
            >
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
        title="Products"
        subtitle="Your full product catalogue."
        actions={
          <RoleGate allow={MANAGER_ADMIN}>
            <Button icon={<FiPlus />} onClick={openCreate}>
              Add product
            </Button>
          </RoleGate>
        }
      />

      <Card bodyClass="">
        <div className="toolbar">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search by name or SKU…"
            className="toolbar__search"
          />
          <div style={{ minWidth: 200 }}>
            <Select
              name="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="All categories"
              options={categories.map((c) => ({ value: c.id, label: c.name }))}
            />
          </div>
          <label className="row gap-sm" style={{ cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={lowStock}
              onChange={(e) => setLowStock(e.target.checked)}
            />
            <span>Low stock only</span>
          </label>
        </div>

        <DataTable
          columns={columns}
          rows={data.results}
          loading={loading}
          emptyTitle="No products found"
          emptyMessage="Try adjusting your search or filters."
          emptyIcon={<FiBox />}
        />

        <Pagination page={page} count={data.count} onChange={setPage} />
      </Card>

      <ProductForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        product={editing}
        categories={categories}
        suppliers={suppliers}
        onSaved={fetchProducts}
      />

      <ConfirmDialog
        open={Boolean(deleting)}
        title="Delete product"
        message={`Delete "${deleting?.name}"? This cannot be undone.`}
        confirmLabel="Delete"
        loading={deleteLoading}
        onConfirm={confirmDelete}
        onClose={() => setDeleting(null)}
      />
    </div>
  );
}
