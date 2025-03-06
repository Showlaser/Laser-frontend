import { getCenterOfPoints, rotatePoints } from "services/shared/math";
import { generatePointsTestSet, getPointsTestSet } from "./helper";

test(
  "Tested: getCenterOfPoints:" +
    "Given all the provided points form a horizontal line" +
    "When I execute the function," +
    "Then I expect the returned point to be in the center",
  () => {
    const testPoints = getPointsTestSet();
    const result = getCenterOfPoints(testPoints);

    expect(result.x).toBe(0);
    expect(result.y).toBe(0);
  }
);

test(
  "Tested: getCenterOfPoints:" +
    "Given the provided points form a triangle" +
    "When I execute the function," +
    "Then I expect the returned point to be in the center of the triangle",
  () => {
    const testPoints = generatePointsTestSet([
      {
        x: -4000,
        y: -4000,
      },
      {
        x: 0,
        y: 4000,
      },
      {
        x: 4000,
        y: -4000,
      },
    ]);

    const result = getCenterOfPoints(testPoints);
    expect(result.x).toBe(0);
    expect(result.y).toBe(-1333.3333333333333);
  }
);

test(
  "Tested: getCenterOfPoints:" +
    "Given the provided points are 2000 points away from each other in the y axis" +
    "When I execute the function," +
    "Then I expect the returned point y axis to be in the center of the provided points",
  () => {
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

    const result = getCenterOfPoints(testPoints);
    const expectedResult = { x: 0, y: 0 };
    expect(result).toStrictEqual(expectedResult);
  }
);

test(
  "Tested: rotatePoints:" +
    "Given the provided points are -1000 and 0 " +
    "When I execute the function," +
    "Then I expect the returned point to be rotated 90 degrees clockwise",
  () => {
    const testPoint = generatePointsTestSet([{ x: -1000, y: 0 }]);
    const rotatedTestPoint = rotatePoints(testPoint, 90, 0, 0)[0];
    expect(rotatedTestPoint.x).toBe(0);
    expect(rotatedTestPoint.y).toBe(1000);
  }
);
