import { Animation, animationPlaceholder } from "models/components/shared/animation";
import { Pattern } from "models/components/shared/pattern";
import { Point } from "models/components/shared/point";
import { createGuid, rotatePoint } from "./math";

export const rgbColorStringFromPoint = (point: Point): string =>
  `rgb(${point.redLaserPowerPwm},${point.greenLaserPowerPwm},${point.blueLaserPowerPwm})`;

const hexToRgb = (hex: string) => {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
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

  const keyFrames = [
    {
      uuid: createGuid(),
      timeMs: 100,
      propertyEdited: "scale",
      propertyValue: 0.7,
    },
    {
      uuid: createGuid(),
      timeMs: 150,
      propertyEdited: "xOffset",
      propertyValue: 100,
    },
    {
      uuid: createGuid(),
      timeMs: 200,
      propertyEdited: "yOffset",
      propertyValue: 200,
    },
    {
      uuid: createGuid(),
      timeMs: 250,
      propertyEdited: "rotation",
      propertyValue: 180,
    },
  ];

  animation.animationKeyFrames = keyFrames;
  //TODO remove this placeholder code
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
  let updatedPoints: Point[] = [];
  for (let index = 0; index < pointsLength; index++) {
    let rotatedPoint: Point = rotatePoint({ ...points[index] }, rotation, xOffset, yOffset);

    rotatedPoint.x += xOffset;
    rotatedPoint.y += yOffset;
    rotatedPoint.x *= scale;
    rotatedPoint.y *= scale;
    updatedPoints.push(rotatedPoint);
  }
  return updatedPoints;
};
