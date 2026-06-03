import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ConsoleOutput } from "./ConsoleOutput";
import type { ConsoleEntry } from "../types";

function entry(
  type: ConsoleEntry["type"],
  text: string,
  id = String(Math.random()),
): ConsoleEntry {
  return { id, type, text, timestamp: 0 };
}

describe("ConsoleOutput", () => {
  it("shows an empty-state placeholder when there are no entries", () => {
    render(<ConsoleOutput entries={[]} onClear={() => {}} />);
    expect(screen.getByTestId("console-empty")).toBeInTheDocument();
  });

  it("renders each entry with the matching test id per type", () => {
    const entries: ConsoleEntry[] = [
      entry("stdout", "hello", "1"),
      entry("stderr", "boom", "2"),
      entry("info", "loading", "3"),
    ];
    render(<ConsoleOutput entries={entries} onClear={() => {}} />);
    expect(screen.getByTestId("console-entry-stdout")).toHaveTextContent(
      "hello",
    );
    expect(screen.getByTestId("console-entry-stderr")).toHaveTextContent(
      "boom",
    );
    expect(screen.getByTestId("console-entry-info")).toHaveTextContent(
      "loading",
    );
  });

  it("invokes onClear when the Clear button is pressed", () => {
    const onClear = vi.fn();
    render(<ConsoleOutput entries={[]} onClear={onClear} />);
    fireEvent.click(screen.getByRole("button", { name: /clear console/i }));
    expect(onClear).toHaveBeenCalledTimes(1);
  });
});
