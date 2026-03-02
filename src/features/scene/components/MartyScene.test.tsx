import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MartyScene } from "./MartyScene";

const mockCanvas = vi.fn();
const mockOrbitControls = vi.fn();
const mockGrid = vi.fn();

vi.mock("@react-three/fiber", () => ({
  Canvas: (props: Record<string, unknown>) => {
    mockCanvas(props);
    return (
      <div data-testid="r3f-canvas">
        {props.children as React.ReactNode}
      </div>
    );
  },
}));

vi.mock("@react-three/drei", () => ({
  OrbitControls: (props: Record<string, unknown>) => {
    mockOrbitControls(props);
    return <div data-testid="orbit-controls" />;
  },
  Grid: (props: Record<string, unknown>) => {
    mockGrid(props);
    return <div data-testid="floor-grid" />;
  },
}));

vi.mock("./MartyModel", () => ({
  MartyModel: (props: Record<string, unknown>) => (
    <div data-testid="marty-model-mock" data-joint-refs={!!props.jointRefs} />
  ),
}));

describe("MartyScene", () => {
  it("renders the scene container", () => {
    render(<MartyScene />);
    expect(screen.getByTestId("marty-scene-container")).toBeInTheDocument();
  });

  it("renders the R3F Canvas", () => {
    render(<MartyScene />);
    expect(screen.getByTestId("r3f-canvas")).toBeInTheDocument();
  });

  it("configures Canvas with shadows", () => {
    render(<MartyScene />);
    expect(mockCanvas).toHaveBeenCalledWith(
      expect.objectContaining({ shadows: true }),
    );
  });

  it("configures Canvas with camera settings", () => {
    render(<MartyScene />);
    expect(mockCanvas).toHaveBeenCalledWith(
      expect.objectContaining({
        camera: expect.objectContaining({ fov: 50 }),
      }),
    );
  });

  it("renders OrbitControls", () => {
    render(<MartyScene />);
    expect(screen.getByTestId("orbit-controls")).toBeInTheDocument();
  });

  it("configures OrbitControls with damping", () => {
    render(<MartyScene />);
    expect(mockOrbitControls).toHaveBeenCalledWith(
      expect.objectContaining({ enableDamping: true }),
    );
  });

  it("renders the floor grid", () => {
    render(<MartyScene />);
    expect(screen.getByTestId("floor-grid")).toBeInTheDocument();
  });

  it("renders the MartyModel", () => {
    render(<MartyScene />);
    expect(screen.getByTestId("marty-model-mock")).toBeInTheDocument();
  });

  it("passes jointRefs to MartyModel", () => {
    render(<MartyScene jointRefs={{ head: { current: null } }} />);
    const model = screen.getByTestId("marty-model-mock");
    expect(model.dataset.jointRefs).toBe("true");
  });

  it("uses default className when none provided", () => {
    render(<MartyScene />);
    const container = screen.getByTestId("marty-scene-container");
    expect(container.className).toContain("h-full");
    expect(container.className).toContain("w-full");
  });

  it("uses custom className when provided", () => {
    render(<MartyScene className="custom-class" />);
    const container = screen.getByTestId("marty-scene-container");
    expect(container.className).toBe("custom-class");
  });

  it("renders ambient lighting inside canvas", () => {
    const { container } = render(<MartyScene />);
    const canvas = container.querySelector('[data-testid="r3f-canvas"]');
    expect(canvas).toBeTruthy();
  });
});
