import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ChallengeDetailPage from "./page";

vi.mock("next/navigation", () => ({
  useParams: () => ({ id: "first-walk" }),
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock("@/features/challenges/hooks/useChallengeProgress", () => ({
  useChallengeProgress: () => ({
    state: {
      attempts: {
        "first-walk": {
          challengeId: "first-walk",
          completed: false,
          objectivesCompleted: [],
          startedAt: 1000,
          completedAt: null,
          attempts: 1,
        },
      },
      badges: [],
    },
    startChallenge: vi.fn(),
    completeObjective: vi.fn(),
    resetChallenge: vi.fn(),
  }),
}));

describe("Challenge detail page", () => {
  it("renders the challenge player", () => {
    render(<ChallengeDetailPage />);
    expect(screen.getByTestId("challenge-player")).toBeInTheDocument();
  });

  it("renders the challenge title", () => {
    render(<ChallengeDetailPage />);
    expect(screen.getByText("First Walk")).toBeInTheDocument();
  });

  it("renders objectives", () => {
    render(<ChallengeDetailPage />);
    expect(screen.getByTestId("objective-list")).toBeInTheDocument();
  });
});
