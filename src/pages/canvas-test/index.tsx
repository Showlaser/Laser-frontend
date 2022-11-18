import PointsDrawer from "components/shared/points-drawer";
import { Point } from "models/components/shared/point";
import React, { useEffect, useState } from "react";
import { prepareCanvas } from "services/logic/svg-to-coordinates-converter";
import { applyParametersToPointsForCanvas, convertPointsToCanvasSize } from "services/shared/converters";
import { generatePointsTestSet } from "tests/helper";

export default function CanvasTest() {
  const [angle, setAngle] = useState<number>(-360);
  const [pointsToDraw, setPointsToDraw] = useState<Point[]>([]);
  const xOffset = 0;
  const yOffset = 1500;
  const scale = 1;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    interval = setInterval(() => {
      const pToDr = applyParametersToPointsForCanvas(scale, xOffset, yOffset, angle, points);
      setPointsToDraw(pToDr);
      setAngle(angle + 1);
    }, 10);
    return () => clearInterval(interval);
  }, [angle]);

  const points = generatePointsTestSet([
    {
      x: -200,
      y: 0,
    },
    {
      x: 0,
      y: 2000,
    },
    {
      x: 2000,
      y: 0,
    },
  ]);

  return (
    <>
      <h5>{angle}</h5>
      <PointsDrawer pointsToDraw={pointsToDraw} />
    </>
  );
}
