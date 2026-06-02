import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { EditorToolbar } from "./EditorToolbar";

function setup(isRunning = false) {
  const handlers = {
    onRun: vi.fn(),
    onStop: vi.fn(),
    onClear: vi.fn(),
    onSave: vi.fn(),
    onLoad: vi.fn(),
  };
  render(<EditorToolbar {...handlers} isRunning={isRunning} />);
  return handlers;
}

describe("EditorToolbar", () => {
  it("disables Stop when not running and disables Run when running", () => {
    setup(false);
    expect(screen.getByRole("button", { name: /^run$/i })).toBeEnabled();
    expect(screen.getByRole("button", { name: /^stop$/i })).toBeDisabled();
  });

  it("disables Run and enables Stop when running", () => {
    setup(true);
    expect(screen.getByRole("button", { name: /^run$/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /^stop$/i })).toBeEnabled();
  });

  it("wires every button to its callback", () => {
    const handlers = setup(false);
    fireEvent.click(screen.getByRole("button", { name: /^run$/i }));
    fireEvent.click(screen.getByRole("button", { name: /^clear$/i }));
    fireEvent.click(screen.getByRole("button", { name: /^save$/i }));
    fireEvent.click(screen.getByRole("button", { name: /^load$/i }));
    expect(handlers.onRun).toHaveBeenCalledTimes(1);
    expect(handlers.onClear).toHaveBeenCalledTimes(1);
    expect(handlers.onSave).toHaveBeenCalledTimes(1);
    expect(handlers.onLoad).toHaveBeenCalledTimes(1);
  });

  it("triggers onStop only when running", () => {
    const handlers = setup(true);
    fireEvent.click(screen.getByRole("button", { name: /^stop$/i }));
    expect(handlers.onStop).toHaveBeenCalledTimes(1);
  });

  it("renders a toolbar landmark", () => {
    setup();
    expect(
      screen.getByRole("toolbar", { name: /editor controls/i }),
    ).toBeInTheDocument();
  });
});
