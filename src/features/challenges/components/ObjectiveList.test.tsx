import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ObjectiveList } from "./ObjectiveList";
import type { ChallengeObjective } from "../types";

const objectives: ChallengeObjective[] = [
  { id: "o1", description: "Walk forward", kind: "use-block" },
  { id: "o2", description: "Run program", kind: "run-program" },
];

describe("ObjectiveList", () => {
  it("renders all objectives", () => {
    render(<ObjectiveList objectives={objectives} completedObjectives={[]} />);
    expect(screen.getByTestId("objective-o1")).toBeInTheDocument();
    expect(screen.getByTestId("objective-o2")).toBeInTheDocument();
  });

  it("shows uncompleted status", () => {
    render(<ObjectiveList objectives={objectives} completedObjectives={[]} />);
    expect(screen.getByTestId("objective-status-o1")).toHaveTextContent("○");
  });

  it("shows completed status", () => {
    render(
      <ObjectiveList objectives={objectives} completedObjectives={["o1"]} />,
    );
    expect(screen.getByTestId("objective-status-o1")).toHaveTextContent("✓");
    expect(screen.getByTestId("objective-status-o2")).toHaveTextContent("○");
  });

  it("renders objective descriptions", () => {
    render(<ObjectiveList objectives={objectives} completedObjectives={[]} />);
    expect(screen.getByText("Walk forward")).toBeInTheDocument();
    expect(screen.getByText("Run program")).toBeInTheDocument();
  });
});
