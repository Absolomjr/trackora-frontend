import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { FiPlus, FiTrash2 } from "react-icons/fi";

import Modal from "../../components/common/Modal";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Select from "../../components/common/Select";
import salesApi from "../../api/salesApi";
import productsApi from "../../api/productsApi";
import customersApi from "../../api/customersApi";
import { PAYMENT_METHODS } from "../../utils/constants";
import formatCurrency from "../../utils/formatCurrency";
import parseApiError from "../../utils/apiError";
import { asResults } from "../../utils/pagination";

const blankLine = () => ({ product: "", quantity: 1 });

export default function OrderForm({ open, onClose, onSaved }) {
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [customer, setCustomer] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [lines, setLines] = useState([blankLine()]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setCustomer("");
      setPaymentMethod("cash");
      setLines([blankLine()]);
      setError("");
      productsApi
        .list({ page_size: 500, ordering: "name" })
        .then((d) => setProducts(asResults(d)))
        .catch(() => setProducts([]));
      customersApi
        .list({ page_size: 500 })
        .then((d) => setCustomers(asResults(d)))
        .catch(() => setCustomers([]));
    }
  }, [open]);

  const productById = (id) => products.find((p) => String(p.id) === String(id));

  const productOptions = products.map((p) => ({
    value: p.id,
    label: `${p.name} — ${formatCurrency(p.selling_price)} (${p.quantity} ${p.unit})`,
  }));

  const updateLine = (idx, key, value) =>
    setLines((rows) => rows.map((r, i) => (i === idx ? { ...r, [key]: value } : r)));
  const addLine = () => setLines((rows) => [...rows, blankLine()]);
  const removeLine = (idx) =>
    setLines((rows) => (rows.length === 1 ? rows : rows.filter((_, i) => i !== idx)));

  const total = useMemo(
    () =>
      lines.reduce((sum, l) => {
        const p = productById(l.product);
        return sum + (p ? Number(p.selling_price) * Number(l.quantity || 0) : 0);
      }, 0),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [lines, products]
  );

  const save = async (e) => {
    e.preventDefault();
    setError("");

    const cleaned = lines
      .filter((l) => l.product && Number(l.quantity) > 0)
      .map((l) => ({ product: Number(l.product), quantity: Number(l.quantity) }));

    if (cleaned.length === 0) {
      setError("Add at least one product.");
      return;
    }

    for (const line of cleaned) {
      const p = productById(line.product);
      if (p && line.quantity > p.quantity) {
        setError(`Only ${p.quantity} of "${p.name}" in stock.`);
        return;
      }
    }

    const payload = {
      payment_method: paymentMethod,
      line_items: cleaned,
    };
    if (customer) payload.customer = Number(customer);

    setSaving(true);
    try {
      await salesApi.create(payload);
      toast.success("Order created — stock updated");
      onSaved?.();
      onClose();
    } catch (err) {
      setError(parseApiError(err).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="New order"
      size="lg"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button variant="success" onClick={save} loading={saving}>
            Create order
          </Button>
        </>
      }
    >
      <form onSubmit={save}>
        {error && <div className="alert alert--error">{error}</div>}

        <div className="form-grid mb">
          <Select
            label="Customer (optional)"
            value={customer}
            onChange={(e) => setCustomer(e.target.value)}
            placeholder="Walk-in customer"
            options={customers.map((c) => ({ value: c.id, label: c.name }))}
          />
          <Select
            label="Payment method"
            includeBlank={false}
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            options={PAYMENT_METHODS}
          />
        </div>

        <label className="label mb">Line items</label>
        <div className="line-items">
          {lines.map((line, idx) => {
            const p = productById(line.product);
            const lineTotal = p ? Number(p.selling_price) * Number(line.quantity || 0) : 0;
            return (
              <div className="line-item" key={idx}>
                <Select
                  value={line.product}
                  onChange={(e) => updateLine(idx, "product", e.target.value)}
                  placeholder="Select product…"
                  options={productOptions}
                />
                <Input
                  type="number"
                  min="1"
                  value={line.quantity}
                  onChange={(e) => updateLine(idx, "quantity", e.target.value)}
                  hint={p ? `${p.quantity} in stock` : undefined}
                />
                <span className="nowrap strong" style={{ minWidth: 90, textAlign: "right" }}>
                  {formatCurrency(lineTotal)}
                </span>
                <Button
                  variant="subtle"
                  size="sm"
                  onClick={() => removeLine(idx)}
                  disabled={lines.length === 1}
                  aria-label="Remove line"
                >
                  <FiTrash2 />
                </Button>
              </div>
            );
          })}
        </div>

        <Button variant="ghost" size="sm" icon={<FiPlus />} onClick={addLine} className="mt">
          Add product
        </Button>

        <div className="order-total">
          <span>Total</span>
          <span>{formatCurrency(total)}</span>
        </div>
      </form>
    </Modal>
  );
}
