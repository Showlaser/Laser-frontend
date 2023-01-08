import { AnimationPattern } from "models/components/shared/animation";
import { Pattern } from "models/components/shared/pattern";
import React from "react";

type Props = {
  selectedAnimationPattern: AnimationPattern | null;
  setSelectedAnimationPattern: (animationPattern: AnimationPattern | null) => void;
};

export default function AnimationPatternTimeline({ selectedAnimationPattern, setSelectedAnimationPattern }: Props) {
  return (
    <div>
      <canvas />
    </div>
  );
}
