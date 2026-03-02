"use client";

import Editor from "@monaco-editor/react";
import { useTheme } from "@/lib/theme-context";

interface PythonEditorProps {
  readonly value: string;
  readonly onChange: (value: string) => void;
}

export function PythonEditor({ value, onChange }: PythonEditorProps) {
  const { theme } = useTheme();
  const monacoTheme = theme === "dark" ? "vs-dark" : "vs";

  return (
    <Editor
      height="100%"
      language="python"
      theme={monacoTheme}
      value={value}
      onChange={(v) => onChange(v ?? "")}
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
