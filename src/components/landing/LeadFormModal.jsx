import Modal from "../common/Modal";
import LeadForm from "./LeadForm";
import { LEAD_KIND } from "../../api/leadsApi";

export default function LeadFormModal({ open, kind = LEAD_KIND.SIGNUP, source, onClose }) {
  const isDemo = kind === LEAD_KIND.DEMO;
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isDemo ? "Book a live demo" : "Create your free account"}
    >
      <p className="lead-modal__lead">
        {isDemo
          ? "Tell us a little about your shop and we'll set up a walkthrough at a time that suits you."
          : "Tell us about your shop and we'll get your account ready — we'll even help you import your stock."}
      </p>
      <LeadForm kind={kind} source={source} onDone={() => {}} />
    </Modal>
  );
}
