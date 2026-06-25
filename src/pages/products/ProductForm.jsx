import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import Modal from "../../components/common/Modal";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Select from "../../components/common/Select";
import Textarea from "../../components/common/Textarea";
import productsApi from "../../api/productsApi";
import { UNIT_OPTIONS } from "../../utils/constants";
import parseApiError from "../../utils/apiError";

const EMPTY = {
  name: "",
  sku: "",
  category: "",
  supplier: "",
  unit: "piece",
  cost_price: "",
  selling_price: "",
  reorder_level: "",
  description: "",
};

export default function ProductForm({
  open,
  onClose,
  product,
  categories = [],
  suppliers = [],
  onSaved,
}) {
  const isEdit = Boolean(product);
  const [form, setForm] = useState(EMPTY);
  const [imageFile, setImageFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setErrors({});
      setImageFile(null);
      if (product) {
        setForm({
          name: product.name || "",
          sku: product.sku || "",
          category: product.category ?? "",
          supplier: product.supplier ?? "",
          unit: product.unit || "piece",
          cost_price: product.cost_price ?? "",
          selling_price: product.selling_price ?? "",
          reorder_level: product.reorder_level ?? "",
          description: product.description || "",
        });
      } else {
        setForm(EMPTY);
      }
    }
  }, [open, product]);

  const set = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSaving(true);

    const payload = {
      ...form,
      category: form.category || null,
      supplier: form.supplier || null,
    };
    if (imageFile) payload.image = imageFile;

    try {
      if (isEdit) {
        await productsApi.update(product.id, payload);
        toast.success("Product updated");
      } else {
        await productsApi.create(payload);
        toast.success("Product created");
      }
      onSaved?.();
      onClose();
    } catch (err) {
      const { message, fields } = parseApiError(err);
      setErrors(fields);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? "Edit product" : "Add product"}
      size="lg"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button variant="success" onClick={onSubmit} loading={saving}>
            {isEdit ? "Save changes" : "Create product"}
          </Button>
        </>
      }
    >
      <form onSubmit={onSubmit}>
        <div className="form-grid">
          <Input
            label="Product name"
            name="name"
            required
            value={form.name}
            onChange={set("name")}
            error={errors.name}
          />
          <Input
            label="SKU"
            name="sku"
            required
            value={form.sku}
            onChange={set("sku")}
            error={errors.sku}
          />
          <Select
            label="Category"
            name="category"
            value={form.category}
            onChange={set("category")}
            options={categories.map((c) => ({ value: c.id, label: c.name }))}
            error={errors.category}
          />
          <Select
            label="Supplier"
            name="supplier"
            value={form.supplier}
            onChange={set("supplier")}
            options={suppliers.map((s) => ({ value: s.id, label: s.name }))}
            error={errors.supplier}
          />
          <Select
            label="Unit"
            name="unit"
            required
            includeBlank={false}
            value={form.unit}
            onChange={set("unit")}
            options={UNIT_OPTIONS}
            error={errors.unit}
          />
          <Input
            label="Reorder level"
            name="reorder_level"
            type="number"
            min="0"
            value={form.reorder_level}
            onChange={set("reorder_level")}
            error={errors.reorder_level}
          />
          <Input
            label="Cost price"
            name="cost_price"
            type="number"
            min="0"
            step="0.01"
            required
            value={form.cost_price}
            onChange={set("cost_price")}
            error={errors.cost_price}
          />
          <Input
            label="Selling price"
            name="selling_price"
            type="number"
            min="0"
            step="0.01"
            required
            value={form.selling_price}
            onChange={set("selling_price")}
            error={errors.selling_price}
          />
          <div className="field field--full">
            <label className="label">Product image</label>
            <input
              type="file"
              accept="image/*"
              className="input"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            />
            {isEdit && product?.image && !imageFile && (
              <span className="field__hint">
                Leave empty to keep the current image.
              </span>
            )}
          </div>
          <div className="field field--full">
            <Textarea
              label="Description"
              name="description"
              value={form.description}
              onChange={set("description")}
              error={errors.description}
            />
          </div>
        </div>
        {!isEdit && (
          <p className="field__hint mt-0" style={{ marginTop: 10 }}>
            Stock quantity is managed through Stock In / Stock Out — new products
            start at zero.
          </p>
        )}
      </form>
    </Modal>
  );
}
