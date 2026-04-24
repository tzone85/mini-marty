import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ChallengesPage from "./page";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock("@/features/challenges/hooks/useChallengeProgress", () => ({
  useChallengeProgress: () => ({
    state: { attempts: {}, badges: [] },
    startChallenge: vi.fn(),
    completedCount: 0,
    badgeCount: 0,
  }),
}));

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

  it("renders challenge summary", () => {
    render(<ChallengesPage />);
    expect(screen.getByTestId("challenge-summary")).toHaveTextContent(
      "0 of 7 challenges completed",
    );
  });

  it("renders difficulty sections", () => {
    render(<ChallengesPage />);
    expect(screen.getByTestId("challenges-beginner")).toBeInTheDocument();
    expect(screen.getByTestId("challenges-intermediate")).toBeInTheDocument();
    expect(screen.getByTestId("challenges-advanced")).toBeInTheDocument();
  });

  it("renders all 7 challenge cards", () => {
    render(<ChallengesPage />);
    expect(screen.getByTestId("challenge-card-first-walk")).toBeInTheDocument();
    expect(
      screen.getByTestId("challenge-card-dance-party"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("challenge-card-kick-master"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("challenge-card-loop-walker"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("challenge-card-dance-routine"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("challenge-card-sensor-detective"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("challenge-card-ultimate-routine"),
    ).toBeInTheDocument();
  });
});
