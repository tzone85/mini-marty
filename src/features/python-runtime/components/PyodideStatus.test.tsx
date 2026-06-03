import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PyodideStatus } from "./PyodideStatus";

describe("PyodideStatus", () => {
  it("renders the idle status with no retry button", () => {
    render(<PyodideStatus state="idle" error={null} onRetry={() => {}} />);
    expect(screen.getByTestId("pyodide-status")).toHaveTextContent(
      /not started/i,
    );
    expect(screen.queryByTestId("pyodide-retry")).not.toBeInTheDocument();
  });

  it("shows the loading hint when state=loading", () => {
    render(<PyodideStatus state="loading" error={null} onRetry={() => {}} />);
    expect(screen.getByTestId("pyodide-loading-hint")).toBeInTheDocument();
  });

  it("renders the ready indicator when state=ready", () => {
    render(<PyodideStatus state="ready" error={null} onRetry={() => {}} />);
    expect(screen.getByTestId("pyodide-status")).toHaveTextContent(/ready/i);
  });

  it("surfaces the error message and a retry button when state=error", () => {
    const onRetry = vi.fn();
    render(<PyodideStatus state="error" error="net fail" onRetry={onRetry} />);
    expect(screen.getByTestId("pyodide-error")).toHaveTextContent("net fail");
    fireEvent.click(screen.getByTestId("pyodide-retry"));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
