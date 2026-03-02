import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";

vi.mock("@react-three/drei", () => ({
  Grid: (props: Record<string, unknown>) => (
    <div data-testid="scene-grid" data-cell-size={props.cellSize}>
      Grid
    </div>
  ),
  OrbitControls: (props: Record<string, unknown>) => (
    <div
      data-testid="orbit-controls"
      data-enable-pan={String(props.enablePan)}
    >
      OrbitControls
    </div>
  ),
}));

import { SceneEnvironment } from "./SceneEnvironment";

describe("SceneEnvironment", () => {
  it("renders orbit controls", () => {
    render(<SceneEnvironment />);
    expect(screen.getByTestId("orbit-controls")).toBeInTheDocument();
  });

  it("renders the grid by default", () => {
    render(<SceneEnvironment />);
    expect(screen.getByTestId("scene-grid")).toBeInTheDocument();
  });

  it("hides the grid when showGrid is false", () => {
    render(<SceneEnvironment showGrid={false} />);
    expect(screen.queryByTestId("scene-grid")).not.toBeInTheDocument();
  });

  it("disables panning on orbit controls", () => {
    render(<SceneEnvironment />);
    expect(screen.getByTestId("orbit-controls")).toHaveAttribute(
      "data-enable-pan",
      "false",
    );
  });
});
