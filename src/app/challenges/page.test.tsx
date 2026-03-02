import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import ChallengesPage from "./page";

describe("ChallengesPage", () => {
  it("renders heading", () => {
    render(<ChallengesPage />);
    expect(
      screen.getByRole("heading", { name: /challenges/i }),
    ).toBeInTheDocument();
  });

  it("renders description", () => {
    render(<ChallengesPage />);
    expect(screen.getByText(/coding puzzles/i)).toBeInTheDocument();
  });
});
