import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";

// Mock the R3F Canvas to render as a plain div with children
vi.mock("@react-three/fiber", () => ({
  Canvas: ({
    children,
    style,
    camera,
  }: {
    children: React.ReactNode;
    style?: React.CSSProperties;
    camera?: Record<string, unknown>;
  }) => (
    <div
      data-testid="r3f-canvas"
      data-background={style?.background}
      data-fov={camera?.fov}
    >
      {children}
    </div>
  ),
}));

// Mock the MartyModel with forwardRef so the ref callback in MartyScene fires
vi.mock("./MartyModel", () => ({
  MartyModel: React.forwardRef(function MockMartyModel(
    _props: Record<string, unknown>,
    ref: React.Ref<unknown>,
  ) {
    React.useImperativeHandle(ref, () => ({
      applyPose: vi.fn(),
      getRootRef: () => null,
    }));
    return <div data-testid="marty-model">Marty</div>;
  }),
}));

vi.mock("./SceneEnvironment", () => ({
  SceneEnvironment: ({ showGrid }: { showGrid?: boolean }) => (
    <div data-testid="scene-environment" data-show-grid={String(showGrid)}>
      Env
    </div>
  ),
}));

import { MartyScene } from "./MartyScene";

describe("MartyScene", () => {
  it("renders the scene container with data-testid", () => {
    render(<MartyScene />);
    expect(screen.getByTestId("marty-scene")).toBeInTheDocument();
  });

  it("renders the R3F Canvas", () => {
    render(<MartyScene />);
    expect(screen.getByTestId("r3f-canvas")).toBeInTheDocument();
  });

  it("renders the MartyModel inside the Canvas", () => {
    render(<MartyScene />);
    expect(screen.getByTestId("marty-model")).toBeInTheDocument();
  });

  it("renders the SceneEnvironment", () => {
    render(<MartyScene />);
    expect(screen.getByTestId("scene-environment")).toBeInTheDocument();
  });

  it("applies default background color", () => {
    render(<MartyScene />);
    expect(screen.getByTestId("r3f-canvas")).toHaveAttribute(
      "data-background",
      "#f0f0f0",
    );
  });

  it("applies default camera FOV", () => {
    render(<MartyScene />);
    expect(screen.getByTestId("r3f-canvas")).toHaveAttribute("data-fov", "50");
  });

  it("allows overriding background color", () => {
    render(<MartyScene config={{ backgroundColor: "#000000" }} />);
    expect(screen.getByTestId("r3f-canvas")).toHaveAttribute(
      "data-background",
      "#000000",
    );
  });

  it("passes showGrid to SceneEnvironment", () => {
    render(<MartyScene config={{ showGrid: false }} />);
    expect(screen.getByTestId("scene-environment")).toHaveAttribute(
      "data-show-grid",
      "false",
    );
  });

  it("passes showGrid true by default", () => {
    render(<MartyScene />);
    expect(screen.getByTestId("scene-environment")).toHaveAttribute(
      "data-show-grid",
      "true",
    );
  });

  it("calls onModelReady when model ref connects", () => {
    const onModelReady = vi.fn();
    render(<MartyScene onModelReady={onModelReady} />);
    expect(onModelReady).toHaveBeenCalledWith(
      expect.objectContaining({
        applyPose: expect.any(Function),
        getRootRef: expect.any(Function),
      }),
    );
  });

  it("renders with a border style", () => {
    render(<MartyScene />);
    const container = screen.getByTestId("marty-scene");
    expect(container.className).toContain("border");
    expect(container.className).toContain("rounded-lg");
  });
});
