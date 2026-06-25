import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FiPlus, FiEye } from "react-icons/fi";

import PageHeader from "../../components/common/PageHeader";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import DataTable from "../../components/common/DataTable";
import Pagination from "../../components/common/Pagination";
import StockMovementForm from "./StockMovementForm";
import { formatDateTime } from "../../utils/formatDate";
import formatCurrency from "../../utils/formatCurrency";
import parseApiError from "../../utils/apiError";
import { asCount, asResults } from "../../utils/pagination";

// Reads the line items off a record regardless of the backend's field name.
function recordItems(record) {
  if (!record) return [];
  return record.items || record.line_items || record.stock_items || [];
}

/**
 * Shared list page for stock-in / stock-out.
 * Pass the matching api client and `kind` ("in" | "out").
 */
export default function StockMovementList({
  api,
  kind,
  title,
  subtitle,
  icon,
  itemsKey = "items",
}) {
  const isIn = kind === "in";
  const [page, setPage] = useState(1);
  const [data, setData] = useState({ count: 0, results: [] });
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [viewing, setViewing] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await api.list({ page });
      setData({ count: asCount(result), results: asResults(result) });
    } catch (err) {
      toast.error(parseApiError(err).message);
    } finally {
      setLoading(false);
    }
  }, [api, page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const columns = [
    {
      key: "reference",
      header: "Reference",
      render: (r) => (
        <span className="cell-strong">
          {r.reference || r.reference_number || `#${r.id}`}
        </span>
      ),
    },
    {
      key: "date",
      header: "Date",
      render: (r) => formatDateTime(r.created_at || r.date),
    },
    {
      key: "items",
      header: "Items",
      align: "right",
      render: (r) => recordItems(r).length || r.items_count || "—",
    },
    {
      key: "by",
      header: "Recorded by",
      render: (r) =>
        r.created_by_name ||
        r.created_by?.full_name ||
        r.created_by?.email ||
        r.recorded_by ||
        "—",
    },
    {
      key: "actions",
      header: "",
      align: "right",
      render: (r) => (
        <div className="table__actions">
          <Button variant="ghost" size="sm" icon={<FiEye />} onClick={() => setViewing(r)}>
            View
          </Button>
        </div>
      ),
    },
  ];

  const viewItems = recordItems(viewing);

  return (
    <div>
      <PageHeader
        title={title}
        subtitle={subtitle}
        actions={
          <Button
            variant={isIn ? "success" : "danger"}
            icon={<FiPlus />}
            onClick={() => setFormOpen(true)}
          >
            {isIn ? "Record stock in" : "Record stock out"}
          </Button>
        }
      />

      <Card>
        <DataTable
          columns={columns}
          rows={data.results}
          loading={loading}
          emptyTitle={`No ${isIn ? "stock-in" : "stock-out"} records yet`}
          emptyIcon={icon}
        />
        <Pagination page={page} count={data.count} onChange={setPage} />
      </Card>

      <StockMovementForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        api={api}
        kind={kind}
        itemsKey={itemsKey}
        onSaved={fetchData}
      />

      <Modal
        open={Boolean(viewing)}
        onClose={() => setViewing(null)}
        title={`${isIn ? "Stock In" : "Stock Out"} · ${
          viewing?.reference || viewing?.reference_number || `#${viewing?.id}`
        }`}
        size="lg"
      >
        {viewing && (
          <div>
            <div className="row row--between mb">
              <span className="muted">
                {formatDateTime(viewing.created_at || viewing.date)}
              </span>
            </div>
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th style={{ textAlign: "right" }}>Quantity</th>
                    {isIn && <th style={{ textAlign: "right" }}>Unit cost</th>}
                  </tr>
                </thead>
                <tbody>
                  {viewItems.map((it, i) => (
                    <tr key={i}>
                      <td>{it.product_name || it.product?.name || `Product #${it.product}`}</td>
                      <td className="num">{it.quantity}</td>
                      {isIn && (
                        <td className="num">
                          {it.unit_cost != null ? formatCurrency(it.unit_cost) : "—"}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {viewing.notes && (
              <p className="muted mt">
                <strong>Notes:</strong> {viewing.notes}
              </p>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
