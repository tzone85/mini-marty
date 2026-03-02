import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import PythonEditorPage from "./page";

describe("Python Editor page", () => {
  it("renders the heading", () => {
    render(<PythonEditorPage />);
    expect(
      screen.getByRole("heading", { name: /python editor/i }),
    ).toBeInTheDocument();
  });

  it("renders a description", () => {
    render(<PythonEditorPage />);
    expect(screen.getByText(/write python code/i)).toBeInTheDocument();
  });
});
