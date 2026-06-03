import { describe, expect, it } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ChallengesPage from "./page";

describe("ChallengesPage", () => {
  it("renders the heading and difficulty filter buttons", () => {
    render(<ChallengesPage />);
    expect(
      screen.getByRole("heading", { name: /^challenges$/i, level: 1 }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /^beginner/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /^intermediate/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /^advanced/i }),
    ).toBeInTheDocument();
  });

  it("filters the listing to a single difficulty when a tier filter is clicked", () => {
    render(<ChallengesPage />);
    fireEvent.click(screen.getByRole("button", { name: /^beginner/i }));
    // At least one beginner challenge title should still appear.
    expect(
      screen.getByRole("button", { name: /first walk/i }),
    ).toBeInTheDocument();
  });

  it("opens a challenge detail view and reveals hints one at a time", () => {
    render(<ChallengesPage />);
    fireEvent.click(screen.getByRole("button", { name: /first walk/i }));
    expect(
      screen.getByRole("button", { name: /back to challenges/i }),
    ).toBeInTheDocument();
    // First hint should be hidden until revealed
    expect(screen.getByText(/0 of/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /reveal next hint/i }));
    expect(screen.getByText(/1 of/i)).toBeInTheDocument();
  });
});
