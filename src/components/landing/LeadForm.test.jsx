import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

import LeadForm from "./LeadForm";

// Mock the API module so no real network call is made.
vi.mock("../../api/leadsApi", () => ({
  LEAD_KIND: { SIGNUP: "signup", DEMO: "demo" },
  default: {
    requestAccount: vi.fn(),
    requestDemo: vi.fn(),
  },
}));

import leadsApi from "../../api/leadsApi";

describe("LeadForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("submits a signup lead and shows the success state", async () => {
    leadsApi.requestAccount.mockResolvedValue({ detail: "ok" });

    render(<LeadForm kind="signup" source="hero" />);

    fireEvent.change(screen.getByLabelText(/full name/i), {
      target: { value: "Sarah Nakabugo" },
    });
    fireEvent.change(screen.getByLabelText(/^email/i), {
      target: { value: "sarah@example.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: /create my account/i }));

    await waitFor(() =>
      expect(screen.getByText(/you're on the list/i)).toBeInTheDocument()
    );

    expect(leadsApi.requestAccount).toHaveBeenCalledWith(
      expect.objectContaining({ full_name: "Sarah Nakabugo", source: "hero" })
    );
  });

  it("shows per-field errors from the server", async () => {
    leadsApi.requestAccount.mockRejectedValue({
      response: { status: 400, data: { email: ["Enter a valid email."] } },
    });

    render(<LeadForm kind="signup" source="hero" />);

    fireEvent.change(screen.getByLabelText(/full name/i), {
      target: { value: "Sarah" },
    });
    fireEvent.change(screen.getByLabelText(/^email/i), {
      target: { value: "bad" },
    });
    fireEvent.click(screen.getByRole("button", { name: /create my account/i }));

    await waitFor(() =>
      expect(screen.getAllByText(/enter a valid email/i).length).toBeGreaterThan(0)
    );
  });

  it("uses the demo CTA label and endpoint for demo leads", () => {
    render(<LeadForm kind="demo" source="demo-page" />);
    expect(
      screen.getByRole("button", { name: /request my demo/i })
    ).toBeInTheDocument();
  });
});
