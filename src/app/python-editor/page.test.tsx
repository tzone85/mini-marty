import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ThemeProvider } from "@/lib/theme-context";
import PythonEditorPage from "./page";

vi.mock("@monaco-editor/react", () => ({
  default: ({
    value,
    onChange,
    language,
    theme,
  }: {
    value?: string;
    onChange?: (value: string | undefined) => void;
    language?: string;
    theme?: string;
    options?: Record<string, unknown>;
    onMount?: unknown;
    height?: string;
  }) => (
    <div
      data-testid="monaco-editor"
      data-language={language}
      data-theme={theme}
      data-value={value}
    >
      <textarea
        data-testid="monaco-textarea"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
      />
    </div>
  ),
}));

function renderPage() {
  return render(
    <ThemeProvider>
      <PythonEditorPage />
    </ThemeProvider>,
  );
}

describe("Python Editor page", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove("dark", "light");
  });

  it("renders the heading", () => {
    renderPage();
    expect(
      screen.getByRole("heading", { name: /python editor/i }),
    ).toBeInTheDocument();
  });

  it("renders a description", () => {
    renderPage();
    expect(screen.getByText(/write python code/i)).toBeInTheDocument();
  });

  it("renders the Monaco editor", () => {
    renderPage();
    expect(screen.getByTestId("monaco-editor")).toBeInTheDocument();
  });

  it("renders the editor toolbar", () => {
    renderPage();
    expect(screen.getByRole("toolbar")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /run/i })).toBeInTheDocument();
  });

  it("renders the console output", () => {
    renderPage();
    expect(screen.getByText(/console/i)).toBeInTheDocument();
  });

  it("shows message when Run is clicked", async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(screen.getByRole("button", { name: /run/i }));
    expect(screen.getByText(/running program/i)).toBeInTheDocument();
  });

  it("shows message when Save is clicked", async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(screen.getByRole("button", { name: /save/i }));
    expect(screen.getByText(/code saved/i)).toBeInTheDocument();
  });

  it("clears console when Clear is clicked", async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(screen.getByRole("button", { name: /run/i }));
    expect(screen.getByText(/running program/i)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /clear/i }));
    expect(screen.queryByText(/running program/i)).not.toBeInTheDocument();
  });

  it("loads code from localStorage", async () => {
    localStorage.setItem("mini-marty-python-code", 'print("loaded")');
    const user = userEvent.setup();
    renderPage();

    await user.click(screen.getByRole("button", { name: /load/i }));
    expect(
      screen.getByText(/code loaded from browser storage/i),
    ).toBeInTheDocument();
  });

  it("shows no saved code message when nothing to load", async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(screen.getByRole("button", { name: /load/i }));
    expect(screen.getByText(/no saved code found/i)).toBeInTheDocument();
  });

  it("Stop button is disabled by default", () => {
    renderPage();
    expect(screen.getByRole("button", { name: /stop/i })).toBeDisabled();
  });
});
