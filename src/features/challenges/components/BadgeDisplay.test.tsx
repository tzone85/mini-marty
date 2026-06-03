import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BadgeDisplay } from "./BadgeDisplay";
import type { Badge } from "../types";

describe("BadgeDisplay", () => {
  it("shows empty state when no badges", () => {
    render(<BadgeDisplay badges={[]} />);
    expect(screen.getByText(/complete challenges/i)).toBeInTheDocument();
  });

  it("renders earned badges", () => {
    const badges: Badge[] = [
      { id: "b1", name: "Walker", description: "Walked", icon: "🚶" },
      { id: "b2", name: "Dancer", description: "Danced", icon: "💃" },
    ];
    render(<BadgeDisplay badges={badges} />);
    expect(screen.getByTestId("badge-b1")).toBeInTheDocument();
    expect(screen.getByTestId("badge-b2")).toBeInTheDocument();
    expect(screen.getByText("Walker")).toBeInTheDocument();
    expect(screen.getByText("💃")).toBeInTheDocument();
  });
});
