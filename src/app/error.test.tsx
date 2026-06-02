import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ErrorPage from "./error";

describe("ErrorPage", () => {
  it("renders a fixed friendly message and a retry button", () => {
    const reset = vi.fn();
    render(<ErrorPage error={new Error("kaboom")} reset={reset} />);
    const alert = screen.getByRole("alert");
    expect(alert).toBeInTheDocument();
    // Raw error.message must NOT leak into visible text.
    expect(alert.textContent).not.toContain("kaboom");
    // It is preserved only as a debug attribute for support diagnostics.
    expect(alert.querySelector("[data-error-message]")).toHaveAttribute(
      "data-error-message",
      "kaboom",
    );
    fireEvent.click(screen.getByRole("button", { name: /try again/i }));
    expect(reset).toHaveBeenCalledTimes(1);
  });
});
