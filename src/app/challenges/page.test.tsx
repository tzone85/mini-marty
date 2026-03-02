import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import ChallengesPage from "./page";

describe("Challenges page", () => {
  it("renders the heading", () => {
    render(<ChallengesPage />);
    expect(
      screen.getByRole("heading", { name: /challenges/i }),
    ).toBeInTheDocument();
  });

  it("renders a description", () => {
    render(<ChallengesPage />);
    expect(screen.getByText(/programming puzzles/i)).toBeInTheDocument();
  });
});
