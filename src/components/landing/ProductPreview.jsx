import { useState } from "react";

const TABS = [
  { key: "dashboard", label: "Dashboard" },
  { key: "products", label: "Products" },
  { key: "ledger", label: "Stock ledger" },
];

function DashboardScreen() {
  const bars = [45, 68, 52, 88, 60, 95, 74, 58, 80, 66];
  const kpis = [
    ["Sales", "UGX 1.84M", ""],
    ["Profit", "UGX 470K", "accent"],
    ["Orders", "38", ""],
    ["Low stock", "6", "warn"],
  ];
  return (
    <div className="pv-screen">
      <div className="pv-kpi-row">
        {kpis.map(([l, v, tone]) => (
          <div key={l} className={`pv-kpi ${tone ? `pv-kpi--${tone}` : ""}`}>
            <span className="pv-kpi__label">{l}</span>
            <span className="pv-kpi__value">{v}</span>
          </div>
        ))}
      </div>
      <div className="pv-panel">
        <div className="pv-panel__title">Sales — last 14 days</div>
        <div className="pv-chart">
          {bars.map((h, i) => (
            <span key={i} className="pv-bar" style={{ height: `${h}%` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ProductsScreen() {
  const rows = [
    ["Cement 50kg", "CEM-050", "Building", "4", "warn", "Low stock"],
    ["Iron sheets 30g", "IRN-030", "Roofing", "120", "ok", "In stock"],
    ["4″ nails (kg)", "NAL-004", "Fasteners", "0", "danger", "Out of stock"],
    ["PVC pipe 4″", "PVC-040", "Plumbing", "64", "ok", "In stock"],
    ["Electrical cable 2.5mm", "CAB-025", "Electrical", "18", "ok", "In stock"],
  ];
  return (
    <div className="pv-screen">
      <div className="pv-toolbar">
        <span className="pv-search">Search products…</span>
        <span className="pv-chip">Category</span>
        <span className="pv-chip">Low stock only</span>
      </div>
      <div className="pv-table">
        <div className="pv-tr pv-tr--head">
          <span>Product</span><span>SKU</span><span>Category</span>
          <span className="pv-num">Qty</span><span>Status</span>
        </div>
        {rows.map((r) => (
          <div key={r[1]} className="pv-tr">
            <span className="pv-cell-strong"><span className="pv-thumb" />{r[0]}</span>
            <span className="pv-muted">{r[1]}</span>
            <span><span className="pv-tag">{r[2]}</span></span>
            <span className="pv-num">{r[3]}</span>
            <span><span className={`hv-badge hv-badge--${r[4]}`}>{r[5]}</span></span>
          </div>
        ))}
      </div>
    </div>
  );
}

function LedgerScreen() {
  const rows = [
    ["SI-0042", "23 Jul", "5 items", "Achieng G."],
    ["SI-0041", "22 Jul", "2 items", "Okello P."],
    ["SI-0040", "22 Jul", "8 items", "Achieng G."],
  ];
  const items = [
    ["Cement 50kg", "40", "UGX 32,000", "UGX 1,280,000"],
    ["Iron sheets 30g", "25", "UGX 45,000", "UGX 1,125,000"],
  ];
  return (
    <div className="pv-screen">
      <div className="pv-table">
        <div className="pv-tr pv-tr--head pv-tr--ledger">
          <span>Reference</span><span>Date</span><span>Items</span><span>Recorded by</span>
        </div>
        {rows.map((r, i) => (
          <div key={r[0]} className={`pv-tr pv-tr--ledger ${i === 0 ? "is-active" : ""}`}>
            <span className="pv-cell-strong">{r[0]}</span>
            <span className="pv-muted">{r[1]}</span>
            <span>{r[2]}</span>
            <span className="pv-recorder"><span className="pv-avatar">{r[3][0]}</span>{r[3]}</span>
          </div>
        ))}
      </div>
      <div className="pv-panel pv-panel--items">
        <div className="pv-panel__title">SI-0042 · line items</div>
        {items.map((it) => (
          <div key={it[0]} className="pv-item-row">
            <span>{it[0]}</span>
            <span className="pv-num">{it[1]}</span>
            <span className="pv-muted">{it[2]}</span>
            <span className="pv-num pv-cell-strong">{it[3]}</span>
          </div>
        ))}
        <div className="pv-item-total">
          <span>Total</span><span className="pv-cell-strong">UGX 2,405,000</span>
        </div>
      </div>
    </div>
  );
}

const SCREENS = {
  dashboard: DashboardScreen,
  products: ProductsScreen,
  ledger: LedgerScreen,
};

export default function ProductPreview() {
  const [active, setActive] = useState("dashboard");
  const Screen = SCREENS[active];
  return (
    <div className="product-preview">
      <div className="pv-tabs" role="tablist">
        {TABS.map((t) => (
          <button
            key={t.key}
            role="tab"
            aria-selected={active === t.key}
            className={`pv-tab ${active === t.key ? "is-active" : ""}`}
            onClick={() => setActive(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="pv-frame">
        <div className="pv-frame__bar">
          <span /><span /><span />
        </div>
        <div className="pv-frame__body">
          <Screen />
        </div>
      </div>
    </div>
  );
}
