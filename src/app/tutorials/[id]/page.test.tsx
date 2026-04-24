import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import TutorialDetailPage from "./page";

vi.mock("next/navigation", () => ({
  useParams: () => ({ id: "first-steps" }),
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock("@/features/tutorials/hooks/useTutorialProgress", () => ({
  useTutorialProgress: () => ({
    state: {
      progress: {
        "first-steps": {
          tutorialId: "first-steps",
          currentStepIndex: 0,
          stepsCompleted: [],
          completed: false,
          startedAt: 1000,
          completedAt: null,
        },
      },
    },
    startTutorial: vi.fn(),
    completeStep: vi.fn(),
    resetProgress: vi.fn(),
  }),
}));

describe("Tutorial detail page", () => {
  it("renders the tutorial player", () => {
    render(<TutorialDetailPage />);
    expect(screen.getByTestId("tutorial-player")).toBeInTheDocument();
  });

  it("renders the tutorial title", () => {
    render(<TutorialDetailPage />);
    expect(screen.getByText("First Steps with Marty")).toBeInTheDocument();
  });

  it("renders step content", () => {
    render(<TutorialDetailPage />);
    expect(screen.getByTestId("step-title")).toHaveTextContent(
      "Welcome to Block Editor",
    );
  });
});
