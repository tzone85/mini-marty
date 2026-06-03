interface StepIndicatorProps {
  readonly totalSteps: number;
  readonly currentStep: number;
  readonly completedSteps: readonly string[];
  readonly stepIds: readonly string[];
}

export function StepIndicator({
  totalSteps,
  currentStep,
  completedSteps,
  stepIds,
}: StepIndicatorProps) {
  return (
    <div data-testid="step-indicator" className="flex items-center gap-1">
      {Array.from({ length: totalSteps }, (_, i) => {
        const isCompleted = completedSteps.includes(stepIds[i]);
        const isCurrent = i === currentStep;

        return (
          <div
            key={stepIds[i]}
            data-testid={`step-dot-${i}`}
            className={`h-2.5 w-2.5 rounded-full ${
              isCompleted
                ? "bg-green-500"
                : isCurrent
                  ? "bg-blue-500"
                  : "bg-gray-300 dark:bg-gray-600"
            }`}
          />
        );
      })}
    </div>
  );
}
