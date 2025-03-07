// MIN = Minimum expected value
// MAX = Maximium expected value

import { Point } from "models/components/shared/point";

// Function to normalise the values (MIN / MAX could be integrated)
export const normalize = (value: number, min: number, max: number) =>
  ((value - min) * 100) / (max - min);

export const mapNumber = (
  number: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
) => {
  return ((number - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
};

export const createGuid = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const emptyGuid = "00000000-0000-0000-0000-000000000000";

export const capitalizeFirstLetter = (string: string) =>
  string.charAt(0).toUpperCase() + string.slice(1);

export const convertToMilliWatts = (maxPower: number, currentValue: number) =>
  Math.round((maxPower / 255) * currentValue);

export const valueIsWithinBoundaries = (
  value: number,
  min: number,
  max: number
) => value <= max && value >= min;

export const numberIsBetweenOrEqual = (
  number: number,
  min: number,
  max: number
) => {
  return number >= min && number <= max;
};

export const getLargestNumber = (
  numberOne: number,
  numberTwo: number
): number => (numberOne > numberTwo ? numberOne : numberTwo);

export const roundToZero = (value: number, tolerance = 1e-10) => {
  return Math.abs(value) < tolerance ? 0 : value;
};

export const rotatePoints = (
  points: Point[],
  angleInDegrees: number,
  centerX: number,
  centerY: number
) => {
  const angleInRadians = ((360 - angleInDegrees) * Math.PI) / 180;
  let updatedPoints = [];

  const pointsLength = points.length;
  for (let i = 0; i < pointsLength; i++) {
    const point = points[i];
    const x =
      centerX +
      (point.x - centerX) * Math.cos(angleInRadians) -
      (point.y - centerY) * Math.sin(angleInRadians);
    const y =
      centerY +
      (point.x - centerX) * Math.sin(angleInRadians) +
      (point.y - centerY) * Math.cos(angleInRadians);

    point.x = roundToZero(x);
    point.y = roundToZero(y);

    updatedPoints.push(point);
  }

  return updatedPoints;
};

export const getCenterOfPoints = (
  points: Point[]
): { x: number; y: number } => {
  const pointsLength = points.length;
  if (pointsLength === 0) {
    return { x: 0, y: 0 };
  }

  const centerX =
    points
      .map((p) => p.x)
      .reduce((previousX, currentX) => previousX + currentX) / pointsLength;
  const centerY =
    points
      .map((p) => p.y)
      .reduce((previousY, currentX) => previousY + currentX) / pointsLength;

  return { x: centerX, y: centerY };
};

export const getRandomNumber = (max: number) =>
  Math.floor(Math.random() * max + 1);
