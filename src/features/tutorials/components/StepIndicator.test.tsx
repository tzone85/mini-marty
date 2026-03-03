import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StepIndicator } from "./StepIndicator";

describe("StepIndicator", () => {
  it("renders correct number of dots", () => {
    render(
      <StepIndicator
        totalSteps={4}
        currentStep={0}
        completedSteps={[]}
        stepIds={["s1", "s2", "s3", "s4"]}
      />,
    );
    expect(screen.getByTestId("step-indicator")).toBeInTheDocument();
    expect(screen.getByTestId("step-dot-0")).toBeInTheDocument();
    expect(screen.getByTestId("step-dot-3")).toBeInTheDocument();
  });

  it("highlights current step with blue", () => {
    render(
      <StepIndicator
        totalSteps={3}
        currentStep={1}
        completedSteps={["s1"]}
        stepIds={["s1", "s2", "s3"]}
      />,
    );
    expect(screen.getByTestId("step-dot-1").className).toContain("bg-blue");
  });

  it("shows completed steps in green", () => {
    render(
      <StepIndicator
        totalSteps={3}
        currentStep={2}
        completedSteps={["s1", "s2"]}
        stepIds={["s1", "s2", "s3"]}
      />,
    );
    expect(screen.getByTestId("step-dot-0").className).toContain("bg-green");
    expect(screen.getByTestId("step-dot-1").className).toContain("bg-green");
  });

  it("shows pending steps in gray", () => {
    render(
      <StepIndicator
        totalSteps={3}
        currentStep={0}
        completedSteps={[]}
        stepIds={["s1", "s2", "s3"]}
      />,
    );
    expect(screen.getByTestId("step-dot-2").className).toContain("bg-gray");
  });
});
