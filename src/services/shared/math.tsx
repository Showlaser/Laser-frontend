// MIN = Minimum expected value
// MAX = Maximium expected value

import { Point } from "models/components/shared/point";

// Function to normalise the values (MIN / MAX could be integrated)
export const normalise = (value: number, min: number, max: number) =>
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
    var r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const emptyGuid = () => "00000000-0000-0000-0000-000000000000";

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

export const rotatePoint = (
  point: Point,
  angle: number,
  centerX: number,
  centerY: number
): Point => {
  var radians = (Math.PI / 180) * angle,
    cos = Math.cos(radians),
    sin = Math.sin(radians),
    nx = cos * (point.x - centerX) + sin * (point.y - centerY) + centerX,
    ny = cos * (point.y - centerY) - sin * (point.x - centerX) + centerY;

  let clonedPoint: Point = { ...point };

  clonedPoint.x = nx;
  clonedPoint.y = ny;
  return clonedPoint;
};
