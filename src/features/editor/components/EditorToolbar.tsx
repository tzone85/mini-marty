interface EditorToolbarProps {
  readonly onRun: () => void;
  readonly onStop: () => void;
  readonly onClear: () => void;
  readonly onSave: () => void;
  readonly onLoad: () => void;
  readonly isRunning: boolean;
}

export function EditorToolbar({
  onRun,
  onStop,
  onClear,
  onSave,
  onLoad,
  isRunning,
}: EditorToolbarProps) {
  return (
    <div
      role="toolbar"
      aria-label="Editor controls"
      className="flex items-center gap-2 border-b border-gray-200 bg-gray-50 px-4 py-2 dark:border-gray-700 dark:bg-gray-800"
    >
      <button
        onClick={onRun}
        disabled={isRunning}
        className="rounded-md bg-green-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Run
      </button>
      <button
        onClick={onStop}
        disabled={!isRunning}
        className="rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Stop
      </button>
      <div className="mx-1 h-5 w-px bg-gray-300 dark:bg-gray-600" />
      <button
        onClick={onClear}
        className="rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
      >
        Clear
      </button>
      <button
        onClick={onSave}
        className="rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
      >
        Save
      </button>
      <button
        onClick={onLoad}
        className="rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
      >
        Load
      </button>
    </div>
  );
}
