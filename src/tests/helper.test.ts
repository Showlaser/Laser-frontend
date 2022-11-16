import { getPointsTestSet, generatePointsTestSet } from "tests/helper";

test("getPointsTestSet test", () => {
  const testPoints = getPointsTestSet();
  expect(testPoints.length).toBe(3);
});

test("generatePointsTestSet test", () => {
  const testPoints = generatePointsTestSet([
    { x: -1000, y: 2999 },
    { x: 1000, y: 0 },
  ]);

  expect(testPoints.some((tp) => tp.x === -1000 && tp.y === 2999)).toBe(true);
  expect(testPoints.some((tp) => tp.x === 1000 && tp.y === 0)).toBe(true);
});
