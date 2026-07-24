import { useCallback, useMemo, useState } from "react";

import { LEAD_KIND } from "../../api/leadsApi";
import { LeadModalContext } from "./leadModal";
import LeadFormModal from "./LeadFormModal";

/**
 * Lets any CTA button anywhere on the marketing site open the lead form,
 * pre-set to "signup" or "demo" and tagged with the section it came from.
 */
export function LeadModalProvider({ children }) {
  const [state, setState] = useState({ open: false, kind: LEAD_KIND.SIGNUP, source: "" });

  const openLead = useCallback(
    (kind = LEAD_KIND.SIGNUP, source = "") => setState({ open: true, kind, source }),
    []
  );
  const close = useCallback(() => setState((s) => ({ ...s, open: false })), []);

  const value = useMemo(() => ({ openLead }), [openLead]);

  return (
    <LeadModalContext.Provider value={value}>
      {children}
      <LeadFormModal
        open={state.open}
        kind={state.kind}
        source={state.source}
        onClose={close}
      />
    </LeadModalContext.Provider>
  );
}
