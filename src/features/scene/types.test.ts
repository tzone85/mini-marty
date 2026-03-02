import { describe, it, expect } from "vitest";
import { JOINT_NAMES } from "./types";
import type { JointName, JointRefs, MartyModelProps, MartySceneProps } from "./types";

describe("Scene types", () => {
  it("JOINT_NAMES contains all 15 joints", () => {
    expect(JOINT_NAMES).toHaveLength(15);
  });

  it("JOINT_NAMES includes head", () => {
    expect(JOINT_NAMES).toContain("head");
  });

  it("JOINT_NAMES includes left and right shoulders", () => {
    expect(JOINT_NAMES).toContain("leftShoulder");
    expect(JOINT_NAMES).toContain("rightShoulder");
  });

  it("JOINT_NAMES includes left and right elbows", () => {
    expect(JOINT_NAMES).toContain("leftElbow");
    expect(JOINT_NAMES).toContain("rightElbow");
  });

  it("JOINT_NAMES includes left and right hips", () => {
    expect(JOINT_NAMES).toContain("leftHip");
    expect(JOINT_NAMES).toContain("rightHip");
  });

  it("JOINT_NAMES includes left and right knees", () => {
    expect(JOINT_NAMES).toContain("leftKnee");
    expect(JOINT_NAMES).toContain("rightKnee");
  });

  it("JOINT_NAMES includes left and right ankles", () => {
    expect(JOINT_NAMES).toContain("leftAnkle");
    expect(JOINT_NAMES).toContain("rightAnkle");
  });

  it("JOINT_NAMES includes eyes and eyebrows", () => {
    expect(JOINT_NAMES).toContain("leftEye");
    expect(JOINT_NAMES).toContain("rightEye");
    expect(JOINT_NAMES).toContain("leftEyebrow");
    expect(JOINT_NAMES).toContain("rightEyebrow");
  });

  it("JointName type matches JOINT_NAMES values", () => {
    const name: JointName = "head";
    expect(JOINT_NAMES).toContain(name);
  });

  it("JointRefs interface is usable", () => {
    const refs: Partial<JointRefs> = {};
    expect(refs).toBeDefined();
  });

  it("MartyModelProps accepts jointRefs", () => {
    const props: MartyModelProps = { jointRefs: {} };
    expect(props.jointRefs).toBeDefined();
  });

  it("MartySceneProps accepts className and jointRefs", () => {
    const props: MartySceneProps = { className: "test", jointRefs: {} };
    expect(props.className).toBe("test");
  });
});
