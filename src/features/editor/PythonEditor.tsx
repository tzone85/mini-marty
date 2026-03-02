"use client";

import { useCallback, useRef } from "react";
import type { Monaco } from "@monaco-editor/react";
import Editor, { type OnMount } from "@monaco-editor/react";
import { MARTYPY_COMPLETIONS, STARTER_TEMPLATE } from "./martypy-completions";

type ITextModel = Parameters<
  Parameters<
    Monaco["languages"]["registerCompletionItemProvider"]
  >[1]["provideCompletionItems"]
>[0];
type Position = Parameters<
  Parameters<
    Monaco["languages"]["registerCompletionItemProvider"]
  >[1]["provideCompletionItems"]
>[1];

interface PythonEditorProps {
  readonly initialValue?: string;
  readonly onChange?: (value: string) => void;
  readonly theme?: "light" | "dark";
}

export function PythonEditor({
  initialValue,
  onChange,
  theme = "light",
}: PythonEditorProps) {
  const editorRef = useRef<Parameters<OnMount>[0] | null>(null);

  const handleMount: OnMount = useCallback((editor, monaco) => {
    editorRef.current = editor;

    monaco.languages.registerCompletionItemProvider("python", {
      provideCompletionItems: (model: ITextModel, position: Position) => {
        const word = model.getWordUntilPosition(position);
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn,
        };

        return {
          suggestions: MARTYPY_COMPLETIONS.map((completion) => ({
            label: completion.label,
            kind: monaco.languages.CompletionItemKind.Method,
            insertText: completion.insertText,
            insertTextRules:
              monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: completion.documentation,
            range,
          })),
        };
      },
    });
  }, []);

  const handleChange = useCallback(
    (value: string | undefined) => {
      if (onChange && value !== undefined) {
        onChange(value);
      }
    },
    [onChange],
  );

  return (
    <Editor
      height="100%"
      language="python"
      theme={theme === "dark" ? "vs-dark" : "vs-light"}
      value={initialValue ?? STARTER_TEMPLATE}
      onChange={handleChange}
      onMount={handleMount}
      options={{
        minimap: { enabled: false },
        fontSize: 14,
        lineNumbers: "on",
        scrollBeyondLastLine: false,
        automaticLayout: true,
        tabSize: 4,
        wordWrap: "on",
      }}
    />
  );
}
