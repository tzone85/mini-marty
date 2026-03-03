import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { TutorialPlayer } from "./TutorialPlayer";
import type { Tutorial, TutorialProgress } from "../types";

const mockTutorial: Tutorial = {
  id: "test",
  title: "Test Tutorial",
  description: "A test",
  category: "basics",
  difficulty: "beginner",
  estimatedMinutes: 5,
  steps: [
    {
      id: "s1",
      title: "First Step",
      instructions: "Do the first thing",
      hint: "Here's a hint",
      validation: { kind: "manual" },
    },
    {
      id: "s2",
      title: "Second Step",
      instructions: "Do the second thing",
      validation: { kind: "block-type", requiredBlockType: "marty_walk" },
    },
  ],
};

function makeProgress(
  overrides: Partial<TutorialProgress> = {},
): TutorialProgress {
  return {
    tutorialId: "test",
    currentStepIndex: 0,
    stepsCompleted: [],
    completed: false,
    startedAt: 1000,
    completedAt: null,
    ...overrides,
  };
}

describe("TutorialPlayer", () => {
  it("renders tutorial title", () => {
    render(
      <TutorialPlayer
        tutorial={mockTutorial}
        progress={makeProgress()}
        onCompleteStep={vi.fn()}
        onBack={vi.fn()}
        onReset={vi.fn()}
      />,
    );
    expect(screen.getByText("Test Tutorial")).toBeInTheDocument();
  });

  it("renders current step title and instructions", () => {
    render(
      <TutorialPlayer
        tutorial={mockTutorial}
        progress={makeProgress()}
        onCompleteStep={vi.fn()}
        onBack={vi.fn()}
        onReset={vi.fn()}
      />,
    );
    expect(screen.getByTestId("step-title")).toHaveTextContent("First Step");
    expect(screen.getByTestId("step-instructions")).toHaveTextContent(
      "Do the first thing",
    );
  });

  it("renders step indicator", () => {
    render(
      <TutorialPlayer
        tutorial={mockTutorial}
        progress={makeProgress()}
        onCompleteStep={vi.fn()}
        onBack={vi.fn()}
        onReset={vi.fn()}
      />,
    );
    expect(screen.getByTestId("step-indicator")).toBeInTheDocument();
  });

  it("shows hint panel when step has hint", () => {
    render(
      <TutorialPlayer
        tutorial={mockTutorial}
        progress={makeProgress()}
        onCompleteStep={vi.fn()}
        onBack={vi.fn()}
        onReset={vi.fn()}
      />,
    );
    expect(screen.getByTestId("hint-panel")).toBeInTheDocument();
  });

  it("calls onCompleteStep when button clicked", () => {
    const onCompleteStep = vi.fn();
    render(
      <TutorialPlayer
        tutorial={mockTutorial}
        progress={makeProgress()}
        onCompleteStep={onCompleteStep}
        onBack={vi.fn()}
        onReset={vi.fn()}
      />,
    );
    fireEvent.click(screen.getByTestId("complete-step-button"));
    expect(onCompleteStep).toHaveBeenCalledWith("s1");
  });

  it("calls onBack when back button clicked", () => {
    const onBack = vi.fn();
    render(
      <TutorialPlayer
        tutorial={mockTutorial}
        progress={makeProgress()}
        onCompleteStep={vi.fn()}
        onBack={onBack}
        onReset={vi.fn()}
      />,
    );
    fireEvent.click(screen.getByTestId("back-button"));
    expect(onBack).toHaveBeenCalledOnce();
  });

  it("calls onReset when reset button clicked", () => {
    const onReset = vi.fn();
    render(
      <TutorialPlayer
        tutorial={mockTutorial}
        progress={makeProgress()}
        onCompleteStep={vi.fn()}
        onBack={vi.fn()}
        onReset={onReset}
      />,
    );
    fireEvent.click(screen.getByTestId("reset-button"));
    expect(onReset).toHaveBeenCalledOnce();
  });

  it("shows completed message when tutorial is complete", () => {
    render(
      <TutorialPlayer
        tutorial={mockTutorial}
        progress={makeProgress({
          completed: true,
          stepsCompleted: ["s1", "s2"],
        })}
        onCompleteStep={vi.fn()}
        onBack={vi.fn()}
        onReset={vi.fn()}
      />,
    );
    expect(screen.getByTestId("completed-message")).toHaveTextContent(
      "Tutorial Complete!",
    );
  });

  it("shows Done button for manual validation", () => {
    render(
      <TutorialPlayer
        tutorial={mockTutorial}
        progress={makeProgress()}
        onCompleteStep={vi.fn()}
        onBack={vi.fn()}
        onReset={vi.fn()}
      />,
    );
    expect(screen.getByTestId("complete-step-button")).toHaveTextContent(
      "Done",
    );
  });

  it("shows Mark Complete for non-manual validation", () => {
    render(
      <TutorialPlayer
        tutorial={mockTutorial}
        progress={makeProgress({ currentStepIndex: 1 })}
        onCompleteStep={vi.fn()}
        onBack={vi.fn()}
        onReset={vi.fn()}
      />,
    );
    expect(screen.getByTestId("complete-step-button")).toHaveTextContent(
      "Mark Complete",
    );
  });
});
