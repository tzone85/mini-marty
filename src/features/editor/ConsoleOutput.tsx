export interface ConsoleEntry {
  readonly type: "stdout" | "error" | "info";
  readonly text: string;
}

interface ConsoleOutputProps {
  readonly entries: readonly ConsoleEntry[];
}

const ENTRY_STYLES: Record<ConsoleEntry["type"], string> = {
  stdout: "text-gray-200",
  error: "text-red-400",
  info: "text-blue-400",
};

export function ConsoleOutput({ entries }: ConsoleOutputProps) {
  return (
    <div className="flex flex-col overflow-hidden rounded-b-lg border border-gray-700 bg-gray-900">
      <div className="border-b border-gray-700 px-3 py-1.5 text-xs font-semibold text-gray-400">
        Console
      </div>
      <div className="h-40 overflow-y-auto p-3 font-mono text-sm">
        {entries.length === 0 ? (
          <p className="text-gray-500">Run your code to see output here</p>
        ) : (
          <ul className="space-y-0.5">
            {entries.map((entry, index) => (
              <li key={index} className={ENTRY_STYLES[entry.type]}>
                {entry.text}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
