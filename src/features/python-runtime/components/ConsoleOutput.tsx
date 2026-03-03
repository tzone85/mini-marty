import { useEffect, useRef } from "react";
import type { ConsoleEntry } from "../types";

interface ConsoleOutputProps {
  readonly entries: readonly ConsoleEntry[];
  readonly onClear: () => void;
}

function getEntryClassName(type: ConsoleEntry["type"]): string {
  switch (type) {
    case "stderr":
      return "text-red-400";
    case "info":
      return "text-blue-400";
    case "stdout":
    default:
      return "text-green-300";
  }
}

export function ConsoleOutput({ entries, onClear }: ConsoleOutputProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [entries]);

  return (
    <div className="flex h-full flex-col" data-testid="console-output">
      <div className="flex items-center justify-between border-b border-gray-700 bg-gray-900 px-3 py-1.5">
        <span className="text-xs font-medium text-gray-400">Console</span>
        <button
          onClick={onClear}
          className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
          aria-label="Clear console"
        >
          Clear
        </button>
      </div>
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto bg-gray-950 p-3 font-mono text-sm"
        role="log"
        aria-label="Console output"
      >
        {entries.length === 0 ? (
          <span className="text-gray-600" data-testid="console-empty">
            Python output will appear here...
          </span>
        ) : (
          entries.map((entry) => (
            <div
              key={entry.id}
              className={`whitespace-pre-wrap ${getEntryClassName(entry.type)}`}
              data-testid={`console-entry-${entry.type}`}
            >
              {entry.text}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
