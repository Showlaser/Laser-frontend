import { Animation } from "models/components/shared/animation";
import { getAnimationDuration, getPointsToDrawFromAnimation } from "services/logic/animation-logic";
import { testAnimation } from "../helper";

describe("animation-logic", () => {
  describe("getAnimationDuration", () => {
    const dataSet = [
      { animation: testAnimation(0, 0, 10), expectedDuration: 10 },
      { animation: testAnimation(110, 0, 100), expectedDuration: 210 },
      { animation: testAnimation(110, 0, 900), expectedDuration: 1010 },
      { animation: testAnimation(50, 0, 600), expectedDuration: 650 },
      { animation: testAnimation(50, 0, 1000), expectedDuration: 1050 },
    ];

    it.each(dataSet)(
      "Returned duration should match the expectedDuration",
      (data: { animation: Animation; expectedDuration: number }) => {
        const duration = getAnimationDuration(data.animation);
        expect(duration).toBe(data.expectedDuration);
      }
    );
  });
});

test(
  "Tested: getPointsToDrawFromAnimation:" +
    "Given the provided points starttime is equal to the specified starttime," +
    "When I execute the function," +
    "Then I expect the points with the same starttime to be returned",
  () => {
    const animation = testAnimation(0, 100, 0);
    const points = getPointsToDrawFromAnimation(100, animation);
    expect(points[0].length).toBe(animation.animationPatterns[0].pattern.points.length);
    expect(points.length).toBe(animation.animationPatterns.length);
  }
);

test(
  "Tested: drawKeyFrames:" +
    "Given the provided points starttime is equal to the specified starttime," +
    "When I execute the function," +
    "Then I expect the points with the same starttime to be returned",
  () => {
    const animation = testAnimation(0, 100, 0);
    const points = getPointsToDrawFromAnimation(100, animation);
    expect(points[0].length).toBe(animation.animationPatterns[0].pattern.points.length);
    expect(points.length).toBe(animation.animationPatterns.length);
  }
);
