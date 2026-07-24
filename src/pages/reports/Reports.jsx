import { useEffect, useState } from "react";
import {
  FiDollarSign,
  FiTrendingUp,
  FiPercent,
  FiPackage,
} from "react-icons/fi";

import PageHeader from "../../components/common/PageHeader";
import Card from "../../components/common/Card";
import StatCard from "../../components/cards/StatCard";
import Alert from "../../components/common/Alert";
import Button from "../../components/common/Button";
import Select from "../../components/common/Select";
import DataTable from "../../components/common/DataTable";
import { StockBadge } from "../../components/common/Badge";
import BarChart from "../../components/charts/BarChart";
import HBarList from "../../components/charts/HBarList";
import reportsApi from "../../api/reportsApi";
import formatCurrency from "../../utils/formatCurrency";
import { asResults } from "../../utils/pagination";

function pick(obj, keys, fallback = 0) {
  if (!obj) return fallback;
  for (const k of keys) if (obj[k] != null) return obj[k];
  return fallback;
}

export default function Reports() {
  const [days, setDays] = useState(30);
  const [months, setMonths] = useState(12);

  const [daily, setDaily] = useState([]);
  const [monthly, setMonthly] = useState([]);
  const [profit, setProfit] = useState(null);
  const [best, setBest] = useState([]);
  const [lowStock, setLowStock] = useState([]);

  // Track load failures so we can show a retry banner instead of a blank chart.
  const [hasError, setHasError] = useState(false);
  const [reloadTick, setReloadTick] = useState(0);
  const retry = () => {
    setHasError(false);
    setReloadTick((t) => t + 1);
  };
  const onFail = () => setHasError(true);

  useEffect(() => {
    reportsApi.dailySales(days).then((d) => setDaily(asResults(d))).catch(onFail);
    reportsApi.profit(days).then(setProfit).catch(onFail);
  }, [days, reloadTick]);

  useEffect(() => {
    reportsApi.monthlySales(months).then((d) => setMonthly(asResults(d))).catch(onFail);
  }, [months, reloadTick]);

  useEffect(() => {
    reportsApi.bestSelling(10).then((d) => setBest(asResults(d))).catch(onFail);
    reportsApi.lowStock().then((d) => setLowStock(asResults(d))).catch(onFail);
  }, [reloadTick]);

  const dailyData = daily.map((r) => ({
    label: String(pick(r, ["date", "day", "label"], "")).slice(5),
    value: Number(pick(r, ["total", "total_sales", "sales", "revenue", "amount"])),
  }));

  const monthlyData = monthly.map((r) => ({
    label: String(pick(r, ["month", "label", "period"], "")).slice(0, 7),
    value: Number(pick(r, ["total", "total_sales", "sales", "revenue", "amount"])),
  }));

  const bestData = best.map((r) => ({
    label: pick(r, ["product_name", "name", "product"], "Product"),
    value: Number(pick(r, ["total_quantity", "quantity_sold", "units_sold", "quantity"])),
    sub: "units",
  }));

  const revenue = pick(profit, ["revenue", "total_revenue", "sales"]);
  const cost = pick(profit, ["cost", "total_cost"]);
  const profitValue = pick(profit, ["profit", "total_profit", "net_profit"]);
  const margin = pick(profit, ["margin", "profit_margin"]);

  return (
    <div>
      <PageHeader
        title="Reports"
        subtitle="Sales, profit, and inventory analytics."
      />

      {hasError && (
        <Alert
          variant="error"
          title="Some reports couldn't be loaded"
          action={
            <Button size="sm" variant="subtle" onClick={retry}>
              Retry
            </Button>
          }
        >
          Check your connection and try again.
        </Alert>
      )}

      <div className="stat-grid">
        <StatCard label="Revenue" value={formatCurrency(revenue)} icon={<FiDollarSign />} tone="blue" hint={`Last ${days} days`} />
        <StatCard label="Cost of goods" value={formatCurrency(cost)} icon={<FiPackage />} tone="slate" hint={`Last ${days} days`} />
        <StatCard label="Profit" value={formatCurrency(profitValue)} icon={<FiTrendingUp />} tone="green" hint={`Last ${days} days`} />
        <StatCard
          label="Margin"
          value={`${Number(margin).toFixed(1)}%`}
          icon={<FiPercent />}
          tone="orange"
        />
      </div>

      <div className="chart-grid mb">
        <Card
          title="Daily sales"
          actions={
            <div style={{ minWidth: 130 }}>
              <Select
                includeBlank={false}
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                options={[
                  { value: 7, label: "Last 7 days" },
                  { value: 30, label: "Last 30 days" },
                  { value: 90, label: "Last 90 days" },
                ]}
              />
            </div>
          }
        >
          <BarChart data={dailyData} color="blue" formatValue={formatCurrency} />
        </Card>

        <Card
          title="Monthly sales"
          actions={
            <div style={{ minWidth: 130 }}>
              <Select
                includeBlank={false}
                value={months}
                onChange={(e) => setMonths(Number(e.target.value))}
                options={[
                  { value: 6, label: "Last 6 months" },
                  { value: 12, label: "Last 12 months" },
                ]}
              />
            </div>
          }
        >
          <BarChart data={monthlyData} color="accent" formatValue={formatCurrency} />
        </Card>
      </div>

      <div className="chart-grid mb">
        <Card title="Best selling products">
          <HBarList data={bestData} formatValue={(v) => `${v} units`} />
        </Card>

        <Card title="Low stock">
          <DataTable
            columns={[
              { key: "name", header: "Product", render: (p) => <span className="cell-strong">{p.name}</span> },
              { key: "quantity", header: "Qty", align: "right", render: (p) => p.quantity },
              {
                key: "status",
                header: "Status",
                render: (p) => <StockBadge quantity={p.quantity} reorderLevel={p.reorder_level} />,
              },
            ]}
            rows={lowStock}
            emptyTitle="All stocked up"
          />
        </Card>
      </div>
    </div>
  );
}
