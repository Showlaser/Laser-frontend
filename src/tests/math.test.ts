import { calculateCenterOfPoints, rotatePoints } from "services/shared/math";
import { generatePointsTestSet, getPointsTestSet } from "./helper";

test("calculateCenterOfPoints line center y test", () => {
  const testPoints = getPointsTestSet();
  const result = calculateCenterOfPoints(testPoints);

  const expectedResult = { x: 0, y: 0 };
  expect(result).toStrictEqual(expectedResult);
});

test("calculateCenterOfPoints triangle test", () => {
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

  const result = calculateCenterOfPoints(testPoints);
  const expectedResult = { x: 0, y: 667 };
  expect(result).toStrictEqual(expectedResult);
});

test("calculateCenterOfPoints bottom triangle test", () => {
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

  const result = calculateCenterOfPoints(testPoints);
  const expectedResult = { x: 0, y: -2667 };
  expect(result).toStrictEqual(expectedResult);
});

test("rotatePoint test", () => {
  const testPoint = generatePointsTestSet([{ x: -1000, y: 0 }]);
  const rotatedTestPoint = rotatePoints(testPoint, 90, 0, 0)[0];
  expect(rotatedTestPoint.x).toBe(-0);
  expect(rotatedTestPoint.y).toBe(-1000);
});
