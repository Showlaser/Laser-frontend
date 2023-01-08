import { AnimationPattern } from "models/components/shared/animation";
import React, { useEffect } from "react";

type Props = {
  selectedAnimationPattern: AnimationPattern | null;
  setSelectedAnimationPattern: (animationPattern: AnimationPattern | null) => void;
};

export default function AnimationPatternTimeline({ selectedAnimationPattern, setSelectedAnimationPattern }: Props) {
  useEffect(() => {
    const canvas = document.getElementById("animation-pattern-timeline-canvas") as HTMLCanvasElement;
    canvas.width = 100;
    canvas.height = 150;
    canvas.style.width = "100%";
    canvas.style.height = "150px";
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, []);

  return (
    <div style={{ marginTop: "5px" }}>
      <canvas id="animation-pattern-timeline-canvas" style={{ border: "1px red solid" }} />
    </div>
  );
}
