import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FiPlus, FiTrash2 } from "react-icons/fi";

import Modal from "../../components/common/Modal";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Select from "../../components/common/Select";
import Textarea from "../../components/common/Textarea";
import productsApi from "../../api/productsApi";
import parseApiError from "../../utils/apiError";
import { asResults } from "../../utils/pagination";

const blankLine = () => ({ product: "", quantity: "", unit_cost: "" });

/**
 * Shared create form for stock-in / stock-out records.
 *
 * `kind` is "in" or "out" (controls labels + whether unit cost is collected).
 * `itemsKey` is the nested field the backend expects (defaults to "items").
 */
export default function StockMovementForm({
  open,
  onClose,
  api,
  kind = "in",
  itemsKey = "items",
  onSaved,
}) {
  const isIn = kind === "in";
  const [products, setProducts] = useState([]);
  const [notes, setNotes] = useState("");
  const [lines, setLines] = useState([blankLine()]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setNotes("");
      setLines([blankLine()]);
      setError("");
      productsApi
        .list({ page_size: 500, ordering: "name" })
        .then((d) => setProducts(asResults(d)))
        .catch(() => setProducts([]));
    }
  }, [open]);

  const productOptions = products.map((p) => ({
    value: p.id,
    label: `${p.name} (${p.sku}) — ${p.quantity} ${p.unit} in stock`,
  }));

  const updateLine = (idx, key, value) =>
    setLines((rows) =>
      rows.map((row, i) => (i === idx ? { ...row, [key]: value } : row))
    );

  const addLine = () => setLines((rows) => [...rows, blankLine()]);
  const removeLine = (idx) =>
    setLines((rows) => (rows.length === 1 ? rows : rows.filter((_, i) => i !== idx)));

  const productById = (id) => products.find((p) => String(p.id) === String(id));

  const save = async (e) => {
    e.preventDefault();
    setError("");

    const cleaned = lines
      .filter((l) => l.product && Number(l.quantity) > 0)
      .map((l) => {
        const item = { product: Number(l.product), quantity: Number(l.quantity) };
        if (isIn && l.unit_cost !== "") item.unit_cost = Number(l.unit_cost);
        return item;
      });

    if (cleaned.length === 0) {
      setError("Add at least one product with a quantity.");
      return;
    }

    // Guard stock-out against selling more than is available (the backend also
    // enforces this, but we fail fast for a better UX).
    if (!isIn) {
      for (const line of cleaned) {
        const p = productById(line.product);
        if (p && line.quantity > p.quantity) {
          setError(
            `Cannot remove ${line.quantity} of "${p.name}" — only ${p.quantity} in stock.`
          );
          return;
        }
      }
    }

    const payload = { notes, [itemsKey]: cleaned };

    setSaving(true);
    try {
      await api.create(payload);
      toast.success(isIn ? "Stock received" : "Stock removed");
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
      title={isIn ? "Record stock in" : "Record stock out"}
      size="lg"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button
            variant={isIn ? "success" : "danger"}
            onClick={save}
            loading={saving}
          >
            {isIn ? "Receive stock" : "Remove stock"}
          </Button>
        </>
      }
    >
      <form onSubmit={save}>
        {error && <div className="alert alert--error">{error}</div>}

        <div className="line-items">
          {lines.map((line, idx) => {
            const p = productById(line.product);
            return (
              <div className="line-item" key={idx}>
                <Select
                  name={`product-${idx}`}
                  value={line.product}
                  onChange={(e) => updateLine(idx, "product", e.target.value)}
                  placeholder="Select product…"
                  options={productOptions}
                />
                <Input
                  name={`qty-${idx}`}
                  type="number"
                  min="1"
                  placeholder="Qty"
                  value={line.quantity}
                  onChange={(e) => updateLine(idx, "quantity", e.target.value)}
                  hint={!isIn && p ? `${p.quantity} available` : undefined}
                />
                {isIn ? (
                  <Input
                    name={`cost-${idx}`}
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Unit cost"
                    value={line.unit_cost}
                    onChange={(e) => updateLine(idx, "unit_cost", e.target.value)}
                  />
                ) : (
                  <span />
                )}
                <Button
                  variant="subtle"
                  size="sm"
                  onClick={() => removeLine(idx)}
                  aria-label="Remove line"
                  disabled={lines.length === 1}
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

        <div className="field field--full mt">
          <Textarea
            label="Notes (optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={isIn ? "e.g. Delivery from supplier" : "e.g. Damaged goods write-off"}
          />
        </div>
      </form>
    </Modal>
  );
}
