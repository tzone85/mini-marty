import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

vi.mock("@/features/editor/components/BlocklyWorkspace", () => ({
  BlocklyWorkspace: () => (
    <div data-testid="blockly-workspace">Blockly Mock</div>
  ),
}));

vi.mock("next/dynamic", () => ({
  __esModule: true,
  default: (
    _loader: () => Promise<unknown>,
    options?: { loading?: () => React.ReactNode },
  ) => {
    const LoadingComponent = options?.loading;
    return function DynamicMock() {
      return LoadingComponent ? <LoadingComponent /> : null;
    };
  },
}));

describe("BlockEditorPage (loading state)", () => {
  it("renders the loading fallback", async () => {
    const { default: BlockEditorPage } = await import("./page");
    render(<BlockEditorPage />);
    expect(screen.getByTestId("blockly-loading")).toBeInTheDocument();
    expect(screen.getByText(/loading blockly editor/i)).toBeInTheDocument();
  });

  it("renders the heading", async () => {
    const { default: BlockEditorPage } = await import("./page");
    render(<BlockEditorPage />);
    expect(
      screen.getByRole("heading", { name: /block editor/i }),
    ).toBeInTheDocument();
  });

  it("renders a description", async () => {
    const { default: BlockEditorPage } = await import("./page");
    render(<BlockEditorPage />);
    expect(screen.getByText(/drag and drop/i)).toBeInTheDocument();
  });
});

describe("BlockEditorPage (loaded state)", () => {
  it("renders the BlocklyWorkspace after loading", async () => {
    vi.doUnmock("next/dynamic");
    vi.resetModules();

    vi.doMock("next/dynamic", () => ({
      __esModule: true,
      default: (loader: () => Promise<{ default: React.ComponentType }>) => {
        let Comp: React.ComponentType | null = null;
        const promise = loader();
        promise.then((mod) => {
          Comp =
            typeof mod === "function"
              ? mod
              : (mod as { default: React.ComponentType }).default || mod;
        });
        return function DynamicResolved(props: Record<string, unknown>) {
          if (Comp) return <Comp {...props} />;
          return <div>Loading...</div>;
        };
      },
    }));

    const { default: BlockEditorPage } = await import("./page");
    await vi.dynamicImportSettled?.();
    render(<BlockEditorPage />);
    expect(screen.getByTestId("blockly-workspace")).toBeInTheDocument();
  });
});
