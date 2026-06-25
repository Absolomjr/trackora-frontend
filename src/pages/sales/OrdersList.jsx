import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FiPlus, FiEye, FiSlash, FiShoppingCart } from "react-icons/fi";

import PageHeader from "../../components/common/PageHeader";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Select from "../../components/common/Select";
import Modal from "../../components/common/Modal";
import DataTable from "../../components/common/DataTable";
import Pagination from "../../components/common/Pagination";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import RoleGate from "../../components/common/RoleGate";
import { OrderStatusBadge } from "../../components/common/Badge";
import OrderForm from "./OrderForm";
import salesApi from "../../api/salesApi";
import { MANAGER_ADMIN, PAYMENT_METHODS, ORDER_STATUS } from "../../utils/constants";
import formatCurrency from "../../utils/formatCurrency";
import { formatDateTime } from "../../utils/formatDate";
import parseApiError from "../../utils/apiError";
import { asCount, asResults } from "../../utils/pagination";

function orderItems(order) {
  if (!order) return [];
  return order.items || order.line_items || order.order_items || [];
}

const PAYMENT_LABELS = Object.fromEntries(
  PAYMENT_METHODS.map((p) => [p.value, p.label])
);

export default function OrdersList() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [data, setData] = useState({ count: 0, results: [] });
  const [loading, setLoading] = useState(true);

  const [formOpen, setFormOpen] = useState(false);
  const [viewing, setViewing] = useState(null);
  const [cancelling, setCancelling] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page };
      if (status) params.status = status;
      const result = await salesApi.list(params);
      setData({ count: asCount(result), results: asResults(result) });
    } catch (err) {
      toast.error(parseApiError(err).message);
    } finally {
      setLoading(false);
    }
  }, [page, status]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  useEffect(() => setPage(1), [status]);

  const openView = async (order) => {
    // Fetch the full record so nested items are present.
    try {
      const full = await salesApi.get(order.id);
      setViewing(full);
    } catch {
      setViewing(order);
    }
  };

  const confirmCancel = async () => {
    if (!cancelling) return;
    setCancelLoading(true);
    try {
      await salesApi.cancel(cancelling.id);
      toast.success("Order cancelled — stock restored");
      setCancelling(null);
      setViewing(null);
      fetchData();
    } catch (err) {
      toast.error(parseApiError(err).message);
    } finally {
      setCancelLoading(false);
    }
  };

  const columns = [
    {
      key: "reference",
      header: "Order",
      render: (o) => (
        <span className="cell-strong">
          {o.reference || o.reference_number || `#${o.id}`}
        </span>
      ),
    },
    {
      key: "customer",
      header: "Customer",
      render: (o) =>
        o.customer_name || o.customer?.name || <span className="faint">Walk-in</span>,
    },
    {
      key: "date",
      header: "Date",
      render: (o) => formatDateTime(o.created_at || o.date),
    },
    {
      key: "payment",
      header: "Payment",
      render: (o) => PAYMENT_LABELS[o.payment_method] || o.payment_method || "—",
    },
    {
      key: "total",
      header: "Total",
      align: "right",
      render: (o) => (
        <span className="strong">
          {formatCurrency(o.total ?? o.total_amount ?? o.grand_total)}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (o) => <OrderStatusBadge status={o.status} />,
    },
    {
      key: "actions",
      header: "",
      align: "right",
      render: (o) => (
        <div className="table__actions">
          <Button variant="ghost" size="sm" icon={<FiEye />} onClick={() => openView(o)}>
            View
          </Button>
        </div>
      ),
    },
  ];

  const items = orderItems(viewing);
  const canCancel =
    viewing && viewing.status !== ORDER_STATUS.CANCELLED;

  return (
    <div>
      <PageHeader
        title="Orders"
        subtitle="Point-of-sale orders. Creating an order deducts stock."
        actions={
          <Button icon={<FiPlus />} onClick={() => setFormOpen(true)}>
            New order
          </Button>
        }
      />

      <Card>
        <div className="toolbar">
          <div style={{ minWidth: 200 }}>
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              placeholder="All statuses"
              options={[
                { value: "completed", label: "Completed" },
                { value: "pending", label: "Pending" },
                { value: "cancelled", label: "Cancelled" },
              ]}
            />
          </div>
        </div>
        <DataTable
          columns={columns}
          rows={data.results}
          loading={loading}
          emptyTitle="No orders yet"
          emptyIcon={<FiShoppingCart />}
        />
        <Pagination page={page} count={data.count} onChange={setPage} />
      </Card>

      <OrderForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSaved={fetchData}
      />

      <Modal
        open={Boolean(viewing)}
        onClose={() => setViewing(null)}
        title={`Order · ${viewing?.reference || viewing?.reference_number || `#${viewing?.id}`}`}
        size="lg"
        footer={
          canCancel && (
            <RoleGate allow={MANAGER_ADMIN}>
              <Button
                variant="danger"
                icon={<FiSlash />}
                onClick={() => setCancelling(viewing)}
              >
                Cancel order
              </Button>
            </RoleGate>
          )
        }
      >
        {viewing && (
          <div>
            <div className="form-grid mb">
              <div className="col">
                <span className="muted">Customer</span>
                <span className="strong">
                  {viewing.customer_name || viewing.customer?.name || "Walk-in"}
                </span>
              </div>
              <div className="col">
                <span className="muted">Date</span>
                <span className="strong">
                  {formatDateTime(viewing.created_at || viewing.date)}
                </span>
              </div>
              <div className="col">
                <span className="muted">Payment</span>
                <span className="strong">
                  {PAYMENT_LABELS[viewing.payment_method] || viewing.payment_method}
                </span>
              </div>
              <div className="col">
                <span className="muted">Status</span>
                <span>
                  <OrderStatusBadge status={viewing.status} />
                </span>
              </div>
            </div>

            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th style={{ textAlign: "right" }}>Unit price</th>
                    <th style={{ textAlign: "right" }}>Qty</th>
                    <th style={{ textAlign: "right" }}>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((it, i) => {
                    const price = it.unit_price ?? it.selling_price ?? it.price ?? 0;
                    const qty = it.quantity ?? 0;
                    const sub = it.subtotal ?? it.total ?? price * qty;
                    return (
                      <tr key={i}>
                        <td>
                          {it.product_name || it.product?.name || `Product #${it.product}`}
                        </td>
                        <td className="num">{formatCurrency(price)}</td>
                        <td className="num">{qty}</td>
                        <td className="num">{formatCurrency(sub)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="order-total">
              <span>Total</span>
              <span>
                {formatCurrency(viewing.total ?? viewing.total_amount ?? viewing.grand_total)}
              </span>
            </div>

            {viewing.profit != null && (
              <p className="muted mt-0" style={{ marginTop: 10 }}>
                Profit on this order:{" "}
                <span className="text-success strong">
                  {formatCurrency(viewing.profit)}
                </span>
              </p>
            )}
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={Boolean(cancelling)}
        title="Cancel order"
        message="This will mark the order as cancelled and restore the stock it deducted. Continue?"
        confirmLabel="Cancel order"
        cancelLabel="Keep order"
        loading={cancelLoading}
        onConfirm={confirmCancel}
        onClose={() => setCancelling(null)}
      />
    </div>
  );
}
