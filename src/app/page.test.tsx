import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

vi.mock("next/dynamic", () => ({
  default: () => {
    const DynamicComponent = () => (
      <div data-testid="marty-scene">3D Scene</div>
    );
    DynamicComponent.displayName = "DynamicMartyScene";
    return DynamicComponent;
  },
}));

import Home from "./page";

describe("Home page", () => {
  it("renders the heading", () => {
    render(<Home />);
    expect(
      screen.getByRole("heading", { name: /mini marty/i }),
    ).toBeInTheDocument();
  });

  it("renders the description", () => {
    render(<Home />);
    expect(
      screen.getByText(/visual programming environment/i),
    ).toBeInTheDocument();
  });

  it("renders quick action links", () => {
    render(<Home />);
    expect(screen.getByText(/block editor/i)).toBeInTheDocument();
    expect(screen.getByText(/python editor/i)).toBeInTheDocument();
    expect(screen.getByText(/tutorials/i)).toBeInTheDocument();
  });

  it("renders the 3D scene container", () => {
    render(<Home />);
    expect(screen.getByTestId("scene-container")).toBeInTheDocument();
  });

  it("renders the MartyScene component", () => {
    render(<Home />);
    expect(screen.getByTestId("marty-scene")).toBeInTheDocument();
  });
});
