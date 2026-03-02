import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import TutorialsPage from "./page";

describe("Tutorials page", () => {
  it("renders the heading", () => {
    render(<TutorialsPage />);
    expect(
      screen.getByRole("heading", { name: /tutorials/i }),
    ).toBeInTheDocument();
  });

  it("renders a description", () => {
    render(<TutorialsPage />);
    expect(screen.getByText(/step-by-step/i)).toBeInTheDocument();
  });
});
