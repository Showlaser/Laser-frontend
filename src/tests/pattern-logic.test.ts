import {
  getAnimationPatternsInsideTimelineRange,
  getAnimationPatternsToDrawInTimeline,
  getCurrentKeyFrame,
  getKeyFramesBeforeTimelinePositionSortedByTimeDescending,
  getKeyFramesPastTimelinePositionSortedByTime,
  getPreviousCurrentAndNextKeyFramePerProperty,
} from "services/logic/pattern-logic";
import { getTestAnimationPatternKeyFrames, testAnimation, testAnimationPattern } from "./helper";
import { Animation, AnimationPattern } from "models/components/shared/animation";

test(
  "Tested: getAnimationPatternsInsideTimelineRange:" +
    "Given the provided animation patterns start times are in the provided range," +
    "When I execute the function," +
    "Then I expect all the patterns to be returned.",
  () => {
    const animation = testAnimation(0, 0, 110);
    const animationPatterns = getAnimationPatternsInsideTimelineRange(animation, 0, 100);
    const pattern = animationPatterns?.at(0);
    expect(pattern?.uuid).toBe("4145ab82-6a79-48d1-8425-747a464a4940");
  }
);

test(
  "Tested: getAnimationPatternsInsideTimelineRange:" +
    "Given the provided animation patterns are not in the provided range," +
    "When I execute the function," +
    "Then I expect an empty array.",
  () => {
    const animation = testAnimation(0, 0, 80);
    const animationPatterns = getAnimationPatternsInsideTimelineRange(animation, 100, 1000);
    expect(animationPatterns).toStrictEqual([]);
  }
);

describe("pattern-logic", () => {
  describe("getAnimationsPatternsToDrawInTimeline", () => {
    const dataSet = [
      { animation: testAnimation(0, 0, 1100), shouldBeReturned: true },
      { animation: testAnimation(110, 0, 1100), shouldBeReturned: true },
      { animation: testAnimation(110, 0, 900), shouldBeReturned: true },
      { animation: testAnimation(50, 0, 600), shouldBeReturned: true },
      { animation: testAnimation(1150, 0, 1600), shouldBeReturned: false },
      { animation: testAnimation(0, 0, 90), shouldBeReturned: false },
    ];

    it.each(dataSet)(
      "Returns all patterns that should be visible in the timeline",
      (data: { animation: Animation; shouldBeReturned: boolean }) => {
        const animationPatterns = getAnimationPatternsToDrawInTimeline(data.animation, 100, 1000);
        expect(animationPatterns?.length).toBe(data.shouldBeReturned ? 1 : 0);
      }
    );
  });
});

test(
  "Tested: getKeyFramesPastTimelinePositionSortedByTime:" +
    "Given the provided keyframes starttime are greater than the starttime," +
    "When I execute the function," +
    "Then I expect the returned keyframe starttime to be greater than the starttime",
  () => {
    const animationPattern = testAnimationPattern(0, 100, 200);
    const keyFrames = getKeyFramesPastTimelinePositionSortedByTime("scale", animationPattern, 0);
    const keyFrameTime = keyFrames.at(0)?.timeMs;

    expect(keyFrameTime).toBeGreaterThanOrEqual(100);
  }
);

test(
  "Tested: getKeyFramesPastTimelinePositionSortedByTime:" +
    "Given the provided keyframe starttime are lower than the starttime," +
    "When I execute the function," +
    "Then I expect an empty array",
  () => {
    const animationPattern = testAnimationPattern(0, 0, 50);
    const keyFrames = getKeyFramesPastTimelinePositionSortedByTime("scale", animationPattern, 100);
    expect(keyFrames).toStrictEqual([]);
  }
);

const getAnimationWithTwoKeyframes = (): AnimationPattern => {
  const firstKeyFrame = getTestAnimationPatternKeyFrames(100)[0];
  const secondKeyframe = getTestAnimationPatternKeyFrames(200)[0];
  const mergedKeyFrames = [firstKeyFrame, secondKeyframe];

  let animationPattern = testAnimationPattern(0, 0, 0);
  animationPattern.animationKeyFrames = mergedKeyFrames;
  return animationPattern;
};

test(
  "Tested: getKeyFramesPastTimelinePositionSortedByTime:" +
    "Given the provided keyframes starttime is greater than the starttime," +
    "When I execute the function," +
    "Then I expect the returned keyframes to be sorted by time",
  () => {
    const animationPattern = getAnimationWithTwoKeyframes();
    const keyFrames = getKeyFramesPastTimelinePositionSortedByTime("scale", animationPattern, 0);

    const firstKeyFrame = keyFrames.at(0);
    const secondKeyFrame = keyFrames.at(1);

    expect(firstKeyFrame?.timeMs).toBe(100);
    expect(secondKeyFrame?.timeMs).toBe(200);
  }
);

test(
  "Tested: getKeyFramesBeforeTimelinePositionSortedByTimeDescending:" +
    "Given the provided keyframes starttime are lower than the starttime," +
    "When I execute the function," +
    "Then I expect the returned keyframes to be sorted by time descending",
  () => {
    const animationPattern = getAnimationWithTwoKeyframes();
    const keyFrames = getKeyFramesBeforeTimelinePositionSortedByTimeDescending("scale", animationPattern, 201);

    const firstKeyFrame = keyFrames.at(0);
    const secondKeyFrame = keyFrames.at(1);

    expect(firstKeyFrame?.timeMs).toBe(200);
    expect(secondKeyFrame?.timeMs).toBe(100);
  }
);

test(
  "Tested: getKeyFramesBeforeTimelinePositionSortedByTimeDescending:" +
    "Given the provided keyframe starttime are lower than the timelinePosition," +
    "When I execute the function," +
    "Then I expect the returned keyframe starttime to be before the starttime",
  () => {
    const animationPattern = testAnimationPattern(0, 0, 0);
    const keyFrames = getKeyFramesBeforeTimelinePositionSortedByTimeDescending("scale", animationPattern, 100);
    const keyFrameTime = keyFrames.at(0)?.timeMs;

    expect(keyFrameTime).toBeLessThanOrEqual(100);
  }
);

test(
  "Tested: getKeyFramesBeforeTimelinePositionSortedByTimeDescending:" +
    "Given the provided keyframe starttime is greater than the starttime," +
    "When I execute the function," +
    "Then I expect an empty array",
  () => {
    const animationPattern = testAnimationPattern(0, 100, 0);
    const keyFrames = getKeyFramesBeforeTimelinePositionSortedByTimeDescending("scale", animationPattern, 0);
    expect(keyFrames).toStrictEqual([]);
  }
);

test(
  "Tested: getCurrentKeyFrame:" +
    "Given the provided keyframes starttime is equal to the starttime," +
    "When I execute the function," +
    "Then I expect the provided keyframes returned",
  () => {
    const animationPattern = testAnimationPattern(0, 100, 0);
    const keyFrames = getCurrentKeyFrame(animationPattern, 100);
    expect(keyFrames.length).toBe(animationPattern.animationKeyFrames.length);
  }
);

test(
  "Tested: getPreviousCurrentAndNextKeyFramePerProperty:" +
    "Given the provided keyframes start times are before, equal and greater than/to the provided value" +
    "When I execute the function," +
    "Then I expect the provided keyframes returned formatted in previous, current and next",
  () => {
    const previousKeyFrame = getTestAnimationPatternKeyFrames(0)[0];
    const currentKeyFrame = getTestAnimationPatternKeyFrames(100)[0];
    const nextKeyFrame = getTestAnimationPatternKeyFrames(200)[0];

    let animationPattern = testAnimationPattern(0, 0, 0);
    animationPattern.animationKeyFrames = animationPattern.animationKeyFrames.concat(
      previousKeyFrame,
      currentKeyFrame,
      nextKeyFrame
    );

    const keyFrames = getPreviousCurrentAndNextKeyFramePerProperty(animationPattern, 100);
    keyFrames.previous.forEach((kf) => expect(kf.timeMs).toBe(0));
    keyFrames.current.forEach((kf) => expect(kf.timeMs).toBe(100));
    keyFrames.next.forEach((kf) => expect(kf.timeMs).toBe(200));
  }
);

test(
  "Tested: getPatternPointsByTimelinePosition:" +
    "Add description" +
    "When I execute the function," +
    "Add description",
  () => {
    //TODO add test code
  }
);
