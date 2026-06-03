import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { HintPanel } from "./HintPanel";

describe("HintPanel", () => {
  it("shows hint button initially", () => {
    render(<HintPanel hint="Try the Motion category" />);
    expect(screen.getByTestId("show-hint-button")).toBeInTheDocument();
    expect(screen.queryByTestId("hint-text")).not.toBeInTheDocument();
  });

  it("reveals hint when button is clicked", () => {
    render(<HintPanel hint="Try the Motion category" />);
    fireEvent.click(screen.getByTestId("show-hint-button"));
    expect(screen.getByTestId("hint-text")).toHaveTextContent(
      "Try the Motion category",
    );
  });

  it("hides button after revealing hint", () => {
    render(<HintPanel hint="Test hint" />);
    fireEvent.click(screen.getByTestId("show-hint-button"));
    expect(screen.queryByTestId("show-hint-button")).not.toBeInTheDocument();
  });
});
