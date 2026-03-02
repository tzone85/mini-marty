"use client";

import { useRef } from "react";
import type { Group } from "three";
import type { MartyModelProps } from "../types";

const COLORS = {
  body: "#f0f0f0",
  accent: "#4a90d9",
  dark: "#333333",
  eye: "#222222",
  eyeWhite: "#ffffff",
  foot: "#666666",
} as const;

function Eyebrow({
  groupRef,
  position,
}: {
  readonly groupRef?: React.RefObject<Group | null>;
  readonly position: [number, number, number];
}) {
  return (
    <group ref={groupRef} position={position} data-testid="eyebrow">
      <mesh>
        <boxGeometry args={[0.12, 0.02, 0.04]} />
        <meshStandardMaterial color={COLORS.dark} />
      </mesh>
    </group>
  );
}

function Eye({
  groupRef,
  position,
}: {
  readonly groupRef?: React.RefObject<Group | null>;
  readonly position: [number, number, number];
}) {
  return (
    <group ref={groupRef} position={position} data-testid="eye">
      <mesh>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial color={COLORS.eyeWhite} />
      </mesh>
      <mesh position={[0, 0, 0.04]}>
        <sphereGeometry args={[0.03, 12, 12]} />
        <meshStandardMaterial color={COLORS.eye} />
      </mesh>
    </group>
  );
}

function Head({
  groupRef,
  leftEyeRef,
  rightEyeRef,
  leftEyebrowRef,
  rightEyebrowRef,
}: {
  readonly groupRef?: React.RefObject<Group | null>;
  readonly leftEyeRef?: React.RefObject<Group | null>;
  readonly rightEyeRef?: React.RefObject<Group | null>;
  readonly leftEyebrowRef?: React.RefObject<Group | null>;
  readonly rightEyebrowRef?: React.RefObject<Group | null>;
}) {
  return (
    <group ref={groupRef} position={[0, 1.0, 0]} data-testid="head">
      <mesh>
        <boxGeometry args={[0.4, 0.35, 0.35]} />
        <meshStandardMaterial color={COLORS.body} />
      </mesh>
      <Eye groupRef={leftEyeRef} position={[-0.1, 0.05, 0.18]} />
      <Eye groupRef={rightEyeRef} position={[0.1, 0.05, 0.18]} />
      <Eyebrow groupRef={leftEyebrowRef} position={[-0.1, 0.15, 0.18]} />
      <Eyebrow groupRef={rightEyebrowRef} position={[0.1, 0.15, 0.18]} />
    </group>
  );
}

function Arm({
  side,
  shoulderRef,
  elbowRef,
}: {
  readonly side: "left" | "right";
  readonly shoulderRef?: React.RefObject<Group | null>;
  readonly elbowRef?: React.RefObject<Group | null>;
}) {
  const xPos = side === "left" ? -0.35 : 0.35;

  return (
    <group
      ref={shoulderRef}
      position={[xPos, 0.65, 0]}
      data-testid={`${side}-shoulder`}
    >
      <mesh position={[0, -0.12, 0]}>
        <boxGeometry args={[0.12, 0.25, 0.12]} />
        <meshStandardMaterial color={COLORS.accent} />
      </mesh>
      <group
        ref={elbowRef}
        position={[0, -0.25, 0]}
        data-testid={`${side}-elbow`}
      >
        <mesh position={[0, -0.12, 0]}>
          <boxGeometry args={[0.1, 0.25, 0.1]} />
          <meshStandardMaterial color={COLORS.body} />
        </mesh>
      </group>
    </group>
  );
}

function Leg({
  side,
  hipRef,
  kneeRef,
  ankleRef,
}: {
  readonly side: "left" | "right";
  readonly hipRef?: React.RefObject<Group | null>;
  readonly kneeRef?: React.RefObject<Group | null>;
  readonly ankleRef?: React.RefObject<Group | null>;
}) {
  const xPos = side === "left" ? -0.15 : 0.15;

  return (
    <group ref={hipRef} position={[xPos, 0.0, 0]} data-testid={`${side}-hip`}>
      <mesh position={[0, -0.15, 0]}>
        <boxGeometry args={[0.14, 0.3, 0.14]} />
        <meshStandardMaterial color={COLORS.accent} />
      </mesh>
      <group ref={kneeRef} position={[0, -0.3, 0]} data-testid={`${side}-knee`}>
        <mesh position={[0, -0.12, 0]}>
          <boxGeometry args={[0.12, 0.25, 0.12]} />
          <meshStandardMaterial color={COLORS.body} />
        </mesh>
        <group
          ref={ankleRef}
          position={[0, -0.25, 0]}
          data-testid={`${side}-ankle`}
        >
          <mesh position={[0, -0.04, 0.03]}>
            <boxGeometry args={[0.16, 0.08, 0.22]} />
            <meshStandardMaterial color={COLORS.foot} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

export function MartyModel({ jointRefs }: MartyModelProps) {
  const fallbackRef = useRef<Group>(null);

  return (
    <group data-testid="marty-model" position={[0, 0.8, 0]}>
      {/* Torso */}
      <mesh position={[0, 0.45, 0]} data-testid="torso">
        <boxGeometry args={[0.5, 0.5, 0.3]} />
        <meshStandardMaterial color={COLORS.body} />
      </mesh>

      {/* Head */}
      <Head
        groupRef={jointRefs?.head ?? fallbackRef}
        leftEyeRef={jointRefs?.leftEye}
        rightEyeRef={jointRefs?.rightEye}
        leftEyebrowRef={jointRefs?.leftEyebrow}
        rightEyebrowRef={jointRefs?.rightEyebrow}
      />

      {/* Arms */}
      <Arm
        side="left"
        shoulderRef={jointRefs?.leftShoulder}
        elbowRef={jointRefs?.leftElbow}
      />
      <Arm
        side="right"
        shoulderRef={jointRefs?.rightShoulder}
        elbowRef={jointRefs?.rightElbow}
      />

      {/* Legs */}
      <Leg
        side="left"
        hipRef={jointRefs?.leftHip}
        kneeRef={jointRefs?.leftKnee}
        ankleRef={jointRefs?.leftAnkle}
      />
      <Leg
        side="right"
        hipRef={jointRefs?.rightHip}
        kneeRef={jointRefs?.rightKnee}
        ankleRef={jointRefs?.rightAnkle}
      />
    </group>
  );
}
