"use client";

import type { ExecutionStatus, ExecutionSpeed } from "../execution/types";

interface ExecutionControlsProps {
  readonly status: ExecutionStatus;
  readonly speed: ExecutionSpeed;
  readonly onRun: () => void;
  readonly onStop: () => void;
  readonly onPause: () => void;
  readonly onResume: () => void;
  readonly onStep: () => void;
  readonly onSpeedChange: (speed: ExecutionSpeed) => void;
}

const SPEED_OPTIONS: readonly {
  readonly value: ExecutionSpeed;
  readonly label: string;
}[] = [
  { value: "slow", label: "Slow" },
  { value: "normal", label: "Normal" },
  { value: "fast", label: "Fast" },
];

export function ExecutionControls({
  status,
  speed,
  onRun,
  onStop,
  onPause,
  onResume,
  onStep,
  onSpeedChange,
}: ExecutionControlsProps) {
  const isRunning = status === "running";
  const isPaused = status === "paused";
  const isStepping = status === "stepping";
  const isActive = isRunning || isPaused || isStepping;

  return (
    <div className="flex items-center gap-2" data-testid="execution-controls">
      {!isActive ? (
        <button
          onClick={onRun}
          className="rounded bg-green-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-700"
          data-testid="run-button"
        >
          Run
        </button>
      ) : null}

      {isRunning ? (
        <button
          onClick={onPause}
          className="rounded bg-yellow-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-yellow-700"
          data-testid="pause-button"
        >
          Pause
        </button>
      ) : null}

      {isPaused ? (
        <button
          onClick={onResume}
          className="rounded bg-green-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-700"
          data-testid="resume-button"
        >
          Resume
        </button>
      ) : null}

      {isActive ? (
        <button
          onClick={onStop}
          className="rounded bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700"
          data-testid="stop-button"
        >
          Stop
        </button>
      ) : null}

      <button
        onClick={onStep}
        disabled={isRunning}
        className="rounded bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        data-testid="step-button"
      >
        Step
      </button>

      <div className="ml-2 flex items-center gap-1">
        <label className="text-xs text-gray-500 dark:text-gray-400">
          Speed:
        </label>
        <select
          value={speed}
          onChange={(e) => onSpeedChange(e.target.value as ExecutionSpeed)}
          className="rounded border border-gray-300 bg-white px-2 py-1 text-xs dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
          data-testid="speed-select"
        >
          {SPEED_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <span
        className="ml-2 text-xs text-gray-500 dark:text-gray-400"
        data-testid="status-indicator"
      >
        {formatStatus(status)}
      </span>
    </div>
  );
}

function formatStatus(status: ExecutionStatus): string {
  switch (status) {
    case "idle":
      return "Ready";
    case "running":
      return "Running...";
    case "paused":
      return "Paused";
    case "stepping":
      return "Step mode";
    case "error":
      return "Error";
    case "completed":
      return "Done";
  }
}
