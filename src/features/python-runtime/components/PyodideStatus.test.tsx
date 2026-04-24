import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { PyodideStatus } from "./PyodideStatus";

describe("PyodideStatus", () => {
  it("renders the status container", () => {
    render(<PyodideStatus state="idle" error={null} onRetry={vi.fn()} />);
    expect(screen.getByTestId("pyodide-status")).toBeInTheDocument();
  });

  it("shows idle message", () => {
    render(<PyodideStatus state="idle" error={null} onRetry={vi.fn()} />);
    expect(screen.getByText("Python runtime not started")).toBeInTheDocument();
  });

  it("shows loading message", () => {
    render(<PyodideStatus state="loading" error={null} onRetry={vi.fn()} />);
    expect(screen.getByText("Loading Python runtime...")).toBeInTheDocument();
  });

  it("shows loading hint during loading", () => {
    render(<PyodideStatus state="loading" error={null} onRetry={vi.fn()} />);
    expect(screen.getByTestId("pyodide-loading-hint")).toBeInTheDocument();
    expect(
      screen.getByText("(this may take a few seconds)"),
    ).toBeInTheDocument();
  });

  it("shows ready message", () => {
    render(<PyodideStatus state="ready" error={null} onRetry={vi.fn()} />);
    expect(screen.getByText("Python ready")).toBeInTheDocument();
  });

  it("shows error message", () => {
    render(<PyodideStatus state="error" error={null} onRetry={vi.fn()} />);
    expect(
      screen.getByText("Failed to load Python runtime"),
    ).toBeInTheDocument();
  });

  it("shows error detail when provided", () => {
    render(
      <PyodideStatus state="error" error="Network timeout" onRetry={vi.fn()} />,
    );
    expect(screen.getByTestId("pyodide-error")).toBeInTheDocument();
    expect(screen.getByText("Network timeout")).toBeInTheDocument();
  });

  it("shows retry button in error state", () => {
    render(<PyodideStatus state="error" error="Failed" onRetry={vi.fn()} />);
    expect(screen.getByTestId("pyodide-retry")).toBeInTheDocument();
  });

  it("does not show retry button in non-error states", () => {
    render(<PyodideStatus state="ready" error={null} onRetry={vi.fn()} />);
    expect(screen.queryByTestId("pyodide-retry")).not.toBeInTheDocument();
  });

  it("calls onRetry when retry button is clicked", async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    render(<PyodideStatus state="error" error="Failed" onRetry={onRetry} />);

    await user.click(screen.getByTestId("pyodide-retry"));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("does not show loading hint in non-loading states", () => {
    render(<PyodideStatus state="ready" error={null} onRetry={vi.fn()} />);
    expect(
      screen.queryByTestId("pyodide-loading-hint"),
    ).not.toBeInTheDocument();
  });

  it("renders status indicator dot", () => {
    render(<PyodideStatus state="ready" error={null} onRetry={vi.fn()} />);
    expect(screen.getByTestId("pyodide-status-indicator")).toBeInTheDocument();
  });

  it("has green indicator when ready", () => {
    render(<PyodideStatus state="ready" error={null} onRetry={vi.fn()} />);
    const indicator = screen.getByTestId("pyodide-status-indicator");
    expect(indicator.className).toContain("bg-green-500");
  });

  it("has yellow pulsing indicator when loading", () => {
    render(<PyodideStatus state="loading" error={null} onRetry={vi.fn()} />);
    const indicator = screen.getByTestId("pyodide-status-indicator");
    expect(indicator.className).toContain("bg-yellow-500");
    expect(indicator.className).toContain("animate-pulse");
  });

  it("has red indicator when error", () => {
    render(<PyodideStatus state="error" error="err" onRetry={vi.fn()} />);
    const indicator = screen.getByTestId("pyodide-status-indicator");
    expect(indicator.className).toContain("bg-red-500");
  });

  it("has gray indicator when idle", () => {
    render(<PyodideStatus state="idle" error={null} onRetry={vi.fn()} />);
    const indicator = screen.getByTestId("pyodide-status-indicator");
    expect(indicator.className).toContain("bg-gray-500");
  });
});
