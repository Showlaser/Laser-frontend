import { Animation, animationPlaceholder } from "models/components/shared/animation";
import { Pattern } from "models/components/shared/pattern";
import { Point } from "models/components/shared/point";
import { canvasPxSize } from "./config";
import { getCenterOfPoints, mapNumber, rotatePoints } from "./math";

export const rgbColorStringFromPoint = (point: Point): string =>
  `rgb(${point.redLaserPowerPwm},${point.greenLaserPowerPwm},${point.blueLaserPowerPwm})`;

const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (result === null) {
    throw new Error("Invalid hex supplied");
  }

  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  };
};

export const setLaserPowerFromHexString = (hex: string, point: Point): Point => {
  const rgb = hexToRgb(hex);
  point.redLaserPowerPwm = rgb?.r;
  point.greenLaserPowerPwm = rgb?.g;
  point.blueLaserPowerPwm = rgb?.b;
  return point;
};

export const convertPatternToAnimation = (pattern: Pattern): Animation => {
  let animation: Animation = animationPlaceholder();
  animation.name = pattern.name;
  animation.image = pattern.image;
  animation.pattern = pattern;
  animation.animationKeyFrames = [];
  return animation;
};

export const applyParametersToPointsForCanvasByPattern = (pattern: Pattern): Point[] =>
  applyParametersToPointsForCanvas(pattern.scale, pattern.xOffset, pattern.yOffset, pattern.rotation, pattern.points);

export const applyParametersToPointsForCanvas = (
  scale: number,
  xOffset: number,
  yOffset: number,
  rotation: number,
  points: Point[]
): Point[] => {
  const pointsLength = points.length;
  let pointsWithOffsetApplied = [];
  for (let i = 0; i < pointsLength; i++) {
    let point = { ...points[i] };
    point.x *= scale;
    point.y *= scale;
    point.x += xOffset;
    point.y -= yOffset;
    pointsWithOffsetApplied.push(point);
  }

  const centerOfPattern = getCenterOfPoints(pointsWithOffsetApplied, xOffset, yOffset);
  const centerX = centerOfPattern.x;
  const centerY = centerOfPattern.y;

  const rotatedPoints = rotatePoints(pointsWithOffsetApplied, rotation, centerX, centerY);
  return convertPointsToCanvasSize(rotatedPoints);
};

export const convertPointsToCanvasSize = (points: Point[]) => {
  let mappedPoints: Point[] = [];
  const pointsLength = points.length;

  for (let i = 0; i < pointsLength; i++) {
    let point = { ...points[i] };
    point.x = mapNumber(point.x, -4000, 4000, 0, canvasPxSize);
    point.y = mapNumber(point.y, -4000, 4000, 0, canvasPxSize);
    mappedPoints.push(point);
  }

  return mappedPoints;
};
