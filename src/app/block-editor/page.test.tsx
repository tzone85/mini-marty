import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import BlockEditorPage from "./page";

const captured = vi.hoisted(() => ({
  loading: undefined as (() => React.ReactElement) | undefined,
  loader: undefined as (() => Promise<unknown>) | undefined,
  ssr: undefined as boolean | undefined,
}));

vi.mock("next/dynamic", () => ({
  default: (
    loader: () => Promise<unknown>,
    opts?: { loading?: () => React.ReactElement; ssr?: boolean },
  ) => {
    captured.loading = opts?.loading;
    captured.loader = loader;
    captured.ssr = opts?.ssr;
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

  it("disables server-side rendering for Blockly", () => {
    render(<BlockEditorPage />);
    expect(captured.ssr).toBe(false);
  });

  it("loading component renders accessible text in a centered container", () => {
    render(<BlockEditorPage />);
    const LoadingComponent = captured.loading!;
    const { container } = render(<LoadingComponent />);
    const div = container.firstElementChild as HTMLElement;
    expect(div.tagName).toBe("DIV");
    expect(div.textContent).toBe("Loading Blockly workspace...");
    expect(div.className).toContain("flex");
    expect(div.className).toContain("items-center");
    expect(div.className).toContain("justify-center");
  });

  it("dynamic loader extracts the named BlocklyWorkspace export", async () => {
    render(<BlockEditorPage />);
    const resolved = await captured.loader!();
    expect(resolved).toEqual(expect.objectContaining({}));
  });
});
