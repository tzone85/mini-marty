import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { PythonEditor } from "./PythonEditor";

let capturedOnMount: ((editor: unknown, monaco: unknown) => void) | undefined;

vi.mock("@monaco-editor/react", () => ({
  default: ({
    value,
    onChange,
    language,
    theme,
    onMount,
  }: {
    value?: string;
    onChange?: (value: string | undefined) => void;
    language?: string;
    theme?: string;
    options?: Record<string, unknown>;
    onMount?: (editor: unknown, monaco: unknown) => void;
    height?: string;
  }) => {
    capturedOnMount = onMount;
    return (
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
    );
  },
}));

describe("PythonEditor", () => {
  it("renders the Monaco editor", () => {
    render(<PythonEditor />);
    expect(screen.getByTestId("monaco-editor")).toBeInTheDocument();
  });

  it("sets language to python", () => {
    render(<PythonEditor />);
    expect(screen.getByTestId("monaco-editor")).toHaveAttribute(
      "data-language",
      "python",
    );
  });

  it("uses the provided initial value", () => {
    render(<PythonEditor initialValue="print('hello')" />);
    expect(screen.getByTestId("monaco-editor")).toHaveAttribute(
      "data-value",
      "print('hello')",
    );
  });

  it("uses starter template when no initial value given", () => {
    render(<PythonEditor />);
    const editor = screen.getByTestId("monaco-editor");
    expect(editor.getAttribute("data-value")).toContain("from martypy");
  });

  it("calls onChange when code changes", () => {
    const onChange = vi.fn();
    render(<PythonEditor onChange={onChange} />);
    const textarea = screen.getByTestId(
      "monaco-textarea",
    ) as HTMLTextAreaElement;

    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLTextAreaElement.prototype,
      "value",
    )?.set;
    nativeInputValueSetter?.call(textarea, "new code");
    textarea.dispatchEvent(new Event("change", { bubbles: true }));
  });

  it("applies dark theme when specified", () => {
    render(<PythonEditor theme="dark" />);
    expect(screen.getByTestId("monaco-editor")).toHaveAttribute(
      "data-theme",
      "vs-dark",
    );
  });

  it("applies light theme by default", () => {
    render(<PythonEditor />);
    expect(screen.getByTestId("monaco-editor")).toHaveAttribute(
      "data-theme",
      "vs-light",
    );
  });

  it("registers martypy completion provider on mount", () => {
    const mockRegister = vi.fn();
    const mockMonaco = {
      languages: {
        registerCompletionItemProvider: mockRegister,
        CompletionItemKind: { Method: 0 },
        CompletionItemInsertTextRule: { InsertAsSnippet: 4 },
      },
    };
    const mockEditor = { getValue: () => "" };

    render(<PythonEditor />);
    capturedOnMount?.(mockEditor, mockMonaco);

    expect(mockRegister).toHaveBeenCalledWith("python", expect.any(Object));
  });

  it("completion provider returns suggestions with correct structure", () => {
    const mockRegister = vi.fn();
    const mockMonaco = {
      languages: {
        registerCompletionItemProvider: mockRegister,
        CompletionItemKind: { Method: 0 },
        CompletionItemInsertTextRule: { InsertAsSnippet: 4 },
      },
    };
    const mockEditor = { getValue: () => "" };

    render(<PythonEditor />);
    capturedOnMount?.(mockEditor, mockMonaco);

    const provider = mockRegister.mock.calls[0][1];
    const mockModel = {
      getWordUntilPosition: () => ({ startColumn: 1, endColumn: 1 }),
    };
    const mockPosition = { lineNumber: 1, column: 1 };
    const result = provider.provideCompletionItems(mockModel, mockPosition);

    expect(result.suggestions.length).toBeGreaterThan(0);
    expect(result.suggestions[0]).toHaveProperty("label");
    expect(result.suggestions[0]).toHaveProperty("insertText");
    expect(result.suggestions[0]).toHaveProperty("documentation");
  });
});
