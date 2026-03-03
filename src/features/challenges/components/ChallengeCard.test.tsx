import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ChallengeCard } from "./ChallengeCard";
import type { Challenge, ChallengeAttempt } from "../types";

const mockChallenge: Challenge = {
  id: "test-challenge",
  title: "Test Challenge",
  description: "A test",
  difficulty: "beginner",
  objectives: [
    { id: "o1", description: "Do this", kind: "use-block" },
    { id: "o2", description: "Do that", kind: "run-program" },
  ],
  hints: ["Try this"],
  badge: { id: "b1", name: "Badge", description: "Got it", icon: "🏅" },
};

describe("ChallengeCard", () => {
  it("renders title and description", () => {
    render(<ChallengeCard challenge={mockChallenge} onStart={vi.fn()} />);
    expect(screen.getByText("Test Challenge")).toBeInTheDocument();
    expect(screen.getByText("A test")).toBeInTheDocument();
  });

  it("renders difficulty badge", () => {
    render(<ChallengeCard challenge={mockChallenge} onStart={vi.fn()} />);
    expect(screen.getByTestId("difficulty-badge")).toHaveTextContent(
      "beginner",
    );
  });

  it("shows Start button when not started", () => {
    render(<ChallengeCard challenge={mockChallenge} onStart={vi.fn()} />);
    expect(screen.getByTestId("start-button-test-challenge")).toHaveTextContent(
      "Start",
    );
  });

  it("shows Continue when in progress", () => {
    const attempt: ChallengeAttempt = {
      challengeId: "test-challenge",
      completed: false,
      objectivesCompleted: ["o1"],
      startedAt: 1000,
      completedAt: null,
      attempts: 1,
    };
    render(
      <ChallengeCard
        challenge={mockChallenge}
        attempt={attempt}
        onStart={vi.fn()}
      />,
    );
    expect(screen.getByTestId("start-button-test-challenge")).toHaveTextContent(
      "Continue",
    );
  });

  it("shows Completed when done", () => {
    const attempt: ChallengeAttempt = {
      challengeId: "test-challenge",
      completed: true,
      objectivesCompleted: ["o1", "o2"],
      startedAt: 1000,
      completedAt: 2000,
      attempts: 1,
    };
    render(
      <ChallengeCard
        challenge={mockChallenge}
        attempt={attempt}
        onStart={vi.fn()}
      />,
    );
    expect(screen.getByTestId("start-button-test-challenge")).toHaveTextContent(
      /completed/i,
    );
  });

  it("shows badge icon when completed", () => {
    const attempt: ChallengeAttempt = {
      challengeId: "test-challenge",
      completed: true,
      objectivesCompleted: ["o1", "o2"],
      startedAt: 1000,
      completedAt: 2000,
      attempts: 1,
    };
    render(
      <ChallengeCard
        challenge={mockChallenge}
        attempt={attempt}
        onStart={vi.fn()}
      />,
    );
    expect(screen.getByTestId("badge-icon")).toHaveTextContent("🏅");
  });

  it("shows objectives summary", () => {
    render(<ChallengeCard challenge={mockChallenge} onStart={vi.fn()} />);
    expect(screen.getByTestId("objectives-summary")).toHaveTextContent(
      "0/2 objectives",
    );
  });

  it("calls onStart when clicked", () => {
    const onStart = vi.fn();
    render(<ChallengeCard challenge={mockChallenge} onStart={onStart} />);
    fireEvent.click(screen.getByTestId("start-button-test-challenge"));
    expect(onStart).toHaveBeenCalledWith("test-challenge");
  });
});
