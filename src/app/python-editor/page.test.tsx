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

  it("disables Run button while running", async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(screen.getByRole("button", { name: /run/i }));
    expect(screen.getByRole("button", { name: /run/i })).toBeDisabled();
  });

  it("enables Stop button while running", async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(screen.getByRole("button", { name: /run/i }));
    expect(screen.getByRole("button", { name: /stop/i })).toBeEnabled();
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
});
