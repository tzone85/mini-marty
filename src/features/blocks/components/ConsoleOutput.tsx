"use client";

import { useEffect, useRef } from "react";
import type { ConsoleEntry } from "../execution/types";

interface ConsoleOutputProps {
  readonly entries: readonly ConsoleEntry[];
}

const TYPE_STYLES: Record<ConsoleEntry["type"], string> = {
  command: "text-blue-400",
  output: "text-gray-300",
  error: "text-red-400",
  info: "text-green-400",
};

const TYPE_PREFIX: Record<ConsoleEntry["type"], string> = {
  command: ">>",
  output: "  ",
  error: "!!",
  info: "--",
};

export function ConsoleOutput({ entries }: ConsoleOutputProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [entries]);

  return (
    <div
      ref={scrollRef}
      className="flex h-full flex-col overflow-y-auto rounded-md bg-gray-900 p-3 font-mono text-xs"
      data-testid="console-output"
    >
      {entries.length === 0 ? (
        <span className="text-gray-500">
          Console output will appear here...
        </span>
      ) : (
        entries.map((entry) => (
          <div key={entry.id} className="flex gap-2">
            <span className="shrink-0 text-gray-600">
              {formatTime(entry.timestamp)}
            </span>
            <span className={`shrink-0 ${TYPE_STYLES[entry.type]}`}>
              {TYPE_PREFIX[entry.type]}
            </span>
            <span className={TYPE_STYLES[entry.type]}>{entry.message}</span>
          </div>
        ))
      )}
    </div>
  );
}

function formatTime(timestamp: number): string {
  const date = new Date(timestamp);
  const h = date.getHours().toString().padStart(2, "0");
  const m = date.getMinutes().toString().padStart(2, "0");
  const s = date.getSeconds().toString().padStart(2, "0");
  return `${h}:${m}:${s}`;
}
