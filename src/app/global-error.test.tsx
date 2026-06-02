import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import GlobalError from "./global-error";

describe("GlobalError", () => {
  it("renders an alert with the error message and a reload action", () => {
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
      expect(screen.getByRole("alert")).toHaveTextContent("global boom");
      fireEvent.click(screen.getByRole("button", { name: /reload/i }));
      expect(reset).toHaveBeenCalledTimes(1);
    } finally {
      console.error = originalError;
    }
  });
});
