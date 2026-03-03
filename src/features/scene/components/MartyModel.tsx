"use client";

import { useRef, forwardRef, useImperativeHandle } from "react";
import type { Group } from "three";
import type { MartyPose } from "../types";
import { DEFAULT_POSE } from "../types";

// --- Dimension constants ---
const BODY_WIDTH = 0.6;
const BODY_HEIGHT = 0.5;
const BODY_DEPTH = 0.4;

const HEAD_SIZE = 0.45;
const EYE_RADIUS = 0.08;
const PUPIL_RADIUS = 0.04;

const LEG_UPPER_HEIGHT = 0.4;
const LEG_LOWER_HEIGHT = 0.35;
const LEG_WIDTH = 0.12;
const FOOT_LENGTH = 0.25;
const FOOT_HEIGHT = 0.08;
const LEG_SPACING = 0.18;

const ARM_LENGTH = 0.45;
const ARM_WIDTH = 0.08;
const ARM_SPACING = BODY_WIDTH / 2 + ARM_WIDTH / 2;

// --- Colors ---
const BODY_COLOR = "#f5f5f5";
const ACCENT_COLOR = "#4a90d9";
const EYE_WHITE = "#ffffff";
const PUPIL_COLOR = "#333333";
const FOOT_COLOR = "#666666";

export interface MartyModelHandle {
  readonly applyPose: (pose: MartyPose) => void;
  readonly getRootRef: () => Group | null;
}

interface MartyModelProps {
  readonly initialPose?: MartyPose;
}

function LegGeometry({ side }: { readonly side: "left" | "right" }) {
  const isLeft = side === "left";
  return (
    <>
      {/* Upper leg */}
      <mesh position={[0, -LEG_UPPER_HEIGHT / 2, 0]}>
        <cylinderGeometry args={[LEG_WIDTH, LEG_WIDTH, LEG_UPPER_HEIGHT, 8]} />
        <meshStandardMaterial color={BODY_COLOR} />
      </mesh>

      {/* Lower leg offset — knee pivot sits at bottom of upper leg */}
      {/* Note: knee and foot groups are managed by parent via refs */}
      <mesh
        position={[0, -LEG_UPPER_HEIGHT - LEG_LOWER_HEIGHT / 2, 0]}
        name={`${isLeft ? "left" : "right"}-lower-leg`}
      >
        <cylinderGeometry
          args={[LEG_WIDTH * 0.9, LEG_WIDTH * 0.8, LEG_LOWER_HEIGHT, 8]}
        />
        <meshStandardMaterial color={ACCENT_COLOR} />
      </mesh>
    </>
  );
}

function FootGeometry() {
  return (
    <mesh position={[0, -FOOT_HEIGHT / 2, FOOT_LENGTH * 0.15]}>
      <boxGeometry args={[LEG_WIDTH * 1.5, FOOT_HEIGHT, FOOT_LENGTH]} />
      <meshStandardMaterial color={FOOT_COLOR} />
    </mesh>
  );
}

function ArmGeometry() {
  return (
    <>
      <mesh position={[0, -ARM_LENGTH / 2, 0]}>
        <cylinderGeometry args={[ARM_WIDTH, ARM_WIDTH * 0.7, ARM_LENGTH, 8]} />
        <meshStandardMaterial color={ACCENT_COLOR} />
      </mesh>
      {/* Hand */}
      <mesh position={[0, -ARM_LENGTH, 0]}>
        <sphereGeometry args={[ARM_WIDTH * 1.1, 8, 8]} />
        <meshStandardMaterial color={BODY_COLOR} />
      </mesh>
    </>
  );
}

function EyeGeometry() {
  return (
    <>
      <mesh>
        <circleGeometry args={[EYE_RADIUS, 16]} />
        <meshStandardMaterial color={EYE_WHITE} />
      </mesh>
      <mesh position={[0, 0, 0.01]}>
        <circleGeometry args={[PUPIL_RADIUS, 16]} />
        <meshStandardMaterial color={PUPIL_COLOR} />
      </mesh>
    </>
  );
}

export const MartyModel = forwardRef<MartyModelHandle, MartyModelProps>(
  function MartyModel({ initialPose = DEFAULT_POSE }, ref) {
    const rootRef = useRef<Group>(null);

    const leftHipRef = useRef<Group>(null);
    const leftKneeRef = useRef<Group>(null);
    const leftFootRef = useRef<Group>(null);
    const rightHipRef = useRef<Group>(null);
    const rightKneeRef = useRef<Group>(null);
    const rightFootRef = useRef<Group>(null);
    const leftArmRef = useRef<Group>(null);
    const rightArmRef = useRef<Group>(null);
    const leftEyeRef = useRef<Group>(null);
    const rightEyeRef = useRef<Group>(null);

    useImperativeHandle(ref, () => ({
      applyPose: (pose: MartyPose) => {
        const { joints, eyes } = pose;

        leftHipRef.current?.rotation?.set(joints.leftHip, 0, 0);
        leftKneeRef.current?.rotation?.set(joints.leftKnee, 0, 0);
        leftFootRef.current?.rotation?.set(joints.leftFoot, 0, 0);
        rightHipRef.current?.rotation?.set(joints.rightHip, 0, 0);
        rightKneeRef.current?.rotation?.set(joints.rightKnee, 0, 0);
        rightFootRef.current?.rotation?.set(joints.rightFoot, 0, 0);
        leftArmRef.current?.rotation?.set(joints.leftArm, 0, 0);
        rightArmRef.current?.rotation?.set(joints.rightArm, 0, 0);

        if (rootRef.current?.rotation) {
          rootRef.current.rotation.y = joints.twist;
          rootRef.current.rotation.z = pose.bodyTilt;
        }
        if (rootRef.current?.position) {
          rootRef.current.position.y = pose.bodyY;
        }

        if (leftEyeRef.current?.position) {
          leftEyeRef.current.position.x = -0.1 + eyes.left.x;
          leftEyeRef.current.position.y = HEAD_SIZE * 0.1 + eyes.left.y;
          leftEyeRef.current.scale?.setScalar(eyes.left.scale);
        }

        if (rightEyeRef.current?.position) {
          rightEyeRef.current.position.x = 0.1 + eyes.right.x;
          rightEyeRef.current.position.y = HEAD_SIZE * 0.1 + eyes.right.y;
          rightEyeRef.current.scale?.setScalar(eyes.right.scale);
        }
      },
      getRootRef: () => rootRef.current,
    }));

    void initialPose;

    return (
      <group
        ref={rootRef}
        position={[
          0,
          BODY_HEIGHT / 2 + LEG_UPPER_HEIGHT + LEG_LOWER_HEIGHT + FOOT_HEIGHT,
          0,
        ]}
      >
        {/* Body */}
        <mesh>
          <boxGeometry args={[BODY_WIDTH, BODY_HEIGHT, BODY_DEPTH]} />
          <meshStandardMaterial color={BODY_COLOR} />
        </mesh>

        {/* Head */}
        <group position={[0, BODY_HEIGHT / 2 + HEAD_SIZE / 2, 0]}>
          <mesh>
            <boxGeometry args={[HEAD_SIZE, HEAD_SIZE, HEAD_SIZE * 0.9]} />
            <meshStandardMaterial color={BODY_COLOR} />
          </mesh>

          {/* Eyes */}
          <group
            ref={leftEyeRef}
            position={[-0.1, HEAD_SIZE * 0.1, HEAD_SIZE / 2 - 0.02]}
          >
            <EyeGeometry />
          </group>
          <group
            ref={rightEyeRef}
            position={[0.1, HEAD_SIZE * 0.1, HEAD_SIZE / 2 - 0.02]}
          >
            <EyeGeometry />
          </group>
        </group>

        {/* Left leg */}
        <group ref={leftHipRef} position={[-LEG_SPACING, -BODY_HEIGHT / 2, 0]}>
          <LegGeometry side="left" />
          <group
            ref={leftKneeRef}
            position={[0, -LEG_UPPER_HEIGHT - LEG_LOWER_HEIGHT, 0]}
          >
            <group ref={leftFootRef}>
              <FootGeometry />
            </group>
          </group>
        </group>

        {/* Right leg */}
        <group ref={rightHipRef} position={[LEG_SPACING, -BODY_HEIGHT / 2, 0]}>
          <LegGeometry side="right" />
          <group
            ref={rightKneeRef}
            position={[0, -LEG_UPPER_HEIGHT - LEG_LOWER_HEIGHT, 0]}
          >
            <group ref={rightFootRef}>
              <FootGeometry />
            </group>
          </group>
        </group>

        {/* Left arm */}
        <group ref={leftArmRef} position={[-ARM_SPACING, BODY_HEIGHT * 0.2, 0]}>
          <ArmGeometry />
        </group>

        {/* Right arm */}
        <group ref={rightArmRef} position={[ARM_SPACING, BODY_HEIGHT * 0.2, 0]}>
          <ArmGeometry />
        </group>
      </group>
    );
  },
);
