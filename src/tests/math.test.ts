import { getCenterOfPoints, rotatePoints } from "services/shared/math";
import { generatePointsTestSet, getPointsTestSet } from "./helper";

test("getCenterOfPoints line center y test", () => {
  const testPoints = getPointsTestSet();
  const result = getCenterOfPoints(testPoints, 0, 0);

  const expectedResult = { x: 0, y: 0 };
  expect(result).toStrictEqual(expectedResult);
});

test("getCenterOfPoints triangle test", () => {
  const testPoints = generatePointsTestSet([
    {
      x: -2000,
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

  const result = getCenterOfPoints(testPoints, 0, 0);
  const expectedResult = { x: -6, y: 667 };
  expect(result).toStrictEqual(expectedResult);
});

test("getCenterOfPoints bottom triangle test", () => {
  const testPoints = generatePointsTestSet([
    {
      x: -2000,
      y: -4000,
    },
    {
      x: 0,
      y: 0,
    },
    {
      x: 2000,
      y: -4000,
    },
  ]);

  const result = getCenterOfPoints(testPoints, 0, 0);
  const expectedResult = { x: 0, y: -2667 };
  expect(result).toStrictEqual(expectedResult);
});

test("getCenterOfPoints two points test", () => {
  const testPoints = generatePointsTestSet([
    {
      x: 0,
      y: 1000,
    },
    {
      x: 0,
      y: -1000,
    },
  ]);

  const result = getCenterOfPoints(testPoints, 0, 0);
  const expectedResult = { x: -0, y: 0 };
  expect(result).toStrictEqual(expectedResult);
});

test("rotatePoint test", () => {
  const testPoint = generatePointsTestSet([{ x: -1000, y: 0 }]);
  const rotatedTestPoint = rotatePoints(testPoint, 90, 0, 0)[0];
  expect(rotatedTestPoint.x).toBe(-6.123233995736766e-14);
  expect(rotatedTestPoint.y).toBe(1000);
});
