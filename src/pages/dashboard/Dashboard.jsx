import { Link } from "react-router-dom";
import {
  FiBox,
  FiDollarSign,
  FiAlertTriangle,
  FiXCircle,
  FiShoppingCart,
  FiTrendingUp,
  FiUsers,
} from "react-icons/fi";

import PageHeader from "../../components/common/PageHeader";
import Card from "../../components/common/Card";
import StatCard from "../../components/cards/StatCard";
import Alert from "../../components/common/Alert";
import Button from "../../components/common/Button";
import { LoadingBlock } from "../../components/common/Spinner";
import DataTable from "../../components/common/DataTable";
import { StockBadge } from "../../components/common/Badge";
import BarChart from "../../components/charts/BarChart";
import HBarList from "../../components/charts/HBarList";
import useFetch from "../../hooks/useFetch";
import reportsApi from "../../api/reportsApi";
import useAuth from "../../hooks/useAuth";
import formatCurrency from "../../utils/formatCurrency";

// Reads the first key present on an object — the dashboard payload field names
// can vary, so we try a few sensible aliases.
function pick(obj, keys, fallback = 0) {
  if (!obj) return fallback;
  for (const key of keys) {
    if (obj[key] !== undefined && obj[key] !== null) return obj[key];
  }
  return fallback;
}

function asArray(value) {
  if (Array.isArray(value)) return value;
  if (value && Array.isArray(value.results)) return value.results;
  return [];
}

export default function Dashboard() {
  const { user } = useAuth();
  const { data, loading, error, refetch } = useFetch(() => reportsApi.dashboard(), []);
  const daily = useFetch(() => reportsApi.dailySales(14), []);
  const best = useFetch(() => reportsApi.bestSelling(5), []);
  const lowStock = useFetch(() => reportsApi.lowStock(), []);

  if (loading) return <LoadingBlock label="Loading dashboard…" />;

  // Surface secondary-fetch failures instead of rendering silent empty charts.
  const partialError = daily.error || best.error || lowStock.error;
  const retryPartials = () => {
    if (daily.error) daily.refetch();
    if (best.error) best.refetch();
    if (lowStock.error) lowStock.refetch();
  };

  const d = data || {};

  const totalProducts = pick(d, ["total_products", "products", "product_count"]);
  const lowStockCount = pick(d, ["low_stock", "low_stock_count", "low_stock_products"]);
  const outOfStock = pick(d, ["out_of_stock", "out_of_stock_count"]);
  const totalSales = pick(d, ["total_sales", "sales_today", "today_sales", "total_revenue"]);
  const totalOrders = pick(d, ["total_orders", "orders", "orders_count", "order_count"]);
  const totalProfit = pick(d, ["total_profit", "profit", "profit_today"]);
  const totalCustomers = pick(d, ["total_customers", "customers", "customer_count"]);

  const dailyData = asArray(daily.data).map((row) => ({
    label: String(pick(row, ["date", "day", "label"], "")).slice(5),
    value: Number(pick(row, ["total", "total_sales", "sales", "revenue", "amount"])),
  }));

  const bestData = asArray(best.data).map((row) => ({
    label: pick(row, ["product_name", "name", "product"], "Product"),
    value: Number(pick(row, ["total_quantity", "quantity_sold", "units_sold", "quantity"])),
    sub: `${pick(row, ["total_quantity", "quantity_sold", "units_sold", "quantity"])} sold`,
  }));

  const lowStockRows = asArray(lowStock.data).slice(0, 6);

  return (
    <div>
      <PageHeader
        title={`Welcome back${user?.full_name ? `, ${user.full_name.split(" ")[0]}` : ""}`}
        subtitle="Here's what's happening in your store today."
      />

      {error && (
        <Alert
          variant="error"
          title="Couldn't load your dashboard"
          action={
            <Button size="sm" variant="subtle" onClick={refetch}>
              Retry
            </Button>
          }
        >
          Check your connection and try again.
        </Alert>
      )}

      {partialError && (
        <Alert
          variant="warning"
          title="Some data couldn't be loaded"
          action={
            <Button size="sm" variant="subtle" onClick={retryPartials}>
              Retry
            </Button>
          }
        >
          Part of your dashboard is out of date.
        </Alert>
      )}

      <div className="stat-grid">
        <StatCard
          label="Total Products"
          value={Number(totalProducts).toLocaleString()}
          icon={<FiBox />}
          tone="blue"
        />
        <StatCard
          label="Sales"
          value={formatCurrency(totalSales)}
          hint="Revenue"
          icon={<FiDollarSign />}
          tone="green"
        />
        <StatCard
          label="Orders"
          value={Number(totalOrders).toLocaleString()}
          icon={<FiShoppingCart />}
          tone="purple"
        />
        <StatCard
          label="Profit"
          value={formatCurrency(totalProfit)}
          icon={<FiTrendingUp />}
          tone="green"
        />
        <StatCard
          label="Low Stock"
          value={Number(lowStockCount).toLocaleString()}
          hint="At or below reorder level"
          icon={<FiAlertTriangle />}
          tone="orange"
        />
        <StatCard
          label="Out of Stock"
          value={Number(outOfStock).toLocaleString()}
          icon={<FiXCircle />}
          tone="red"
        />
        <StatCard
          label="Customers"
          value={Number(totalCustomers).toLocaleString()}
          icon={<FiUsers />}
          tone="slate"
        />
      </div>

      <div className="chart-grid mb">
        <Card
          title="Sales — last 14 days"
          actions={<Link to="/reports" className="muted">View reports →</Link>}
        >
          <BarChart data={dailyData} color="blue" formatValue={formatCurrency} />
        </Card>

        <Card title="Best sellers">
          <HBarList data={bestData} formatValue={(v) => `${v}`} />
        </Card>
      </div>

      <Card
        title="Low stock alerts"
        actions={<Link to="/products?low_stock=true" className="muted">All products →</Link>}
      >
        <DataTable
          columns={[
            { key: "name", header: "Product", render: (r) => <span className="cell-strong">{r.name}</span> },
            { key: "sku", header: "SKU", render: (r) => <span className="cell-muted">{r.sku}</span> },
            { key: "quantity", header: "Qty", align: "right", render: (r) => r.quantity },
            { key: "reorder", header: "Reorder", align: "right", render: (r) => r.reorder_level },
            {
              key: "status",
              header: "Status",
              render: (r) => (
                <StockBadge quantity={r.quantity} reorderLevel={r.reorder_level} />
              ),
            },
          ]}
          rows={lowStockRows}
          emptyTitle="All stocked up"
          emptyMessage="No products are below their reorder level."
        />
      </Card>
    </div>
  );
}
