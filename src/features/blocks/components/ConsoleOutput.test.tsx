import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ConsoleOutput } from "./ConsoleOutput";
import type { ConsoleEntry } from "../execution/types";

function makeEntry(overrides: Partial<ConsoleEntry> = {}): ConsoleEntry {
  return {
    id: "1",
    timestamp: Date.now(),
    type: "command",
    message: "Walk 2 steps",
    ...overrides,
  };
}

describe("ConsoleOutput", () => {
  it("renders empty state message", () => {
    render(<ConsoleOutput entries={[]} />);
    expect(screen.getByText(/console output will appear/i)).toBeInTheDocument();
  });

  it("renders console entries", () => {
    const entries: ConsoleEntry[] = [
      makeEntry({ id: "1", type: "command", message: "Walk 2 steps" }),
      makeEntry({ id: "2", type: "output", message: "Done walking" }),
    ];
    render(<ConsoleOutput entries={entries} />);
    expect(screen.getByText("Walk 2 steps")).toBeInTheDocument();
    expect(screen.getByText("Done walking")).toBeInTheDocument();
  });

  it("renders error entries", () => {
    const entries = [
      makeEntry({ id: "1", type: "error", message: "Something went wrong" }),
    ];
    render(<ConsoleOutput entries={entries} />);
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });

  it("renders info entries", () => {
    const entries = [
      makeEntry({ id: "1", type: "info", message: "Program started." }),
    ];
    render(<ConsoleOutput entries={entries} />);
    expect(screen.getByText("Program started.")).toBeInTheDocument();
  });

  it("has testid for console container", () => {
    render(<ConsoleOutput entries={[]} />);
    expect(screen.getByTestId("console-output")).toBeInTheDocument();
  });

  it("renders timestamps", () => {
    const entries = [
      makeEntry({
        id: "1",
        timestamp: new Date(2026, 0, 1, 14, 30, 45).getTime(),
      }),
    ];
    render(<ConsoleOutput entries={entries} />);
    expect(screen.getByText("14:30:45")).toBeInTheDocument();
  });
});
