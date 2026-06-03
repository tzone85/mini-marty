import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { PythonEditor } from "./PythonEditor";
import { ThemeProvider } from "@/lib/theme-context";

vi.mock("@monaco-editor/react", () => ({
  default: ({
    value,
    language,
    theme,
    onChange,
    options,
  }: {
    value: string;
    language: string;
    theme: string;
    onChange?: (value: string | undefined) => void;
    options?: Record<string, unknown>;
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

function renderEditor(
  props: { value?: string; onChange?: (v: string) => void } = {},
) {
  return render(
    <ThemeProvider>
      <PythonEditor
        value={props.value ?? ""}
        onChange={props.onChange ?? (() => {})}
      />
    </ThemeProvider>,
  );
}

describe("PythonEditor", () => {
  it("renders the Monaco editor", () => {
    renderEditor();
    expect(screen.getByTestId("monaco-editor")).toBeInTheDocument();
  });

  it("sets the language to python", () => {
    renderEditor();
    expect(screen.getByTestId("monaco-editor")).toHaveAttribute(
      "data-language",
      "python",
    );
  });

  it("passes the value to the editor", () => {
    renderEditor({ value: "print('hello')" });
    expect(screen.getByTestId("monaco-editor")).toHaveAttribute(
      "data-value",
      "print('hello')",
    );
  });

  it("uses dark theme when in dark mode", () => {
    localStorage.setItem("mini-marty-theme", "dark");
    renderEditor();
    expect(screen.getByTestId("monaco-editor")).toHaveAttribute(
      "data-theme",
      "vs-dark",
    );
    localStorage.clear();
  });

  it("uses light theme when in light mode", () => {
    localStorage.clear();
    renderEditor();
    expect(screen.getByTestId("monaco-editor")).toHaveAttribute(
      "data-theme",
      "vs",
    );
  });
});
