import PointsDrawer from "components/shared/points-drawer";
import { Animation } from "models/components/shared/animation";
import React from "react";

type Props = {
  animation: Animation;
};

export function AnimationEffect({ animation }: Props) {
  return <PointsDrawer pointsToDraw={animation.points} />;
}
