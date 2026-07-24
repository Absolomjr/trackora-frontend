import { createContext, useContext } from "react";

/** Shared context object + hook, kept separate from the provider component
 *  so the provider file only exports components (fast-refresh friendly). */
export const LeadModalContext = createContext(null);

export function useLeadModal() {
  const ctx = useContext(LeadModalContext);
  if (!ctx) throw new Error("useLeadModal must be used inside <LeadModalProvider>");
  return ctx;
}
