import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import TutorialsPage from "./page";

describe("TutorialsPage", () => {
  it("renders heading", () => {
    render(<TutorialsPage />);
    expect(
      screen.getByRole("heading", { name: /tutorials/i }),
    ).toBeInTheDocument();
  });

  it("renders description", () => {
    render(<TutorialsPage />);
    expect(screen.getByText(/step-by-step lessons/i)).toBeInTheDocument();
  });
});
