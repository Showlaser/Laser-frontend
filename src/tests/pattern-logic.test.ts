import {
  getAnimationPatternsInTimelineRange,
  getCurrentKeyFrame,
  getKeyFramesBeforeStartTimeSortedByTimeDescending,
  getKeyFramesPastStartTimeSortedByTime,
  getPreviousCurrentAndNextKeyFramePerProperty,
} from "services/logic/pattern-logic";
import { getTestAnimationPatternKeyFrames, testAnimation, testAnimationPattern } from "./helper";
import { AnimationPattern } from "models/components/shared/animation";

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
  "Tested: getKeyFramesPastStartTimeSortedByTime:" +
    "Given the provided keyframes starttime are greater than the starttime," +
    "When I execute the function," +
    "Then I expect the returned keyframe starttime to be greater than the starttime",
  () => {
    const animationPattern = testAnimationPattern(100);
    const keyFrames = getKeyFramesPastStartTimeSortedByTime("scale", animationPattern, 0);
    const keyFrameTime = keyFrames.at(0)?.timeMs;

    expect(keyFrameTime).toBeGreaterThanOrEqual(100);
  }
);

test(
  "Tested: getKeyFramesPastStartTimeSortedByTime:" +
    "Given the provided keyframe starttime are lower than the starttime," +
    "When I execute the function," +
    "Then I expect an empty array",
  () => {
    const animationPattern = testAnimationPattern(0);
    const keyFrames = getKeyFramesPastStartTimeSortedByTime("scale", animationPattern, 100);
    expect(keyFrames).toStrictEqual([]);
  }
);

const getAnimationWithTwoKeyframes = (): AnimationPattern => {
  const firstKeyFrame = getTestAnimationPatternKeyFrames(100)[0];
  const secondKeyframe = getTestAnimationPatternKeyFrames(200)[0];
  const mergedKeyFrames = [firstKeyFrame, secondKeyframe];

  let animationPattern = testAnimationPattern(0);
  animationPattern.animationKeyFrames = mergedKeyFrames;
  return animationPattern;
};

test(
  "Tested: getKeyFramesPastStartTimeSortedByTime:" +
    "Given the provided keyframes starttime are greater than the starttime," +
    "When I execute the function," +
    "Then I expect the returned keyframes to be sorted by time",
  () => {
    const animationPattern = getAnimationWithTwoKeyframes();
    const keyFrames = getKeyFramesPastStartTimeSortedByTime("scale", animationPattern, 0);

    const firstKeyFrame = keyFrames.at(0);
    const secondKeyFrame = keyFrames.at(1);

    expect(firstKeyFrame?.timeMs).toBe(100);
    expect(secondKeyFrame?.timeMs).toBe(200);
  }
);

test(
  "Tested: getKeyFramesPastStartTimeSortedByTime:" +
    "Given the provided keyframes starttime are lower than the starttime," +
    "When I execute the function," +
    "Then I expect the returned keyframes to be sorted by time descending",
  () => {
    const animationPattern = getAnimationWithTwoKeyframes();
    const keyFrames = getKeyFramesBeforeStartTimeSortedByTimeDescending("scale", animationPattern, 201);

    const firstKeyFrame = keyFrames.at(0);
    const secondKeyFrame = keyFrames.at(1);

    expect(firstKeyFrame?.timeMs).toBe(200);
    expect(secondKeyFrame?.timeMs).toBe(100);
  }
);

test(
  "Tested: getKeyFramesBeforeStartTimeSortedByTimeDescending:" +
    "Given the provided keyframe starttime are lower than the starttime," +
    "When I execute the function," +
    "Then I expect the returned keyframe starttime to be before the starttime",
  () => {
    const animationPattern = testAnimationPattern(0);
    const keyFrames = getKeyFramesBeforeStartTimeSortedByTimeDescending("scale", animationPattern, 100);
    const keyFrameTime = keyFrames.at(0)?.timeMs;

    expect(keyFrameTime).toBeLessThanOrEqual(100);
  }
);

test(
  "Tested: getKeyFramesBeforeStartTimeSortedByTimeDescending:" +
    "Given the provided keyframe starttime is greater than the starttime," +
    "When I execute the function," +
    "Then I expect an empty array",
  () => {
    const animationPattern = testAnimationPattern(100);
    const keyFrames = getKeyFramesBeforeStartTimeSortedByTimeDescending("scale", animationPattern, 0);
    expect(keyFrames).toStrictEqual([]);
  }
);

test(
  "Tested: getCurrentKeyFrame:" +
    "Given the provided keyframes starttime is equal to the starttime," +
    "When I execute the function," +
    "Then I expect the provided keyframes returned",
  () => {
    const animationPattern = testAnimationPattern(100);
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

    let animationPattern = testAnimationPattern(0);
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
