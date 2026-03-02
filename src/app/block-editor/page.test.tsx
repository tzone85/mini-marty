import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import BlockEditorPage from "./page";

const captured = vi.hoisted(() => ({
  loading: undefined as (() => React.ReactElement) | undefined,
  loader: undefined as (() => Promise<unknown>) | undefined,
}));

vi.mock("next/dynamic", () => ({
  default: (
    loader: () => Promise<unknown>,
    opts?: { loading?: () => React.ReactElement },
  ) => {
    captured.loading = opts?.loading;
    captured.loader = loader;
    const MockComponent = () => (
      <div data-testid="blockly-workspace-mock">Blockly Mock</div>
    );
    MockComponent.displayName = "DynamicBlocklyWorkspace";
    return MockComponent;
  },
}));

vi.mock("@/features/blocks/BlocklyWorkspace", () => ({
  BlocklyWorkspace: () => <div>Mocked</div>,
}));

describe("Block Editor page", () => {
  it("renders the heading", () => {
    render(<BlockEditorPage />);
    expect(
      screen.getByRole("heading", { name: /block editor/i }),
    ).toBeInTheDocument();
  });

  it("renders a description", () => {
    render(<BlockEditorPage />);
    expect(screen.getByText(/drag and drop/i)).toBeInTheDocument();
  });

  it("renders the Blockly workspace area", () => {
    render(<BlockEditorPage />);
    expect(screen.getByTestId("blockly-workspace-mock")).toBeInTheDocument();
  });

  it("renders the loading state", () => {
    render(<BlockEditorPage />);
    expect(captured.loading).toBeDefined();
    const LoadingComponent = captured.loading!;
    const { container } = render(<LoadingComponent />);
    expect(container.textContent).toContain("Loading Blockly workspace");
  });

  it("dynamic loader resolves to BlocklyWorkspace", async () => {
    render(<BlockEditorPage />);
    expect(captured.loader).toBeDefined();
    const mod = await captured.loader!();
    expect(mod).toBeDefined();
  });
});
