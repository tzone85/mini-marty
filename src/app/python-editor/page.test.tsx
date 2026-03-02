import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import PythonEditorPage from "./page";

describe("PythonEditorPage", () => {
  it("renders heading", () => {
    render(<PythonEditorPage />);
    expect(
      screen.getByRole("heading", { name: /python editor/i }),
    ).toBeInTheDocument();
  });

  it("renders description", () => {
    render(<PythonEditorPage />);
    expect(screen.getByText(/write python code/i)).toBeInTheDocument();
  });
});
