import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import { MartyModel } from "./MartyModel";

// Mock R3F primitives as simple div elements for testing
vi.mock("@react-three/fiber", () => ({
  Canvas: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="canvas">{children}</div>
  ),
}));

// R3F JSX elements (mesh, group, boxGeometry, etc.) are not standard React
// components but Three.js object constructors. In test, we render them as divs.
// The MartyModel uses native R3F elements which render fine in jsdom since
// React treats unknown lowercase JSX as HTML elements.

describe("MartyModel", () => {
  it("renders the model group", () => {
    const { container } = render(<MartyModel />);
    const modelGroup = container.querySelector('[data-testid="marty-model"]');
    expect(modelGroup).toBeTruthy();
  });

  it("renders the torso", () => {
    const { container } = render(<MartyModel />);
    const torso = container.querySelector('[data-testid="torso"]');
    expect(torso).toBeTruthy();
  });

  it("renders the head", () => {
    const { container } = render(<MartyModel />);
    const head = container.querySelector('[data-testid="head"]');
    expect(head).toBeTruthy();
  });

  it("renders two eyes", () => {
    const { container } = render(<MartyModel />);
    const eyes = container.querySelectorAll('[data-testid="eye"]');
    expect(eyes).toHaveLength(2);
  });

  it("renders two eyebrows", () => {
    const { container } = render(<MartyModel />);
    const eyebrows = container.querySelectorAll('[data-testid="eyebrow"]');
    expect(eyebrows).toHaveLength(2);
  });

  it("renders left shoulder joint", () => {
    const { container } = render(<MartyModel />);
    const joint = container.querySelector('[data-testid="left-shoulder"]');
    expect(joint).toBeTruthy();
  });

  it("renders right shoulder joint", () => {
    const { container } = render(<MartyModel />);
    const joint = container.querySelector('[data-testid="right-shoulder"]');
    expect(joint).toBeTruthy();
  });

  it("renders left elbow joint", () => {
    const { container } = render(<MartyModel />);
    const joint = container.querySelector('[data-testid="left-elbow"]');
    expect(joint).toBeTruthy();
  });

  it("renders right elbow joint", () => {
    const { container } = render(<MartyModel />);
    const joint = container.querySelector('[data-testid="right-elbow"]');
    expect(joint).toBeTruthy();
  });

  it("renders left hip joint", () => {
    const { container } = render(<MartyModel />);
    const joint = container.querySelector('[data-testid="left-hip"]');
    expect(joint).toBeTruthy();
  });

  it("renders right hip joint", () => {
    const { container } = render(<MartyModel />);
    const joint = container.querySelector('[data-testid="right-hip"]');
    expect(joint).toBeTruthy();
  });

  it("renders left knee joint", () => {
    const { container } = render(<MartyModel />);
    const joint = container.querySelector('[data-testid="left-knee"]');
    expect(joint).toBeTruthy();
  });

  it("renders right knee joint", () => {
    const { container } = render(<MartyModel />);
    const joint = container.querySelector('[data-testid="right-knee"]');
    expect(joint).toBeTruthy();
  });

  it("renders left ankle joint", () => {
    const { container } = render(<MartyModel />);
    const joint = container.querySelector('[data-testid="left-ankle"]');
    expect(joint).toBeTruthy();
  });

  it("renders right ankle joint", () => {
    const { container } = render(<MartyModel />);
    const joint = container.querySelector('[data-testid="right-ankle"]');
    expect(joint).toBeTruthy();
  });

  it("renders without jointRefs", () => {
    const { container } = render(<MartyModel />);
    expect(container.querySelector('[data-testid="marty-model"]')).toBeTruthy();
  });

  it("renders with partial jointRefs", () => {
    const { container } = render(
      <MartyModel jointRefs={{ head: { current: null } }} />,
    );
    expect(container.querySelector('[data-testid="head"]')).toBeTruthy();
  });

  it("has correct joint hierarchy: elbow inside shoulder", () => {
    const { container } = render(<MartyModel />);
    const leftShoulder = container.querySelector(
      '[data-testid="left-shoulder"]',
    );
    const leftElbow = leftShoulder?.querySelector('[data-testid="left-elbow"]');
    expect(leftElbow).toBeTruthy();
  });

  it("has correct joint hierarchy: knee inside hip", () => {
    const { container } = render(<MartyModel />);
    const leftHip = container.querySelector('[data-testid="left-hip"]');
    const leftKnee = leftHip?.querySelector('[data-testid="left-knee"]');
    expect(leftKnee).toBeTruthy();
  });

  it("has correct joint hierarchy: ankle inside knee", () => {
    const { container } = render(<MartyModel />);
    const leftKnee = container.querySelector('[data-testid="left-knee"]');
    const leftAnkle = leftKnee?.querySelector('[data-testid="left-ankle"]');
    expect(leftAnkle).toBeTruthy();
  });

  it("has correct joint hierarchy: eyes inside head", () => {
    const { container } = render(<MartyModel />);
    const head = container.querySelector('[data-testid="head"]');
    const eyes = head?.querySelectorAll('[data-testid="eye"]');
    expect(eyes).toHaveLength(2);
  });

  it("has correct joint hierarchy: eyebrows inside head", () => {
    const { container } = render(<MartyModel />);
    const head = container.querySelector('[data-testid="head"]');
    const eyebrows = head?.querySelectorAll('[data-testid="eyebrow"]');
    expect(eyebrows).toHaveLength(2);
  });
});
