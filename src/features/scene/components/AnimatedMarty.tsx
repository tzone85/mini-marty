"use client";

import { useCallback } from "react";
import type { VirtualMarty } from "@/features/marty/virtual-marty";
import { MartyModel } from "./MartyModel";
import type { MartyModelHandle } from "./MartyModel";
import { useMartyAnimation } from "../animation/useMartyAnimation";

interface AnimatedMartyProps {
  readonly marty: VirtualMarty | null;
}

export function AnimatedMarty({ marty }: AnimatedMartyProps) {
  const { onModelReady } = useMartyAnimation({ marty });

  const handleRef = useCallback(
    (handle: MartyModelHandle | null) => {
      if (handle) {
        onModelReady(handle);
      }
    },
    [onModelReady],
  );

  return <MartyModel ref={handleRef} />;
}
