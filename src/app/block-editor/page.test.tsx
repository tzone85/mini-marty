import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import BlockEditorPage from "./page";

const dynamicCalls = vi.hoisted(() => {
  return [] as Array<{
    loader: () => Promise<unknown>;
    loading?: () => React.ReactElement;
    ssr?: boolean;
  }>;
});

vi.mock("next/dynamic", () => ({
  default: (
    loader: () => Promise<unknown>,
    opts?: { loading?: () => React.ReactElement; ssr?: boolean },
  ) => {
    dynamicCalls.push({ loader, loading: opts?.loading, ssr: opts?.ssr });

    const idx = dynamicCalls.length;
    if (idx === 1) {
      return function BlocklyMock() {
        return <div data-testid="blockly-workspace-mock">Blockly Mock</div>;
      };
    }
    return function SceneMock() {
      return <div data-testid="marty-scene-mock">MartyScene Mock</div>;
    };
  },
}));

vi.mock("@/features/blocks/execution/useExecutionEngine", () => ({
  useExecutionEngine: () => ({
    state: {
      status: "idle",
      speed: "normal",
      currentBlockId: null,
      consoleEntries: [],
    },
    run: vi.fn(),
    step: vi.fn(),
    pause: vi.fn(),
    resume: vi.fn(),
    stop: vi.fn(),
    setSpeed: vi.fn(),
  }),
}));

vi.mock("@/features/marty/virtual-marty", () => ({
  VirtualMarty: vi.fn(),
}));

vi.mock("@/features/blocks/BlocklyWorkspace", () => ({
  BlocklyWorkspace: () => <div>Mocked</div>,
}));

vi.mock("@/features/blocks/components/ExecutionControls", () => ({
  ExecutionControls: (props: Record<string, unknown>) => (
    <div data-testid="execution-controls" data-status={props.status}>
      ExecutionControls
    </div>
  ),
}));

vi.mock("@/features/blocks/components/ConsoleOutput", () => ({
  ConsoleOutput: () => (
    <div data-testid="console-output-mock">ConsoleOutput</div>
  ),
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

  it("renders the 3D MartyScene area", () => {
    render(<BlockEditorPage />);
    expect(screen.getByTestId("marty-scene-mock")).toBeInTheDocument();
  });

  it("renders execution controls", () => {
    render(<BlockEditorPage />);
    expect(screen.getByTestId("execution-controls")).toBeInTheDocument();
  });

  it("renders console output", () => {
    render(<BlockEditorPage />);
    expect(screen.getByTestId("console-output-mock")).toBeInTheDocument();
  });

  it("passes idle status to execution controls", () => {
    render(<BlockEditorPage />);
    expect(screen.getByTestId("execution-controls")).toHaveAttribute(
      "data-status",
      "idle",
    );
  });

  it("disables SSR for both dynamic imports", () => {
    expect(dynamicCalls.length).toBe(2);
    expect(dynamicCalls[0].ssr).toBe(false);
    expect(dynamicCalls[1].ssr).toBe(false);
  });

  it("Blockly loading component renders loading text", () => {
    const LoadingComponent = dynamicCalls[0].loading!;
    const { container } = render(<LoadingComponent />);
    expect(container.textContent).toContain("Loading Blockly workspace");
  });

  it("MartyScene loading component renders loading text", () => {
    const LoadingComponent = dynamicCalls[1].loading!;
    const { container } = render(<LoadingComponent />);
    expect(container.textContent).toContain("Loading 3D view");
  });
});
