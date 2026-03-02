import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Home from "./page";

describe("Home page", () => {
  it("renders the heading", () => {
    render(<Home />);
    expect(
      screen.getByRole("heading", { name: /welcome to mini marty/i }),
    ).toBeInTheDocument();
  });

  it("renders the description", () => {
    render(<Home />);
    expect(screen.getByText(/learn to code with marty/i)).toBeInTheDocument();
  });

  it("renders links to all main sections", () => {
    render(<Home />);
    expect(
      screen.getByRole("link", { name: /block editor/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /python editor/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /tutorials/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /challenges/i }),
    ).toBeInTheDocument();
  });
});
