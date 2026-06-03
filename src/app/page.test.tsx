import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

vi.mock("next/dynamic", () => ({
  default: () => {
    return function MockScene() {
      return <div data-testid="scene-placeholder">Mock Scene</div>;
    };
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
      screen.getByText(/virtual programming environment/i),
    ).toBeInTheDocument();
  });

  it("renders quick action links", () => {
    render(<Home />);
    expect(screen.getByText(/block editor/i)).toBeInTheDocument();
    expect(screen.getByText(/python editor/i)).toBeInTheDocument();
    expect(screen.getByText(/tutorials/i)).toBeInTheDocument();
  });
});
