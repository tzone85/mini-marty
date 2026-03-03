import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import TutorialsPage from "./page";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock("@/features/tutorials/hooks/useTutorialProgress", () => ({
  useTutorialProgress: () => ({
    state: { progress: {} },
    startTutorial: vi.fn(),
    completedCount: 0,
  }),
}));

describe("Tutorials page", () => {
  it("renders the heading", () => {
    render(<TutorialsPage />);
    expect(
      screen.getByRole("heading", { name: /tutorials/i }),
    ).toBeInTheDocument();
  });

  it("renders a description", () => {
    render(<TutorialsPage />);
    expect(screen.getByText(/step-by-step/i)).toBeInTheDocument();
  });

  it("renders the tutorials grid", () => {
    render(<TutorialsPage />);
    expect(screen.getByTestId("tutorials-grid")).toBeInTheDocument();
  });

  it("renders all 6 tutorial cards", () => {
    render(<TutorialsPage />);
    expect(screen.getByTestId("tutorial-card-first-steps")).toBeInTheDocument();
    expect(
      screen.getByTestId("tutorial-card-movement-mastery"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("tutorial-card-dance-sequences"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("tutorial-card-loops-and-repetition"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("tutorial-card-sensors-and-decisions"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("tutorial-card-python-basics"),
    ).toBeInTheDocument();
  });

  it("shows progress summary", () => {
    render(<TutorialsPage />);
    expect(screen.getByTestId("progress-summary")).toHaveTextContent(
      "0 of 6 tutorials completed",
    );
  });
});
