import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { BlocklyWorkspace } from "./BlocklyWorkspace";

const { mockLoad, mockSerialize, mockDispose, mockUndo, mockWorkspace } =
  vi.hoisted(() => {
    const mockLoad = vi.fn();
    const mockSerialize = vi.fn(() => ({ blocks: {} }));
    const mockDispose = vi.fn();
    const mockUndo = vi.fn();
    const mockWorkspace = {
      dispose: mockDispose,
      addChangeListener: vi.fn(),
      removeChangeListener: vi.fn(),
      clearUndo: vi.fn(),
      undo: mockUndo,
    };
    return { mockLoad, mockSerialize, mockDispose, mockUndo, mockWorkspace };
  });

vi.mock("blockly", () => ({
  inject: vi.fn(() => mockWorkspace),
  serialization: {
    workspaces: {
      save: mockSerialize,
      load: mockLoad,
    },
  },
  defineBlocksWithJsonArray: vi.fn(),
}));

describe("BlocklyWorkspace", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("renders the workspace container", () => {
    render(<BlocklyWorkspace />);
    expect(screen.getByTestId("blockly-workspace")).toBeInTheDocument();
  });

  it("renders undo button", () => {
    render(<BlocklyWorkspace />);
    expect(screen.getByRole("button", { name: /undo/i })).toBeInTheDocument();
  });

  it("renders redo button", () => {
    render(<BlocklyWorkspace />);
    expect(screen.getByRole("button", { name: /redo/i })).toBeInTheDocument();
  });

  it("renders save button", () => {
    render(<BlocklyWorkspace />);
    expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();
  });

  it("renders load button", () => {
    render(<BlocklyWorkspace />);
    expect(screen.getByRole("button", { name: /load/i })).toBeInTheDocument();
  });

  it("renders a toolbar", () => {
    render(<BlocklyWorkspace />);
    expect(screen.getByRole("toolbar")).toBeInTheDocument();
  });

  it("saves workspace to localStorage on save click", async () => {
    const user = userEvent.setup();
    render(<BlocklyWorkspace />);

    await user.click(screen.getByRole("button", { name: /save/i }));
    expect(mockSerialize).toHaveBeenCalledWith(mockWorkspace);
    expect(localStorage.getItem("mini-marty-blockly-workspace")).toBeTruthy();
  });

  it("loads workspace from localStorage on load click", async () => {
    const savedState = { blocks: { type: "test" } };
    localStorage.setItem(
      "mini-marty-blockly-workspace",
      JSON.stringify(savedState),
    );
    const user = userEvent.setup();
    render(<BlocklyWorkspace />);

    await user.click(screen.getByRole("button", { name: /load/i }));
    expect(mockLoad).toHaveBeenCalledWith(savedState, mockWorkspace);
  });

  it("does not call load when localStorage is empty", async () => {
    const user = userEvent.setup();
    render(<BlocklyWorkspace />);

    await user.click(screen.getByRole("button", { name: /load/i }));
    expect(mockLoad).not.toHaveBeenCalled();
  });

  it("calls undo with false when undo is clicked", async () => {
    const user = userEvent.setup();
    render(<BlocklyWorkspace />);

    await user.click(screen.getByRole("button", { name: /undo/i }));
    expect(mockUndo).toHaveBeenCalledWith(false);
  });

  it("calls undo with true when redo is clicked", async () => {
    const user = userEvent.setup();
    render(<BlocklyWorkspace />);

    await user.click(screen.getByRole("button", { name: /redo/i }));
    expect(mockUndo).toHaveBeenCalledWith(true);
  });

  it("disposes workspace on unmount", () => {
    const { unmount } = render(<BlocklyWorkspace />);
    unmount();
    expect(mockDispose).toHaveBeenCalled();
  });
});
