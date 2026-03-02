import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { EditorToolbar } from "./EditorToolbar";

const defaultProps = {
  onRun: vi.fn(),
  onStop: vi.fn(),
  onClear: vi.fn(),
  onSave: vi.fn(),
  onLoad: vi.fn(),
  isRunning: false,
};

function renderToolbar(overrides = {}) {
  const props = { ...defaultProps, ...overrides };
  return render(<EditorToolbar {...props} />);
}

describe("EditorToolbar", () => {
  it("renders Run button", () => {
    renderToolbar();
    expect(screen.getByRole("button", { name: /run/i })).toBeInTheDocument();
  });

  it("renders Stop button", () => {
    renderToolbar();
    expect(screen.getByRole("button", { name: /stop/i })).toBeInTheDocument();
  });

  it("renders Clear button", () => {
    renderToolbar();
    expect(screen.getByRole("button", { name: /clear/i })).toBeInTheDocument();
  });

  it("renders Save button", () => {
    renderToolbar();
    expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();
  });

  it("renders Load button", () => {
    renderToolbar();
    expect(screen.getByRole("button", { name: /load/i })).toBeInTheDocument();
  });

  it("calls onRun when Run is clicked", async () => {
    const onRun = vi.fn();
    const user = userEvent.setup();
    renderToolbar({ onRun });

    await user.click(screen.getByRole("button", { name: /run/i }));
    expect(onRun).toHaveBeenCalledOnce();
  });

  it("calls onStop when Stop is clicked", async () => {
    const onStop = vi.fn();
    const user = userEvent.setup();
    renderToolbar({ onStop, isRunning: true });

    await user.click(screen.getByRole("button", { name: /stop/i }));
    expect(onStop).toHaveBeenCalledOnce();
  });

  it("calls onClear when Clear is clicked", async () => {
    const onClear = vi.fn();
    const user = userEvent.setup();
    renderToolbar({ onClear });

    await user.click(screen.getByRole("button", { name: /clear/i }));
    expect(onClear).toHaveBeenCalledOnce();
  });

  it("calls onSave when Save is clicked", async () => {
    const onSave = vi.fn();
    const user = userEvent.setup();
    renderToolbar({ onSave });

    await user.click(screen.getByRole("button", { name: /save/i }));
    expect(onSave).toHaveBeenCalledOnce();
  });

  it("calls onLoad when Load is clicked", async () => {
    const onLoad = vi.fn();
    const user = userEvent.setup();
    renderToolbar({ onLoad });

    await user.click(screen.getByRole("button", { name: /load/i }));
    expect(onLoad).toHaveBeenCalledOnce();
  });

  it("disables Run button when isRunning is true", () => {
    renderToolbar({ isRunning: true });
    expect(screen.getByRole("button", { name: /run/i })).toBeDisabled();
  });

  it("enables Stop button when isRunning is true", () => {
    renderToolbar({ isRunning: true });
    expect(screen.getByRole("button", { name: /stop/i })).toBeEnabled();
  });

  it("disables Stop button when isRunning is false", () => {
    renderToolbar({ isRunning: false });
    expect(screen.getByRole("button", { name: /stop/i })).toBeDisabled();
  });

  it("renders as a toolbar landmark", () => {
    renderToolbar();
    expect(screen.getByRole("toolbar")).toBeInTheDocument();
  });
});
