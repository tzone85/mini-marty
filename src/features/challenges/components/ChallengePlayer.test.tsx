import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ChallengePlayer } from "./ChallengePlayer";
import type { Challenge, ChallengeAttempt } from "../types";

const mockChallenge: Challenge = {
  id: "test",
  title: "Test Challenge",
  description: "Solve the puzzle",
  difficulty: "beginner",
  objectives: [
    { id: "o1", description: "Use walk", kind: "use-block" },
    { id: "o2", description: "Run it", kind: "run-program" },
  ],
  hints: ["Hint one", "Hint two"],
  badge: { id: "b1", name: "Winner", description: "You won", icon: "🏆" },
};

function makeAttempt(
  overrides: Partial<ChallengeAttempt> = {},
): ChallengeAttempt {
  return {
    challengeId: "test",
    completed: false,
    objectivesCompleted: [],
    startedAt: 1000,
    completedAt: null,
    attempts: 1,
    ...overrides,
  };
}

describe("ChallengePlayer", () => {
  it("renders challenge title", () => {
    render(
      <ChallengePlayer
        challenge={mockChallenge}
        attempt={makeAttempt()}
        onCompleteObjective={vi.fn()}
        onBack={vi.fn()}
        onReset={vi.fn()}
      />,
    );
    expect(screen.getByText("Test Challenge")).toBeInTheDocument();
  });

  it("renders objective list", () => {
    render(
      <ChallengePlayer
        challenge={mockChallenge}
        attempt={makeAttempt()}
        onCompleteObjective={vi.fn()}
        onBack={vi.fn()}
        onReset={vi.fn()}
      />,
    );
    expect(screen.getByTestId("objective-list")).toBeInTheDocument();
  });

  it("shows complete button for next objective", () => {
    render(
      <ChallengePlayer
        challenge={mockChallenge}
        attempt={makeAttempt()}
        onCompleteObjective={vi.fn()}
        onBack={vi.fn()}
        onReset={vi.fn()}
      />,
    );
    expect(screen.getByTestId("complete-objective-button")).toHaveTextContent(
      "Complete: Use walk",
    );
  });

  it("calls onCompleteObjective when button clicked", () => {
    const onComplete = vi.fn();
    render(
      <ChallengePlayer
        challenge={mockChallenge}
        attempt={makeAttempt()}
        onCompleteObjective={onComplete}
        onBack={vi.fn()}
        onReset={vi.fn()}
      />,
    );
    fireEvent.click(screen.getByTestId("complete-objective-button"));
    expect(onComplete).toHaveBeenCalledWith("o1");
  });

  it("calls onBack when back clicked", () => {
    const onBack = vi.fn();
    render(
      <ChallengePlayer
        challenge={mockChallenge}
        attempt={makeAttempt()}
        onCompleteObjective={vi.fn()}
        onBack={onBack}
        onReset={vi.fn()}
      />,
    );
    fireEvent.click(screen.getByTestId("back-button"));
    expect(onBack).toHaveBeenCalledOnce();
  });

  it("shows completion banner when all done", () => {
    render(
      <ChallengePlayer
        challenge={mockChallenge}
        attempt={makeAttempt({
          completed: true,
          objectivesCompleted: ["o1", "o2"],
        })}
        onCompleteObjective={vi.fn()}
        onBack={vi.fn()}
        onReset={vi.fn()}
      />,
    );
    expect(screen.getByTestId("completion-banner")).toBeInTheDocument();
    expect(screen.getByText("Winner")).toBeInTheDocument();
  });

  it("reveals hints progressively", () => {
    render(
      <ChallengePlayer
        challenge={mockChallenge}
        attempt={makeAttempt()}
        onCompleteObjective={vi.fn()}
        onBack={vi.fn()}
        onReset={vi.fn()}
      />,
    );

    expect(screen.queryByTestId("hints-list")).not.toBeInTheDocument();

    fireEvent.click(screen.getByTestId("hint-button"));
    expect(screen.getByTestId("hints-list")).toBeInTheDocument();
    expect(screen.getByText("Hint one")).toBeInTheDocument();
    expect(screen.queryByText("Hint two")).not.toBeInTheDocument();

    fireEvent.click(screen.getByTestId("hint-button"));
    expect(screen.getByText("Hint two")).toBeInTheDocument();
  });

  it("shows attempt count", () => {
    render(
      <ChallengePlayer
        challenge={mockChallenge}
        attempt={makeAttempt({ attempts: 3 })}
        onCompleteObjective={vi.fn()}
        onBack={vi.fn()}
        onReset={vi.fn()}
      />,
    );
    expect(screen.getByText("Attempt #3")).toBeInTheDocument();
  });
});
