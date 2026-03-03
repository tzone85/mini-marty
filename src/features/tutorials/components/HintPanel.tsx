"use client";

import { useState } from "react";

interface HintPanelProps {
  readonly hint: string;
}

export function HintPanel({ hint }: HintPanelProps) {
  const [revealed, setRevealed] = useState(false);

  return (
    <div data-testid="hint-panel" className="mt-3">
      {revealed ? (
        <div className="rounded-md bg-yellow-50 p-3 text-sm text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200">
          <span className="font-medium">Hint: </span>
          <span data-testid="hint-text">{hint}</span>
        </div>
      ) : (
        <button
          data-testid="show-hint-button"
          onClick={() => setRevealed(true)}
          className="text-sm text-blue-600 underline hover:text-blue-700 dark:text-blue-400"
        >
          Need a hint?
        </button>
      )}
    </div>
  );
}
