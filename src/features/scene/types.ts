import type { Group } from "three";

export interface JointRefs {
  readonly head: React.RefObject<Group | null>;
  readonly leftShoulder: React.RefObject<Group | null>;
  readonly leftElbow: React.RefObject<Group | null>;
  readonly rightShoulder: React.RefObject<Group | null>;
  readonly rightElbow: React.RefObject<Group | null>;
  readonly leftHip: React.RefObject<Group | null>;
  readonly leftKnee: React.RefObject<Group | null>;
  readonly leftAnkle: React.RefObject<Group | null>;
  readonly rightHip: React.RefObject<Group | null>;
  readonly rightKnee: React.RefObject<Group | null>;
  readonly rightAnkle: React.RefObject<Group | null>;
  readonly leftEye: React.RefObject<Group | null>;
  readonly rightEye: React.RefObject<Group | null>;
  readonly leftEyebrow: React.RefObject<Group | null>;
  readonly rightEyebrow: React.RefObject<Group | null>;
}

export type JointName = keyof JointRefs;

export const JOINT_NAMES: readonly JointName[] = [
  "head",
  "leftShoulder",
  "leftElbow",
  "rightShoulder",
  "rightElbow",
  "leftHip",
  "leftKnee",
  "leftAnkle",
  "rightHip",
  "rightKnee",
  "rightAnkle",
  "leftEye",
  "rightEye",
  "leftEyebrow",
  "rightEyebrow",
] as const;

export interface MartyModelProps {
  readonly jointRefs?: Partial<JointRefs>;
}

export interface MartySceneProps {
  readonly jointRefs?: Partial<JointRefs>;
  readonly className?: string;
}
