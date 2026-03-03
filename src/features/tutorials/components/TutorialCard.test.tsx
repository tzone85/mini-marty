import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { TutorialCard } from "./TutorialCard";
import type { Tutorial, TutorialProgress } from "../types";

const mockTutorial: Tutorial = {
  id: "test-tutorial",
  title: "Test Tutorial",
  description: "A test description",
  category: "basics",
  difficulty: "beginner",
  estimatedMinutes: 5,
  steps: [
    {
      id: "s1",
      title: "Step 1",
      instructions: "Do this",
      validation: { kind: "manual" },
    },
    {
      id: "s2",
      title: "Step 2",
      instructions: "Do that",
      validation: { kind: "manual" },
    },
  ],
};

describe("TutorialCard", () => {
  it("renders tutorial title and description", () => {
    render(<TutorialCard tutorial={mockTutorial} onStart={vi.fn()} />);
    expect(screen.getByText("Test Tutorial")).toBeInTheDocument();
    expect(screen.getByText("A test description")).toBeInTheDocument();
  });

  it("renders difficulty badge", () => {
    render(<TutorialCard tutorial={mockTutorial} onStart={vi.fn()} />);
    expect(screen.getByTestId("difficulty-badge")).toHaveTextContent(
      "beginner",
    );
  });

  it("renders estimated time", () => {
    render(<TutorialCard tutorial={mockTutorial} onStart={vi.fn()} />);
    expect(screen.getByText("~5 min")).toBeInTheDocument();
  });

  it("shows Start button when not started", () => {
    render(<TutorialCard tutorial={mockTutorial} onStart={vi.fn()} />);
    expect(screen.getByTestId("start-button-test-tutorial")).toHaveTextContent(
      "Start",
    );
  });

  it("shows Continue button when in progress", () => {
    const progress: TutorialProgress = {
      tutorialId: "test-tutorial",
      currentStepIndex: 1,
      stepsCompleted: ["s1"],
      completed: false,
      startedAt: 1000,
      completedAt: null,
    };
    render(
      <TutorialCard
        tutorial={mockTutorial}
        progress={progress}
        onStart={vi.fn()}
      />,
    );
    expect(screen.getByTestId("start-button-test-tutorial")).toHaveTextContent(
      "Continue",
    );
  });

  it("shows progress bar when in progress", () => {
    const progress: TutorialProgress = {
      tutorialId: "test-tutorial",
      currentStepIndex: 1,
      stepsCompleted: ["s1"],
      completed: false,
      startedAt: 1000,
      completedAt: null,
    };
    render(
      <TutorialCard
        tutorial={mockTutorial}
        progress={progress}
        onStart={vi.fn()}
      />,
    );
    expect(screen.getByTestId("progress-bar")).toBeInTheDocument();
    expect(screen.getByText("1/2 steps")).toBeInTheDocument();
  });

  it("shows Completed when done", () => {
    const progress: TutorialProgress = {
      tutorialId: "test-tutorial",
      currentStepIndex: 1,
      stepsCompleted: ["s1", "s2"],
      completed: true,
      startedAt: 1000,
      completedAt: 2000,
    };
    render(
      <TutorialCard
        tutorial={mockTutorial}
        progress={progress}
        onStart={vi.fn()}
      />,
    );
    expect(screen.getByTestId("start-button-test-tutorial")).toHaveTextContent(
      /completed/i,
    );
  });

  it("calls onStart with tutorial id when clicked", () => {
    const onStart = vi.fn();
    render(<TutorialCard tutorial={mockTutorial} onStart={onStart} />);
    fireEvent.click(screen.getByTestId("start-button-test-tutorial"));
    expect(onStart).toHaveBeenCalledWith("test-tutorial");
  });
});
