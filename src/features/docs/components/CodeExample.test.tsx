import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { CodeExample } from "./CodeExample";
import type { CodeExample as CodeExampleType } from "../types";

describe("CodeExample", () => {
  const pythonExample: CodeExampleType = {
    title: "Walk forward",
    language: "python",
    code: "my_marty.walk(2)",
    description: "Makes Marty walk 2 steps.",
  };

  const blocksExample: CodeExampleType = {
    title: "Walk block",
    language: "blocks",
    code: "walk 2 steps",
  };

  it("renders the example title", () => {
    render(<CodeExample example={pythonExample} />);
    expect(screen.getByText("Walk forward")).toBeInTheDocument();
  });

  it("renders the language badge", () => {
    render(<CodeExample example={pythonExample} />);
    expect(screen.getByText("python")).toBeInTheDocument();
  });

  it("renders the code content", () => {
    render(<CodeExample example={pythonExample} />);
    expect(screen.getByText("my_marty.walk(2)")).toBeInTheDocument();
  });

  it("renders the description when provided", () => {
    render(<CodeExample example={pythonExample} />);
    expect(screen.getByText("Makes Marty walk 2 steps.")).toBeInTheDocument();
  });

  it("does not render description when not provided", () => {
    render(<CodeExample example={blocksExample} />);
    expect(
      screen.queryByText("Makes Marty walk 2 steps."),
    ).not.toBeInTheDocument();
  });

  it("renders blocks language badge", () => {
    render(<CodeExample example={blocksExample} />);
    expect(screen.getByText("blocks")).toBeInTheDocument();
  });

  it("renders the code block element", () => {
    render(<CodeExample example={pythonExample} />);
    expect(screen.getByTestId("code-block")).toBeInTheDocument();
  });
});
