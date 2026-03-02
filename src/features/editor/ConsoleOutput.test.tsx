import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ConsoleOutput, type ConsoleEntry } from "./ConsoleOutput";

describe("ConsoleOutput", () => {
  it("renders the console header", () => {
    render(<ConsoleOutput entries={[]} />);
    expect(screen.getByText(/console/i)).toBeInTheDocument();
  });

  it("renders stdout entries", () => {
    const entries: ConsoleEntry[] = [{ type: "stdout", text: "Hello, Marty!" }];
    render(<ConsoleOutput entries={entries} />);
    expect(screen.getByText("Hello, Marty!")).toBeInTheDocument();
  });

  it("renders error entries", () => {
    const entries: ConsoleEntry[] = [
      { type: "error", text: "SyntaxError: invalid syntax" },
    ];
    render(<ConsoleOutput entries={entries} />);
    expect(screen.getByText("SyntaxError: invalid syntax")).toBeInTheDocument();
  });

  it("renders info entries", () => {
    const entries: ConsoleEntry[] = [{ type: "info", text: "Program started" }];
    render(<ConsoleOutput entries={entries} />);
    expect(screen.getByText("Program started")).toBeInTheDocument();
  });

  it("renders multiple entries in order", () => {
    const entries: ConsoleEntry[] = [
      { type: "info", text: "Starting..." },
      { type: "stdout", text: "Walking 2 steps" },
      { type: "stdout", text: "Dancing" },
    ];
    render(<ConsoleOutput entries={entries} />);
    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(3);
    expect(items[0]).toHaveTextContent("Starting...");
    expect(items[1]).toHaveTextContent("Walking 2 steps");
    expect(items[2]).toHaveTextContent("Dancing");
  });

  it("shows empty state when no entries", () => {
    render(<ConsoleOutput entries={[]} />);
    expect(
      screen.getByText(/run your code to see output/i),
    ).toBeInTheDocument();
  });

  it("applies error styling to error entries", () => {
    const entries: ConsoleEntry[] = [{ type: "error", text: "Error occurred" }];
    render(<ConsoleOutput entries={entries} />);
    const errorElement = screen.getByText("Error occurred");
    expect(errorElement.className).toContain("text-red");
  });
});
