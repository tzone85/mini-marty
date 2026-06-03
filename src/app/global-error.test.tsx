import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import GlobalError from "./global-error";

describe("GlobalError", () => {
  it("renders an alert with a fixed message and a reload action", () => {
    const reset = vi.fn();
    // Suppress the React warning about <html> in <div> during the test render.
    const originalError = console.error;
    console.error = (...args: unknown[]) => {
      const first = String(args[0] ?? "");
      if (first.includes("validateDOMNesting") || first.includes("cannot")) {
        return;
      }
      originalError(...(args as []));
    };

    try {
      render(<GlobalError error={new Error("global boom")} reset={reset} />);
      const alert = screen.getByRole("alert");
      // Raw message is preserved only as a diagnostic attribute.
      expect(alert.textContent).not.toContain("global boom");
      expect(alert.querySelector("[data-error-message]")).toHaveAttribute(
        "data-error-message",
        "global boom",
      );
      const button = screen.getByRole("button", { name: /reload/i });
      expect(button).toHaveAttribute("type", "button");
      fireEvent.click(button);
      expect(reset).toHaveBeenCalledTimes(1);
    } finally {
      console.error = originalError;
    }
  });
});
