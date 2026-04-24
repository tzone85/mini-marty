import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { ConsoleOutput } from "./ConsoleOutput";
import type { ConsoleEntry } from "../types";

function createEntry(overrides: Partial<ConsoleEntry> = {}): ConsoleEntry {
  return {
    id: "entry-1",
    type: "stdout",
    text: "Hello",
    timestamp: 1000,
    ...overrides,
  };
}

describe("ConsoleOutput", () => {
  it("renders the console container", () => {
    render(<ConsoleOutput entries={[]} onClear={vi.fn()} />);
    expect(screen.getByTestId("console-output")).toBeInTheDocument();
  });

  it("shows empty state message when no entries", () => {
    render(<ConsoleOutput entries={[]} onClear={vi.fn()} />);
    expect(screen.getByTestId("console-empty")).toBeInTheDocument();
    expect(
      screen.getByText(/python output will appear here/i),
    ).toBeInTheDocument();
  });

  it("renders stdout entries", () => {
    const entries = [createEntry({ id: "1", type: "stdout", text: "Hello" })];
    render(<ConsoleOutput entries={entries} onClear={vi.fn()} />);
    expect(screen.getByTestId("console-entry-stdout")).toBeInTheDocument();
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });

  it("renders stderr entries", () => {
    const entries = [createEntry({ id: "1", type: "stderr", text: "Error!" })];
    render(<ConsoleOutput entries={entries} onClear={vi.fn()} />);
    expect(screen.getByTestId("console-entry-stderr")).toBeInTheDocument();
    expect(screen.getByText("Error!")).toBeInTheDocument();
  });

  it("renders info entries", () => {
    const entries = [createEntry({ id: "1", type: "info", text: "Started" })];
    render(<ConsoleOutput entries={entries} onClear={vi.fn()} />);
    expect(screen.getByTestId("console-entry-info")).toBeInTheDocument();
  });

  it("renders multiple entries", () => {
    const entries = [
      createEntry({ id: "1", type: "stdout", text: "Line 1" }),
      createEntry({ id: "2", type: "stdout", text: "Line 2" }),
      createEntry({ id: "3", type: "stderr", text: "Error" }),
    ];
    render(<ConsoleOutput entries={entries} onClear={vi.fn()} />);
    expect(screen.getByText("Line 1")).toBeInTheDocument();
    expect(screen.getByText("Line 2")).toBeInTheDocument();
    expect(screen.getByText("Error")).toBeInTheDocument();
  });

  it("does not show empty state when entries exist", () => {
    const entries = [createEntry()];
    render(<ConsoleOutput entries={entries} onClear={vi.fn()} />);
    expect(screen.queryByTestId("console-empty")).not.toBeInTheDocument();
  });

  it("calls onClear when Clear button is clicked", async () => {
    const user = userEvent.setup();
    const onClear = vi.fn();
    render(<ConsoleOutput entries={[]} onClear={onClear} />);

    await user.click(screen.getByRole("button", { name: /clear console/i }));
    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it("renders Console header label", () => {
    render(<ConsoleOutput entries={[]} onClear={vi.fn()} />);
    expect(screen.getByText("Console")).toBeInTheDocument();
  });

  it("has an accessible log role", () => {
    render(<ConsoleOutput entries={[]} onClear={vi.fn()} />);
    expect(screen.getByRole("log")).toBeInTheDocument();
  });

  it("applies correct CSS class for stdout entries", () => {
    const entries = [createEntry({ id: "1", type: "stdout", text: "out" })];
    render(<ConsoleOutput entries={entries} onClear={vi.fn()} />);
    const entry = screen.getByTestId("console-entry-stdout");
    expect(entry.className).toContain("text-green-300");
  });

  it("applies correct CSS class for stderr entries", () => {
    const entries = [createEntry({ id: "1", type: "stderr", text: "err" })];
    render(<ConsoleOutput entries={entries} onClear={vi.fn()} />);
    const entry = screen.getByTestId("console-entry-stderr");
    expect(entry.className).toContain("text-red-400");
  });

  it("applies correct CSS class for info entries", () => {
    const entries = [createEntry({ id: "1", type: "info", text: "info" })];
    render(<ConsoleOutput entries={entries} onClear={vi.fn()} />);
    const entry = screen.getByTestId("console-entry-info");
    expect(entry.className).toContain("text-blue-400");
  });
});
