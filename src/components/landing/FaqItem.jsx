import { useState } from "react";
import { LuChevronDown } from "react-icons/lu";

export default function FaqItem({ q, a, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={`faq-item ${open ? "is-open" : ""}`}>
      <button
        className="faq-item__q"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span>{q}</span>
        <LuChevronDown className="faq-item__chevron" />
      </button>
      <div className="faq-item__a" hidden={!open}>
        <p>{a}</p>
      </div>
    </div>
  );
}
