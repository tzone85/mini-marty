"use client";

interface EditorToolbarProps {
  readonly onRun?: () => void;
  readonly onStop?: () => void;
  readonly onClear?: () => void;
  readonly onSave?: () => void;
  readonly onLoad?: () => void;
  readonly isRunning?: boolean;
}

interface ToolbarButtonProps {
  readonly label: string;
  readonly onClick?: () => void;
  readonly disabled?: boolean;
  readonly variant?: "primary" | "danger" | "default";
}

function ToolbarButton({
  label,
  onClick,
  disabled = false,
  variant = "default",
}: ToolbarButtonProps) {
  const variantClasses: Record<string, string> = {
    primary: "bg-green-600 text-white hover:bg-green-700 disabled:bg-green-300",
    danger: "bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300",
    default:
      "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`rounded px-3 py-1.5 text-sm font-medium transition-colors disabled:cursor-not-allowed ${variantClasses[variant]}`}
    >
      {label}
    </button>
  );
}

export function EditorToolbar({
  onRun,
  onStop,
  onClear,
  onSave,
  onLoad,
  isRunning = false,
}: EditorToolbarProps) {
  return (
    <div
      className="flex items-center gap-2 border-b border-gray-200 bg-gray-100 px-4 py-2 dark:border-gray-700 dark:bg-gray-800"
      role="toolbar"
      aria-label="Editor controls"
    >
      <ToolbarButton label="Run" onClick={onRun} variant="primary" />
      <ToolbarButton
        label="Stop"
        onClick={onStop}
        disabled={!isRunning}
        variant="danger"
      />
      <div className="mx-2 h-4 w-px bg-gray-300 dark:bg-gray-600" />
      <ToolbarButton label="Clear" onClick={onClear} />
      <ToolbarButton label="Save" onClick={onSave} />
      <ToolbarButton label="Load" onClick={onLoad} />
    </div>
  );
}
