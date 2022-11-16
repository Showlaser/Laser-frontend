import { Animation, animationPlaceholder } from "models/components/shared/animation";
import { Pattern } from "models/components/shared/pattern";
import { Point } from "models/components/shared/point";
import { calculateCenterOfPoints, mapNumber, rotatePoint } from "./math";

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

export const applyParametersToPoints = (
  scale: number,
  xOffset: number,
  yOffset: number,
  rotation: number,
  points: Point[]
) => {
  const pointsLength = points.length;
  let updatedPoints: Point[] = [...points];
  const centerOfPattern = calculateCenterOfPoints(points);
  const xCenter = centerOfPattern.x;
  const yCenter = centerOfPattern.y;

  for (let i = 0; i < pointsLength; i++) {
    let rotatedPoint: Point = rotatePoint(updatedPoints[i], rotation, xCenter, yCenter);

    rotatedPoint.x += xOffset;
    rotatedPoint.y -= yOffset;
    rotatedPoint.x *= scale;
    rotatedPoint.y *= scale;
    updatedPoints[i] = rotatedPoint;
  }
  return updatedPoints;
};

export const convertPointsToCanvasSize = (points: Point[]) => {
  let mappedPoints: Point[] = [];
  const pointsLength = points.length;

  for (let i = 0; i < pointsLength; i++) {
    let point = { ...points[i] };
    point.x = mapNumber(point.x, -4000, 4000, 0, 650);
    point.y = mapNumber(point.y, -4000, 4000, 0, 650);
    mappedPoints.push(point);
  }

  return mappedPoints;
};
