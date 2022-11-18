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

export const calculateCenterOfPoints = (points: Point[]): { x: number; y: number } => {
  const pointsLength = points.length;
  if (pointsLength === 0) {
    return { x: 0, y: 0 };
  }

  const firstPoint = points[0];
  const lastPoint = points[pointsLength - 1];

  if (firstPoint.x !== lastPoint.x || firstPoint.y !== lastPoint.y) {
    points.push(firstPoint);
  }

  let twiceArea = 0;
  let x = 0;
  let y = 0;
  const nPts = pointsLength;
  let p1: Point | null = null;
  let p2: Point | null = null;
  let f: number | null = null;

  for (let i = 0, j = nPts - 1; i < nPts; j = i++) {
    p1 = points[i];
    p2 = points[j];
    f = (p1.y - firstPoint.y) * (p2.x - firstPoint.x) - (p2.y - firstPoint.y) * (p1.x - firstPoint.x);
    twiceArea += f;
    x += (p1.x + p2.x - 2 * firstPoint.x) * f;
    y += (p1.y + p2.y - 2 * firstPoint.y) * f;
  }
  f = twiceArea * 3;

  let xResult = Math.round(x / f + firstPoint.x);
  let yResult = Math.round(y / f + firstPoint.y);

  if (Number.isNaN(xResult)) {
    xResult = 0;
  }
  if (Number.isNaN(yResult)) {
    yResult = 0;
  }
  return { x: xResult, y: yResult };
};

export const getLargestNumber = (numberOne: number, numberTwo: number): number =>
  numberOne > numberTwo ? numberOne : numberTwo;

export const rotatePoints = (points: Point[], rotation: number, centerX: number, centerY: number) => {
  const radians = (Math.PI / 180) * rotation,
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
