// MIN = Minimum expected value
// MAX = Maximium expected value

import { Point } from "models/components/shared/point";

// Function to normalise the values (MIN / MAX could be integrated)
export const normalise = (value: number, min: number, max: number) => ((value - min) * 100) / (max - min);

export const mapNumber = (number: number, inMin: number, inMax: number, outMin: number, outMax: number) => {
  return ((number - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
};

export const createGuid = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const emptyGuid = () => "00000000-0000-0000-0000-000000000000";

export const capitalizeFirstLetter = (string: string) => string.charAt(0).toUpperCase() + string.slice(1);

export const convertToMilliWatts = (maxPower: number, currentValue: number) =>
  Math.round((maxPower / 255) * currentValue);

export const valueIsWithinBoundaries = (value: number, min: number, max: number) => value <= max && value >= min;

export const numberIsBetweenOrEqual = (number: number, min: number, max: number) => {
  return number >= min && number <= max;
};

export const getLargestNumber = (numberOne: number, numberTwo: number): number =>
  numberOne > numberTwo ? numberOne : numberTwo;

export const rotatePoints = (points: Point[], rotation: number, centerX: number, centerY: number) => {
  const correctRotation = rotation < 0 ? Math.abs(rotation) : -Math.abs(rotation);
  const radians = (Math.PI / 180) * correctRotation,
    cos = Math.cos(radians),
    sin = Math.sin(radians);

  let rotatedPoints: Point[] = [];
  const pointsLength = points.length;
  for (let i = 0; i < pointsLength; i++) {
    let point = { ...points[i] };
    const x = cos * (point.x - centerX) + sin * (point.y - centerY) + centerX;
    const y = cos * (point.y - centerY) - sin * (point.x - centerX) + centerY;
    point.x = x;
    point.y = y;
    rotatedPoints.push(point);
  }

  return rotatedPoints;
};

export const getCenterOfPoints = (points: Point[], xOffset: number, yOffset: number): { x: number; y: number } => {
  const pointsLength = points.length;
  if (pointsLength === 0) {
    return { x: 0, y: 0 };
  }

  const sortedXAxis = points.sort((a, b) => a.x - b.x);
  const left = sortedXAxis[0].x;
  const right = sortedXAxis[pointsLength - 1].x;

  const sortedYAxis = points.sort((a, b) => a.y - b.y);
  const bottom = sortedYAxis[0].y;
  const top = sortedYAxis[pointsLength - 1].y;

  const centerX = (right - left) / 2 + xOffset;
  const centerY = (top - bottom) / 2 - yOffset;
  return { x: centerX, y: centerY };
};