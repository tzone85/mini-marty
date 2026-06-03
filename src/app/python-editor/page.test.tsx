import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import PythonEditorPage from "./page";
import { ThemeProvider } from "@/lib/theme-context";

vi.mock("@monaco-editor/react", () => ({
  default: ({
    value,
    language,
    theme,
  }: {
    value: string;
    language: string;
    theme: string;
  }) => (
    <div
      data-testid="monaco-editor"
      data-language={language}
      data-theme={theme}
      data-value={value}
    >
      Monaco Editor Mock
    </div>
  ),
}));

vi.mock("next/dynamic", () => ({
  default: (loader: () => Promise<{ default: React.ComponentType }>) => {
    // Immediately resolve the dynamic import for testing
    const MockComponent = ({ marty }: { marty?: unknown }) => (
      <div data-testid="marty-scene" data-has-marty={marty ? "true" : "false"}>
        3D Scene Mock
      </div>
    );
    MockComponent.displayName = "DynamicMock";
    return MockComponent;
  },
}));

vi.mock("@/features/python-runtime/hooks/usePyodide", () => ({
  usePyodide: () => ({
    state: "ready",
    error: null,
    instance: {
      runPythonAsync: vi.fn(),
      registerJsModule: vi.fn(),
      setStdout: vi.fn(),
      setStderr: vi.fn(),
      globals: { get: vi.fn() },
    },
    initialize: vi.fn(),
  }),
}));

vi.mock("@/features/python-runtime/hooks/usePythonExecution", () => ({
  usePythonExecution: () => ({
    isRunning: false,
    consoleEntries: [],
    lastError: null,
    run: vi.fn(),
    stop: vi.fn(),
    clearConsole: vi.fn(),
  }),
}));

function renderPage() {
  return render(
    <ThemeProvider>
      <PythonEditorPage />
    </ThemeProvider>,
  );
}

describe("PythonEditorPage", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove("dark");
  });

  it("renders the heading", () => {
    renderPage();
    expect(
      screen.getByRole("heading", { name: /python editor/i }),
    ).toBeInTheDocument();
  });

  it("renders the Monaco editor", () => {
    renderPage();
    expect(screen.getByTestId("monaco-editor")).toBeInTheDocument();
  });

  it("renders the editor toolbar", () => {
    renderPage();
    expect(screen.getByRole("toolbar")).toBeInTheDocument();
  });

  it("renders Run and Stop buttons", () => {
    renderPage();
    expect(screen.getByRole("button", { name: /run/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /stop/i })).toBeInTheDocument();
  });

  it("renders Save and Load buttons", () => {
    renderPage();
    expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /load/i })).toBeInTheDocument();
  });

  it("loads starter template by default", () => {
    renderPage();
    const editor = screen.getByTestId("monaco-editor");
    expect(editor.getAttribute("data-value")).toContain(
      "from martypy import Marty",
    );
  });

  it("saves code to localStorage", async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(screen.getByRole("button", { name: /save/i }));
    expect(localStorage.getItem("mini-marty-python-code")).toBeTruthy();
  });

  it("sets editor language to python", () => {
    renderPage();
    expect(screen.getByTestId("monaco-editor")).toHaveAttribute(
      "data-language",
      "python",
    );
  });

  it("renders the 3D Marty viewport", () => {
    renderPage();
    expect(screen.getByTestId("marty-viewport")).toBeInTheDocument();
  });

  it("renders the MartyScene with marty instance", () => {
    renderPage();
    expect(screen.getByTestId("marty-scene")).toBeInTheDocument();
    expect(screen.getByTestId("marty-scene")).toHaveAttribute(
      "data-has-marty",
      "true",
    );
  });

  it("renders the console output panel", () => {
    renderPage();
    expect(screen.getByTestId("console-output")).toBeInTheDocument();
  });

  it("renders the Pyodide status indicator", () => {
    renderPage();
    expect(screen.getByTestId("pyodide-status")).toBeInTheDocument();
  });

  it("shows Python ready status", () => {
    renderPage();
    expect(screen.getByText("Python ready")).toBeInTheDocument();
  });
});
