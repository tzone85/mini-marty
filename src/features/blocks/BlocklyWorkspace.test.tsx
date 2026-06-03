import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { BlocklyWorkspace } from "./BlocklyWorkspace";

const mockDispose = vi.fn();
const mockUndo = vi.fn();
const mockSave = vi.fn().mockReturnValue({ blocks: {} });
const mockLoad = vi.fn();
const mockDefineBlocksWithJsonArray = vi.fn();

const mockWorkspace = {
  dispose: mockDispose,
  undo: mockUndo,
  getAllBlocks: () => [],
  getTopBlocks: () => [],
  highlightBlock: vi.fn(),
};

const mockInject = vi.fn().mockReturnValue(mockWorkspace);

vi.mock("blockly", () => ({
  inject: (...args: unknown[]) => {
    return mockInject(...args);
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
    mockInject.mockReturnValue(mockWorkspace);
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

  it("does not call serialization.load when localStorage is empty", async () => {
    const user = userEvent.setup();
    render(<BlocklyWorkspace />);

    await user.click(screen.getByRole("button", { name: /load/i }));
    expect(mockLoad).not.toHaveBeenCalled();
  });

  it("passes the correct parsed state and workspace to load", async () => {
    const savedState = { blocks: { languageVersion: 0, blocks: [] } };
    localStorage.setItem("mini-marty-blocks", JSON.stringify(savedState));
    const user = userEvent.setup();
    render(<BlocklyWorkspace />);

    await user.click(screen.getByRole("button", { name: /load/i }));
    expect(mockLoad).toHaveBeenCalledWith(savedState, mockWorkspace);
  });

  it("handles corrupt JSON in localStorage gracefully", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    localStorage.setItem("mini-marty-blocks", "not{valid-json");
    const user = userEvent.setup();
    render(<BlocklyWorkspace />);

    await user.click(screen.getByRole("button", { name: /load/i }));
    expect(mockLoad).not.toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith(
      "Failed to load workspace:",
      expect.any(SyntaxError),
    );
    consoleSpy.mockRestore();
  });

  it("does not call serialization.load when localStorage value is empty string", async () => {
    localStorage.setItem("mini-marty-blocks", "");
    const user = userEvent.setup();
    render(<BlocklyWorkspace />);

    await user.click(screen.getByRole("button", { name: /load/i }));
    expect(mockLoad).not.toHaveBeenCalled();
  });

  it("disposes workspace on unmount", () => {
    const { unmount } = render(<BlocklyWorkspace />);
    unmount();
    expect(mockDispose).toHaveBeenCalled();
  });

  describe("when workspace is not initialized", () => {
    beforeEach(() => {
      mockInject.mockReturnValue(null);
    });

    it("save is a no-op without workspace", async () => {
      const user = userEvent.setup();
      render(<BlocklyWorkspace />);

      await user.click(screen.getByRole("button", { name: /save/i }));
      expect(mockSave).not.toHaveBeenCalled();
    });

    it("load is a no-op without workspace", async () => {
      localStorage.setItem("mini-marty-blocks", JSON.stringify({ blocks: {} }));
      const user = userEvent.setup();
      render(<BlocklyWorkspace />);

      await user.click(screen.getByRole("button", { name: /load/i }));
      expect(mockLoad).not.toHaveBeenCalled();
    });

    it("undo is a no-op without workspace", async () => {
      const user = userEvent.setup();
      render(<BlocklyWorkspace />);

      await user.click(screen.getByRole("button", { name: /undo/i }));
      expect(mockUndo).not.toHaveBeenCalled();
    });

    it("redo is a no-op without workspace", async () => {
      const user = userEvent.setup();
      render(<BlocklyWorkspace />);

      await user.click(screen.getByRole("button", { name: /redo/i }));
      expect(mockUndo).not.toHaveBeenCalled();
    });
  });
});
