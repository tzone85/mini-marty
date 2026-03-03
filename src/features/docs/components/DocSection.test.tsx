import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { DocSection } from "./DocSection";
import type { DocSection as DocSectionType } from "../types";

const testSection: DocSectionType = {
  id: "test",
  title: "Test Section Title",
  description: "Test section description text.",
  subsections: [
    {
      id: "sub-a",
      title: "Subsection A",
      entries: [
        {
          title: "Entry One",
          description: "Entry one description",
          content: ["Paragraph one content.", "Paragraph two content."],
          parameters: [
            {
              name: "param1",
              type: "string",
              description: "First parameter",
              defaultValue: '"hello"',
            },
          ],
          returns: "boolean",
          examples: [
            {
              title: "Example code",
              language: "python",
              code: "print('hello')",
              description: "Prints hello",
            },
          ],
        },
      ],
    },
    {
      id: "sub-b",
      title: "Subsection B",
      entries: [
        {
          title: "Entry Two",
          description: "Entry two description",
          content: ["Simple content."],
        },
      ],
    },
  ],
};

describe("DocSection", () => {
  it("renders the section title", () => {
    render(<DocSection section={testSection} />);
    expect(
      screen.getByRole("heading", { name: /test section title/i }),
    ).toBeInTheDocument();
  });

  it("renders the section description", () => {
    render(<DocSection section={testSection} />);
    expect(
      screen.getByText("Test section description text."),
    ).toBeInTheDocument();
  });

  it("renders subsection titles", () => {
    render(<DocSection section={testSection} />);
    expect(
      screen.getByRole("heading", { name: /subsection a/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /subsection b/i }),
    ).toBeInTheDocument();
  });

  it("renders entry titles and descriptions", () => {
    render(<DocSection section={testSection} />);
    expect(screen.getByText("Entry One")).toBeInTheDocument();
    expect(screen.getByText("Entry one description")).toBeInTheDocument();
    expect(screen.getByText("Entry Two")).toBeInTheDocument();
  });

  it("renders entry content paragraphs", () => {
    render(<DocSection section={testSection} />);
    expect(screen.getByText("Paragraph one content.")).toBeInTheDocument();
    expect(screen.getByText("Paragraph two content.")).toBeInTheDocument();
  });

  it("renders parameters when present", () => {
    render(<DocSection section={testSection} />);
    expect(screen.getByText("Parameters")).toBeInTheDocument();
    expect(screen.getByText("param1")).toBeInTheDocument();
    expect(screen.getByText("First parameter")).toBeInTheDocument();
    expect(screen.getByText('Default: "hello"')).toBeInTheDocument();
  });

  it("renders return type when present", () => {
    render(<DocSection section={testSection} />);
    expect(screen.getByText("boolean")).toBeInTheDocument();
  });

  it("renders code examples when present", () => {
    render(<DocSection section={testSection} />);
    expect(screen.getByText("Example code")).toBeInTheDocument();
    expect(screen.getByText("print('hello')")).toBeInTheDocument();
  });

  it("has correct data-testid", () => {
    render(<DocSection section={testSection} />);
    expect(screen.getByTestId("doc-section-test")).toBeInTheDocument();
  });

  it("renders subsection ids for scroll anchors", () => {
    render(<DocSection section={testSection} />);
    expect(document.getElementById("sub-a")).toBeInTheDocument();
    expect(document.getElementById("sub-b")).toBeInTheDocument();
  });
});
