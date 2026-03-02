import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
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
});
