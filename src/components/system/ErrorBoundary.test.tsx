import { describe, expect, it, vi, beforeAll, afterAll } from "vitest";
import { render, screen } from "@testing-library/react";
import { ErrorBoundary } from "./ErrorBoundary";
import { MemoryErrorReporter } from "@/lib/observability/memory-reporter";

function Bomb(): React.ReactElement {
  throw new Error("boom");
}

describe("ErrorBoundary", () => {
  // Suppress React's expected console.error output during error boundary tests
  let consoleSpy: ReturnType<typeof vi.spyOn>;
  beforeAll(() => {
    consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });
  afterAll(() => {
    consoleSpy.mockRestore();
  });

  it("renders fallback and reports", () => {
    const reporter = new MemoryErrorReporter();
    render(
      <ErrorBoundary reporter={reporter} fallback={<p>Crashed</p>}>
        <Bomb />
      </ErrorBoundary>,
    );
    expect(screen.getByText("Crashed")).toBeInTheDocument();
    expect(reporter.entries).toHaveLength(1);
  });
  it("renders children when no error", () => {
    const reporter = new MemoryErrorReporter();
    render(
      <ErrorBoundary reporter={reporter} fallback={<p>x</p>}>
        <p>ok</p>
      </ErrorBoundary>,
    );
    expect(screen.getByText("ok")).toBeInTheDocument();
  });
});
