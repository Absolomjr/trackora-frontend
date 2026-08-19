import { Link } from "react-router-dom";
import { FiArrowUpRight, FiArrowDownRight, FiPackage } from "react-icons/fi";

import { OrderStatusBadge } from "../../components/common/Badge";
import formatCurrency from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";

/* ---- helpers ------------------------------------------------------------ */
export function timeAgo(iso) {
  if (!iso) return "";
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

const num = (v) => Number(v || 0).toLocaleString();

/* ---- KPI card ----------------------------------------------------------- */
export function KpiCard({ label, value, icon, tone = "green", delta, note }) {
  return (
    <div className="kpi">
      <span className={`kpi__icon tile-${tone}`}>{icon}</span>
      <div className="kpi__body">
        <span className="kpi__label">{label}</span>
        <span className="kpi__value">{value}</span>
        {delta && (
          <span className={`kpi__delta kpi__delta--${delta.direction}`}>
            {delta.direction === "up" ? <FiArrowUpRight /> : <FiArrowDownRight />}
            {delta.pct}% {note && <span className="kpi__note">{note}</span>}
          </span>
        )}
      </div>
    </div>
  );
}

/* ---- panel wrapper ------------------------------------------------------ */
export function Panel({ title, action, children, className = "" }) {
  return (
    <section className={`panel ${className}`}>
      <header className="panel__head">
        <h3 className="panel__title">{title}</h3>
        {action}
      </header>
      {children}
    </section>
  );
}

/* ---- sales trend bars --------------------------------------------------- */
export function TrendChart({ data = [] }) {
  const max = Math.max(1, ...data.map((d) => Number(d.revenue || 0)));
  const total = data.reduce((s, d) => s + Number(d.revenue || 0), 0);
  return (
    <div className="trend">
      <div className="trend__bars">
        {data.map((d) => {
          const v = Number(d.revenue || 0);
          const label = new Date(d.day).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
          return (
            <div className="trend__col" key={d.day} title={`${label}: ${formatCurrency(v)}`}>
              <span className="trend__bar" style={{ height: `${(v / max) * 100}%` }} />
              <span className="trend__x">{new Date(d.day).getDate()}</span>
            </div>
          );
        })}
      </div>
      <div className="trend__foot">
        <span className="trend__legend"><i /> Sales</span>
        <span>Total: <strong>{formatCurrency(total)}</strong></span>
      </div>
    </div>
  );
}

/* ---- top products ------------------------------------------------------- */
export function TopProducts({ rows = [] }) {
  if (!rows.length) return <p className="panel__empty">No sales yet.</p>;
  return (
    <table className="mini-table">
      <thead>
        <tr><th>#</th><th>Product</th><th className="num">Sold</th><th className="num">Revenue</th></tr>
      </thead>
      <tbody>
        {rows.map((p, i) => (
          <tr key={p.sku || i}>
            <td className="mini-rank">{i + 1}</td>
            <td>
              <div className="prod-cell">
                {p.image ? <img src={p.image} alt="" loading="lazy" /> : <span className="prod-cell__ph"><FiPackage /></span>}
                <span><strong>{p.name}</strong><em>{p.sku}</em></span>
              </div>
            </td>
            <td className="num">{num(p.sold)}</td>
            <td className="num">{formatCurrency(p.revenue)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/* ---- low-stock alerts --------------------------------------------------- */
export function LowStockAlerts({ rows = [] }) {
  if (!rows.length) return <p className="panel__empty">Everything is well stocked.</p>;
  return (
    <table className="mini-table">
      <thead>
        <tr><th>Product</th><th>SKU</th><th className="num">Stock</th><th className="num">Reorder</th><th>Status</th></tr>
      </thead>
      <tbody>
        {rows.map((p, i) => (
          <tr key={p.sku || i}>
            <td><strong>{p.name}</strong></td>
            <td className="mini-muted">{p.sku}</td>
            <td className="num" style={{ color: "var(--danger-700)", fontWeight: 600 }}>{num(p.quantity)}</td>
            <td className="num mini-muted">{num(p.reorder_level)}</td>
            <td><span className={`chip chip--${p.status === "critical" ? "danger" : "warn"}`}>{p.status === "critical" ? "Critical" : "Low"}</span></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/* ---- recent orders ------------------------------------------------------ */
export function RecentOrders({ rows = [] }) {
  if (!rows.length) return <p className="panel__empty">No orders yet.</p>;
  return (
    <table className="mini-table">
      <thead>
        <tr><th>Order</th><th>Customer</th><th className="num">Amount</th><th>Status</th></tr>
      </thead>
      <tbody>
        {rows.map((o, i) => (
          <tr key={o.reference || i}>
            <td><strong>{o.reference}</strong><em className="mini-sub">{formatDate(o.date)}</em></td>
            <td>{o.customer}</td>
            <td className="num">{formatCurrency(o.amount)}</td>
            <td><OrderStatusBadge status={o.status} /></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/* ---- recent stock movements --------------------------------------------- */
export function RecentMovements({ rows = [] }) {
  if (!rows.length) return <p className="panel__empty">No stock movements yet.</p>;
  return (
    <table className="mini-table">
      <thead>
        <tr><th>Product</th><th>Type</th><th className="num">Qty</th><th>Reference</th><th>When</th></tr>
      </thead>
      <tbody>
        {rows.map((m, i) => (
          <tr key={i}>
            <td><strong>{m.product}</strong><em className="mini-sub">{m.sku}</em></td>
            <td><span className={`chip chip--${m.type === "in" ? "green" : "warn"}`}>{m.type === "in" ? "Stock In" : "Stock Out"}</span></td>
            <td className="num">{num(m.quantity)}</td>
            <td className="mini-muted">{m.reference}</td>
            <td className="mini-muted">{timeAgo(m.created_at)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/* ---- recent activity feed ----------------------------------------------- */
export function RecentActivity({ rows = [] }) {
  if (!rows.length) return <p className="panel__empty">No recent activity.</p>;
  return (
    <ul className="activity">
      {rows.map((a, i) => (
        <li key={i} className="activity__item">
          <span className={`activity__dot activity__dot--${a.type}`} />
          <span className="activity__text">{a.text}</span>
          <span className="activity__time">{timeAgo(a.at)}</span>
        </li>
      ))}
    </ul>
  );
}

/* ---- quick actions (staff) ---------------------------------------------- */
export function QuickAction({ to, icon, title, subtitle }) {
  return (
    <Link to={to} className="quick-action">
      <span className="quick-action__icon">{icon}</span>
      <span>
        <span className="quick-action__title">{title}</span>
        <span className="quick-action__sub">{subtitle}</span>
      </span>
    </Link>
  );
}
