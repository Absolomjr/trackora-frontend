import { Link } from "react-router-dom";
import {
  FiBarChart2, FiTrendingUp, FiClipboard, FiAlertTriangle, FiLayers,
  FiShoppingCart, FiUsers, FiArrowDownCircle, FiArrowUpCircle, FiUserPlus,
} from "react-icons/fi";
import { LuLightbulb } from "react-icons/lu";

import formatCurrency from "../../utils/formatCurrency";
import {
  KpiCard, Panel, TrendChart, TopProducts, LowStockAlerts,
  RecentOrders, RecentMovements, RecentActivity, QuickAction,
} from "./widgets";

const money = (k) => formatCurrency(k?.value);
const count = (k) => Number(k?.value || 0).toLocaleString();
const viewAll = (to) => <Link to={to} className="panel__link">View all</Link>;

/* =====================================================================
   ADMIN
   ===================================================================== */
export function AdminDashboard({ data }) {
  const k = data.kpis || {};
  return (
    <>
      <div className="kpi-row">
        <KpiCard label="Total Sales" value={money(k.total_sales)} icon={<FiBarChart2 />} tone="green" delta={k.total_sales} note="vs last week" />
        <KpiCard label="Gross Profit" value={money(k.gross_profit)} icon={<FiTrendingUp />} tone="green" delta={k.gross_profit} note="vs last week" />
        <KpiCard label="Orders" value={count(k.orders)} icon={<FiClipboard />} tone="green" delta={k.orders} note="vs last week" />
        <KpiCard label="Low Stock Items" value={count(k.low_stock_items)} icon={<FiAlertTriangle />} tone="orange" />
      </div>

      <div className="dash-grid dash-grid--2-1">
        <Panel title="Sales Trend"><TrendChart data={data.sales_trend} /></Panel>
        <Panel title="Top Selling Products" action={viewAll("/products")}><TopProducts rows={data.top_products} /></Panel>
      </div>

      <div className="dash-grid dash-grid--2-1">
        <Panel title="Low Stock Alerts" action={viewAll("/products?low_stock=true")}><LowStockAlerts rows={data.low_stock} /></Panel>
        <Panel title="Recent Activity"><RecentActivity rows={data.recent_activity} /></Panel>
      </div>
    </>
  );
}

/* =====================================================================
   MANAGER
   ===================================================================== */
export function ManagerDashboard({ data }) {
  const k = data.kpis || {};
  return (
    <>
      <div className="kpi-row">
        <KpiCard label="Total Orders" value={count(k.total_orders)} icon={<FiClipboard />} tone="green" delta={k.total_orders} note="vs last month" />
        <KpiCard label="Inventory Value" value={money(k.inventory_value)} icon={<FiLayers />} tone="green" />
        <KpiCard label="Low Stock Items" value={count(k.low_stock_items)} icon={<FiAlertTriangle />} tone="orange" />
        <KpiCard label="Monthly Sales" value={money(k.monthly_sales)} icon={<FiBarChart2 />} tone="green" delta={k.monthly_sales} note="vs last month" />
      </div>

      <div className="dash-grid dash-grid--2-1">
        <Panel title="Sales Trend"><TrendChart data={data.sales_trend} /></Panel>
        <Panel title="Best Selling Products" action={viewAll("/products")}><TopProducts rows={data.top_products} /></Panel>
      </div>

      <div className="dash-grid dash-grid--1-1">
        <Panel title="Low Stock Alerts" action={viewAll("/products?low_stock=true")}><LowStockAlerts rows={data.low_stock} /></Panel>
        <Panel title="Recent Orders" action={viewAll("/orders")}><RecentOrders rows={data.recent_orders} /></Panel>
      </div>
    </>
  );
}

/* =====================================================================
   STAFF
   ===================================================================== */
export function StaffDashboard({ data }) {
  const k = data.kpis || {};
  return (
    <>
      <div className="kpi-row">
        <KpiCard label="Orders Created Today" value={count(k.orders_today)} icon={<FiShoppingCart />} tone="green" delta={k.orders_today} note="vs yesterday" />
        <KpiCard label="Customers Added" value={count(k.customers_today)} icon={<FiUsers />} tone="green" delta={k.customers_today} note="vs yesterday" />
        <KpiCard label="Stock In Entries" value={count(k.stock_in_today)} icon={<FiArrowDownCircle />} tone="green" delta={k.stock_in_today} note="vs yesterday" />
        <KpiCard label="Stock Out Entries" value={count(k.stock_out_today)} icon={<FiArrowUpCircle />} tone="orange" delta={k.stock_out_today} note="vs yesterday" />
      </div>

      <Panel title="Quick Actions" className="panel--flush">
        <div className="quick-grid">
          <QuickAction to="/stock-in" icon={<FiArrowDownCircle />} title="Record stock in" subtitle="Add incoming stock" />
          <QuickAction to="/stock-out" icon={<FiArrowUpCircle />} title="Record stock out" subtitle="Remove stock" />
          <QuickAction to="/orders" icon={<FiShoppingCart />} title="New order" subtitle="Create a new order" />
          <QuickAction to="/customers" icon={<FiUserPlus />} title="Add customer" subtitle="Add a new customer" />
        </div>
      </Panel>

      <div className="dash-grid dash-grid--1-1">
        <Panel title="Recent Stock Movements" action={<Link to="/stock-in" className="panel__link">View all</Link>}><RecentMovements rows={data.recent_movements} /></Panel>
        <Panel title="Recent Orders" action={<Link to="/orders" className="panel__link">View all</Link>}><RecentOrders rows={data.recent_orders} /></Panel>
      </div>

      <div className="dash-tip">
        <LuLightbulb />
        <span><strong>Tip.</strong> Keep stock entries updated to maintain accurate stock levels and avoid shortages.</span>
      </div>
    </>
  );
}
