import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { BlocklyWorkspace } from "./BlocklyWorkspace";

const mockInject = vi.fn();
const mockDispose = vi.fn();
const mockUndo = vi.fn();
const mockSave = vi.fn().mockReturnValue({ blocks: {} });
const mockLoad = vi.fn();
const mockDefineBlocksWithJsonArray = vi.fn();

const mockWorkspace = {
  dispose: mockDispose,
  undo: mockUndo,
  getAllBlocks: () => [],
};

vi.mock("blockly", () => ({
  inject: (...args: unknown[]) => {
    mockInject(...args);
    return mockWorkspace;
  },
  defineBlocksWithJsonArray: (...args: unknown[]) => {
    mockDefineBlocksWithJsonArray(...args);
  },
  serialization: {
    workspaces: {
      save: (...args: unknown[]) => mockSave(...args),
      load: (...args: unknown[]) => mockLoad(...args),
    },
  },
}));

describe("BlocklyWorkspace", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("renders a workspace container", () => {
    render(<BlocklyWorkspace />);
    expect(screen.getByTestId("blockly-container")).toBeInTheDocument();
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

  it("calls Blockly.inject on mount", () => {
    render(<BlocklyWorkspace />);
    expect(mockInject).toHaveBeenCalled();
  });

  it("registers custom blocks on mount", () => {
    render(<BlocklyWorkspace />);
    expect(mockDefineBlocksWithJsonArray).toHaveBeenCalled();
  });

  it("saves workspace to localStorage on save click", async () => {
    const user = userEvent.setup();
    render(<BlocklyWorkspace />);

    await user.click(screen.getByRole("button", { name: /save/i }));
    expect(mockSave).toHaveBeenCalledWith(mockWorkspace);
    expect(localStorage.getItem("mini-marty-blocks")).toBeTruthy();
  });

  it("loads workspace from localStorage on load click", async () => {
    localStorage.setItem("mini-marty-blocks", JSON.stringify({ blocks: {} }));
    const user = userEvent.setup();
    render(<BlocklyWorkspace />);

    await user.click(screen.getByRole("button", { name: /load/i }));
    expect(mockLoad).toHaveBeenCalled();
  });

  it("calls undo on undo click", async () => {
    const user = userEvent.setup();
    render(<BlocklyWorkspace />);

    await user.click(screen.getByRole("button", { name: /undo/i }));
    expect(mockUndo).toHaveBeenCalledWith(false);
  });

  it("calls redo on redo click", async () => {
    const user = userEvent.setup();
    render(<BlocklyWorkspace />);

    await user.click(screen.getByRole("button", { name: /redo/i }));
    expect(mockUndo).toHaveBeenCalledWith(true);
  });
});
