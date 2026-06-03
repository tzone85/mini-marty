import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ExecutionControls } from "./ExecutionControls";

function renderControls(
  overrides: Partial<Parameters<typeof ExecutionControls>[0]> = {},
) {
  const defaultProps = {
    status: "idle" as const,
    speed: "normal" as const,
    onRun: vi.fn(),
    onStop: vi.fn(),
    onPause: vi.fn(),
    onResume: vi.fn(),
    onStep: vi.fn(),
    onSpeedChange: vi.fn(),
    ...overrides,
  };
  return {
    ...render(<ExecutionControls {...defaultProps} />),
    ...defaultProps,
  };
}

describe("ExecutionControls", () => {
  it("renders Run button when idle", () => {
    renderControls({ status: "idle" });
    expect(screen.getByTestId("run-button")).toBeInTheDocument();
  });

  it("renders Step button always", () => {
    renderControls({ status: "idle" });
    expect(screen.getByTestId("step-button")).toBeInTheDocument();
  });

  it("calls onRun when Run clicked", () => {
    const { onRun } = renderControls({ status: "idle" });
    fireEvent.click(screen.getByTestId("run-button"));
    expect(onRun).toHaveBeenCalledOnce();
  });

  it("shows Pause button when running", () => {
    renderControls({ status: "running" });
    expect(screen.getByTestId("pause-button")).toBeInTheDocument();
    expect(screen.queryByTestId("run-button")).not.toBeInTheDocument();
  });

  it("shows Stop button when running", () => {
    renderControls({ status: "running" });
    expect(screen.getByTestId("stop-button")).toBeInTheDocument();
  });

  it("calls onPause when Pause clicked", () => {
    const { onPause } = renderControls({ status: "running" });
    fireEvent.click(screen.getByTestId("pause-button"));
    expect(onPause).toHaveBeenCalledOnce();
  });

  it("shows Resume button when paused", () => {
    renderControls({ status: "paused" });
    expect(screen.getByTestId("resume-button")).toBeInTheDocument();
  });

  it("calls onResume when Resume clicked", () => {
    const { onResume } = renderControls({ status: "paused" });
    fireEvent.click(screen.getByTestId("resume-button"));
    expect(onResume).toHaveBeenCalledOnce();
  });

  it("calls onStop when Stop clicked", () => {
    const { onStop } = renderControls({ status: "running" });
    fireEvent.click(screen.getByTestId("stop-button"));
    expect(onStop).toHaveBeenCalledOnce();
  });

  it("calls onStep when Step clicked", () => {
    const { onStep } = renderControls({ status: "idle" });
    fireEvent.click(screen.getByTestId("step-button"));
    expect(onStep).toHaveBeenCalledOnce();
  });

  it("Step is disabled when running", () => {
    renderControls({ status: "running" });
    expect(screen.getByTestId("step-button")).toBeDisabled();
  });

  it("renders speed selector", () => {
    renderControls();
    expect(screen.getByTestId("speed-select")).toBeInTheDocument();
  });

  it("calls onSpeedChange when speed changed", () => {
    const { onSpeedChange } = renderControls();
    fireEvent.change(screen.getByTestId("speed-select"), {
      target: { value: "fast" },
    });
    expect(onSpeedChange).toHaveBeenCalledWith("fast");
  });

  it("shows Ready status when idle", () => {
    renderControls({ status: "idle" });
    expect(screen.getByTestId("status-indicator")).toHaveTextContent("Ready");
  });

  it("shows Running status", () => {
    renderControls({ status: "running" });
    expect(screen.getByTestId("status-indicator")).toHaveTextContent(
      "Running...",
    );
  });

  it("shows Paused status", () => {
    renderControls({ status: "paused" });
    expect(screen.getByTestId("status-indicator")).toHaveTextContent("Paused");
  });

  it("shows Done status when completed", () => {
    renderControls({ status: "completed" });
    expect(screen.getByTestId("status-indicator")).toHaveTextContent("Done");
  });

  it("shows Error status", () => {
    renderControls({ status: "error" });
    expect(screen.getByTestId("status-indicator")).toHaveTextContent("Error");
  });

  it("shows Step mode status when stepping", () => {
    renderControls({ status: "stepping" });
    expect(screen.getByTestId("status-indicator")).toHaveTextContent(
      "Step mode",
    );
  });

  it("shows Stop button when stepping", () => {
    renderControls({ status: "stepping" });
    expect(screen.getByTestId("stop-button")).toBeInTheDocument();
  });

  it("has correct speed options", () => {
    renderControls();
    const select = screen.getByTestId("speed-select") as HTMLSelectElement;
    const options = Array.from(select.options).map((o) => o.value);
    expect(options).toEqual(["slow", "normal", "fast"]);
  });
});
