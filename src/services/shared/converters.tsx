import { rgbToHex } from "@mui/material";
import {
  Animation,
  AnimationPattern,
  AnimationPatternKeyFrame,
  animationPlaceholder,
} from "models/components/shared/animation";
import { Pattern } from "models/components/shared/pattern";
import { Point } from "models/components/shared/point";
import { canvasPxSize } from "./config";
import { createGuid, getCenterOfPoints, mapNumber, rotatePoints } from "./math";
import { LasershowAnimation } from "models/components/shared/lasershow";
import { getRandomObjectName } from "./random-object-name-generator";

export const getRgbColorStringFromPoint = (point: Point): string =>
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

export const getHexColorStringFromPoint = (point: Point): string =>
  rgbToHex(getRgbColorStringFromPoint(point));

export const setLaserPowerFromHexString = (
  hex: string,
  point: Point
): Point => {
  const rgb = hexToRgb(hex);
  point.redLaserPowerPwm = rgb?.r;
  point.greenLaserPowerPwm = rgb?.g;
  point.blueLaserPowerPwm = rgb?.b;
  return point;
};

export const convertPatternToAnimation = (pattern: Pattern): Animation => {
  let animation: Animation = animationPlaceholder();
  const animationPattern: AnimationPattern = {
    uuid: createGuid(),
    animationUuid: animation.uuid,
    patternUuid: pattern.uuid,
    name: `${pattern.name}-new`,
    pattern: pattern,
    animationPatternKeyFrames: generateAnimationKeyframesFromPattern(pattern),
    startTimeMs: 0,
    timelineId: 0,
  };

  animation.name = pattern.name;
  animation.image = pattern.image;
  animation.animationPatterns = [animationPattern];

  return animation;
};

export const convertAnimationToLasershowAnimation = (
  animation: Animation,
  lasershowUuid: string
): LasershowAnimation => {
  return {
    uuid: createGuid(),
    animationUuid: animation.uuid,
    lasershowUuid,
    name: getRandomObjectName(),
    animation,
    startTimeMs: 0,
    timelineId: 0,
  };
};

export const convertPatternToAnimationPattern = (
  pattern: Pattern,
  animation: Animation
): AnimationPattern => {
  return {
    uuid: createGuid(),
    animationUuid: animation.uuid,
    patternUuid: pattern.uuid,
    name: `${pattern.name}-new`,
    pattern: pattern,
    animationPatternKeyFrames: generateAnimationKeyframesFromPattern(pattern),
    startTimeMs: 0,
    timelineId: 0,
  };
};

const generateAnimationKeyframesFromPattern = (
  pattern: Pattern
): AnimationPatternKeyFrame[] => {
  return [
    {
      uuid: createGuid(),
      animationPatternUuid: pattern.uuid,
      timeMs: 0,
      propertyEdited: "scale",
      propertyValue: pattern.scale,
    },
    {
      uuid: createGuid(),
      animationPatternUuid: pattern.uuid,
      timeMs: 0,
      propertyEdited: "xOffset",
      propertyValue: pattern.xOffset,
    },
    {
      uuid: createGuid(),
      animationPatternUuid: pattern.uuid,
      timeMs: 0,
      propertyEdited: "yOffset",
      propertyValue: pattern.yOffset,
    },
    {
      uuid: createGuid(),
      animationPatternUuid: pattern.uuid,
      timeMs: 0,
      propertyEdited: "rotation",
      propertyValue: pattern.rotation,
    },
  ];
};

export const applyParametersToPointsForCanvasByPattern = (
  pattern: Pattern
): Point[] =>
  applyParametersToPointsForCanvas(
    pattern.scale,
    pattern.xOffset,
    pattern.yOffset,
    pattern.rotation,
    pattern.points
  );

export const applyParametersToPointsForCanvas = (
  scale: number,
  xOffset: number,
  yOffset: number,
  rotation: number,
  points: Point[],
  convertValuesFromPointsDrawer: boolean = true
): Point[] => {
  const pointsLength = points.length;
  let pointsWithOffsetApplied = [];
  for (let i = 0; i < pointsLength; i++) {
    let point = { ...points[i] };
    point.x *= scale;
    point.y *= scale;
    point.x += xOffset;
    point.y += yOffset;
    pointsWithOffsetApplied.push(point);
  }

  const centerOfPattern = getCenterOfPoints(pointsWithOffsetApplied);
  const centerX = centerOfPattern.x;
  const centerY = centerOfPattern.y;

  const rotatedPoints = rotatePoints(
    pointsWithOffsetApplied,
    rotation,
    centerX,
    centerY
  );
  if (convertValuesFromPointsDrawer) {
    return convertPointsToCanvasSize(rotatedPoints);
  } else {
    return rotatedPoints;
  }
};

export const convertPointsToCanvasSize = (points: Point[]) => {
  let mappedPoints: Point[] = [];
  const pointsLength = points.length;

  for (let i = 0; i < pointsLength; i++) {
    let point = { ...points[i] };
    point.x = mapNumber(point.x, -4000, 4000, 0, canvasPxSize);
    point.y = mapNumber(point.y, -4000, 4000, canvasPxSize, 0);
    mappedPoints.push(point);
  }

  return mappedPoints;
};
