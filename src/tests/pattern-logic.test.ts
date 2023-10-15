import {
  getAnimationPatternsInTimelineRange,
  getKeyframesBeforeStartTimeSortedByTimeDescending,
  getKeyframesPastStartTimeSortedByTime,
} from "services/logic/pattern-logic";
import { getTestAnimationPatternKeyFrames, testAnimation, testAnimationPattern } from "./helper";

test(
  "Tested: getAnimationPatternsInTimelineRange:" +
    "Given the provided animation patterns start times are in the provided range," +
    "When I execute the function," +
    "Then I expect all the patterns to be returned.",
  () => {
    const animation = testAnimation(0);
    const animationPatterns = getAnimationPatternsInTimelineRange(animation, 0, 100);
    const pattern = animationPatterns?.at(0);
    expect(pattern?.uuid).toBe("4145ab82-6a79-48d1-8425-747a464a4940");
  }
);

test(
  "Tested: getAnimationPatternsInTimelineRange:" +
    "Given the provided animation patterns are not in the provided range," +
    "When I execute the function," +
    "Then I expect an empty array.",
  () => {
    const animation = testAnimation(0);
    const animationPatterns = getAnimationPatternsInTimelineRange(animation, 100, 1000);
    expect(animationPatterns).toStrictEqual([]);
  }
);

test(
  "Tested: getKeyframesPastStartTimeSortedByTime:" +
    "Given the provided keyframes starttime are greater than the starttime," +
    "When I execute the function," +
    "Then I expect the returned keyframe starttime to be greater than the starttime",
  () => {
    const animationPattern = testAnimationPattern(100);
    const keyFrames = getKeyframesPastStartTimeSortedByTime("scale", animationPattern, 0);
    const keyFrameTime = keyFrames.at(0)?.timeMs;

    expect(keyFrameTime).toBeGreaterThanOrEqual(100);
  }
);

test(
  "Tested: getKeyframesPastStartTimeSortedByTime:" +
    "Given the provided keyframe starttime are lower than the starttime," +
    "When I execute the function," +
    "Then I expect an empty array",
  () => {
    const animationPattern = testAnimationPattern(0);
    const keyFrames = getKeyframesPastStartTimeSortedByTime("scale", animationPattern, 100);
    expect(keyFrames).toStrictEqual([]);
  }
);

test(
  "Tested: getKeyframesPastStartTimeSortedByTime:" +
    "Given the provided keyframes starttime are greater than the starttime," +
    "When I execute the function," +
    "Then I expect the returned keyframes to be sorted by time",
  () => {
    const firstKeyFrames = getTestAnimationPatternKeyFrames(100);
    const secondKeyframes = getTestAnimationPatternKeyFrames(200);
    const mergedKeyFrames = firstKeyFrames.concat(secondKeyframes);

    let animationPattern = testAnimationPattern(100);
    animationPattern.animationKeyFrames = mergedKeyFrames;

    const keyFrames = getKeyframesPastStartTimeSortedByTime("scale", animationPattern, 0);

    // TODO check for sorting function
    expect(keyFrameTime).toBeGreaterThanOrEqual(100);
  }
);

test(
  "Tested: getKeyframesBeforeStartTimeSortedByTimeDescending:" +
    "Given the provided keyframe starttime are lower than the starttime," +
    "When I execute the function," +
    "Then I expect the returned keyframe starttime to be before the starttime",
  () => {
    const animationPattern = testAnimationPattern(0);
    const keyFrames = getKeyframesBeforeStartTimeSortedByTimeDescending("scale", animationPattern, 100);
    const keyFrameTime = keyFrames.at(0)?.timeMs;

    expect(keyFrameTime).toBeLessThanOrEqual(100);
  }
);

test(
  "Tested: getKeyframesBeforeStartTimeSortedByTimeDescending:" +
    "Given the provided keyframe starttime is greater than the starttime," +
    "When I execute the function," +
    "Then I expect an empty array",
  () => {
    const animationPattern = testAnimationPattern(100);
    const keyFrames = getKeyframesBeforeStartTimeSortedByTimeDescending("scale", animationPattern, 0);
    expect(keyFrames).toStrictEqual([]);
  }
);
