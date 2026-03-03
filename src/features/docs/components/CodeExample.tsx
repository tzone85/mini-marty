"use client";

import type { CodeExample as CodeExampleType } from "../types";

interface CodeExampleProps {
  readonly example: CodeExampleType;
}

export function CodeExample({ example }: CodeExampleProps) {
  return (
    <div className="mt-3 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between rounded-t-lg bg-gray-100 px-3 py-1.5 dark:bg-gray-800">
        <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
          {example.title}
        </span>
        <span className="rounded bg-gray-200 px-1.5 py-0.5 text-xs text-gray-500 dark:bg-gray-700 dark:text-gray-400">
          {example.language}
        </span>
      </div>
      <pre
        className="overflow-x-auto bg-gray-950 p-3 text-sm text-gray-100"
        data-testid="code-block"
      >
        <code>{example.code}</code>
      </pre>
      {example.description && (
        <p className="border-t border-gray-200 px-3 py-2 text-xs text-gray-500 dark:border-gray-700 dark:text-gray-400">
          {example.description}
        </p>
      )}
    </div>
  );
}
