import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { EditorToolbar } from "./EditorToolbar";

describe("EditorToolbar", () => {
  it("renders Run button", () => {
    render(<EditorToolbar />);
    expect(screen.getByRole("button", { name: /run/i })).toBeInTheDocument();
  });

  it("renders Stop button", () => {
    render(<EditorToolbar />);
    expect(screen.getByRole("button", { name: /stop/i })).toBeInTheDocument();
  });

  it("renders Clear button", () => {
    render(<EditorToolbar />);
    expect(screen.getByRole("button", { name: /clear/i })).toBeInTheDocument();
  });

  it("renders Save button", () => {
    render(<EditorToolbar />);
    expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();
  });

  it("renders Load button", () => {
    render(<EditorToolbar />);
    expect(screen.getByRole("button", { name: /load/i })).toBeInTheDocument();
  });

  it("calls onRun when Run is clicked", async () => {
    const user = userEvent.setup();
    const onRun = vi.fn();
    render(<EditorToolbar onRun={onRun} />);

    await user.click(screen.getByRole("button", { name: /run/i }));
    expect(onRun).toHaveBeenCalledOnce();
  });

  it("calls onStop when Stop is clicked", async () => {
    const user = userEvent.setup();
    const onStop = vi.fn();
    render(<EditorToolbar onStop={onStop} isRunning={true} />);

    await user.click(screen.getByRole("button", { name: /stop/i }));
    expect(onStop).toHaveBeenCalledOnce();
  });

  it("calls onClear when Clear is clicked", async () => {
    const user = userEvent.setup();
    const onClear = vi.fn();
    render(<EditorToolbar onClear={onClear} />);

    await user.click(screen.getByRole("button", { name: /clear/i }));
    expect(onClear).toHaveBeenCalledOnce();
  });

  it("calls onSave when Save is clicked", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    render(<EditorToolbar onSave={onSave} />);

    await user.click(screen.getByRole("button", { name: /save/i }));
    expect(onSave).toHaveBeenCalledOnce();
  });

  it("calls onLoad when Load is clicked", async () => {
    const user = userEvent.setup();
    const onLoad = vi.fn();
    render(<EditorToolbar onLoad={onLoad} />);

    await user.click(screen.getByRole("button", { name: /load/i }));
    expect(onLoad).toHaveBeenCalledOnce();
  });

  it("disables Stop when isRunning is false", () => {
    render(<EditorToolbar isRunning={false} />);
    expect(screen.getByRole("button", { name: /stop/i })).toBeDisabled();
  });

  it("enables Stop when isRunning is true", () => {
    render(<EditorToolbar isRunning={true} />);
    expect(screen.getByRole("button", { name: /stop/i })).not.toBeDisabled();
  });
});
