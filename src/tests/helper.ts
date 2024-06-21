import { Animation, AnimationPattern, AnimationPatternKeyFrame } from "models/components/shared/animation";
import { Lasershow, LasershowAnimation } from "models/components/shared/lasershow";
import { Pattern } from "models/components/shared/pattern";
import { Point } from "models/components/shared/point";
import { propertiesSettings } from "services/logic/animation-logic";
import { createGuid } from "services/shared/math";

export const getPointsTestSet = (): Point[] => [
  {
    uuid: "72398da6-61a3-42f9-8225-473508a012c5",
    patternUuid: "a4db904a-220a-4d99-86b4-194e8eb72f4d",
    x: -1000,
    y: 0,
    redLaserPowerPwm: 0,
    greenLaserPowerPwm: 0,
    blueLaserPowerPwm: 0,
    connectedToPointUuid: null,
    orderNr: 0,
  },
  {
    uuid: "a69a1169-4a7a-49e7-bbce-7a112a7ef947",
    patternUuid: "a4db904a-220a-4d99-86b4-194e8eb72f4d",
    x: 0,
    y: 0,
    redLaserPowerPwm: 0,
    greenLaserPowerPwm: 0,
    blueLaserPowerPwm: 0,
    connectedToPointUuid: null,
    orderNr: 1,
  },
  {
    uuid: "cdf38e59-fdf1-4d28-a54f-f38edf79cf46",
    patternUuid: "a4db904a-220a-4d99-86b4-194e8eb72f4d",
    x: 1000,
    y: 0,
    redLaserPowerPwm: 0,
    greenLaserPowerPwm: 0,
    blueLaserPowerPwm: 0,
    connectedToPointUuid: null,
    orderNr: 2,
  },
];

export const generatePointsTestSet = (coordinates: { x: number; y: number }[]): Point[] =>
  coordinates.map((coordinate, index) => ({
    uuid: "test",
    patternUuid: "a4db904a-220a-4d99-86b4-194e8eb72f4d",
    x: coordinate.x,
    y: coordinate.y,
    redLaserPowerPwm: 0,
    greenLaserPowerPwm: 0,
    blueLaserPowerPwm: 0,
    connectedToPointUuid: null,
    orderNr: index,
  }));

export const getTestAnimationPatternKeyFrames = (keyframesStartTime: number): AnimationPatternKeyFrame[] =>
  propertiesSettings.map((propertySetting) => ({
    uuid: createGuid(),
    animationPatternUuid: "10254bbb-fbea-476b-9c85-7ad05185fa71",
    timeMs: keyframesStartTime,
    propertyEdited: propertySetting.property,
    propertyValue: propertySetting.defaultValue,
  }));

export const testPattern: Pattern = {
  uuid: "a4db904a-220a-4d99-86b4-194e8eb72f4d",
  name: "Test pattern",
  image: null,
  points: getPointsTestSet(),
  scale: 1,
  xOffset: 0,
  yOffset: 0,
  rotation: 0,
};

export const testAnimationPattern = (
  patternStartTime: number,
  keyframesStartTime: number,
  animationDuration: number
): AnimationPattern => {
  let animationPattern: AnimationPattern = {
    uuid: "4145ab82-6a79-48d1-8425-747a464a4940",
    patternUuid: testPattern.uuid,
    animationUuid: "cdef5b05-e8aa-44e3-8261-7619e90b0ef0",
    name: "Test animation pattern",
    pattern: testPattern,
    startTimeMs: patternStartTime,
    animationPatternKeyFrames: getTestAnimationPatternKeyFrames(keyframesStartTime),
    timelineId: 0,
  };

  if (animationDuration > 0) {
    const endKeyframes = getTestAnimationPatternKeyFrames(animationDuration);
    animationPattern.animationPatternKeyFrames = animationPattern.animationPatternKeyFrames.concat(endKeyframes);
  }

  return animationPattern;
};

export const testAnimation = (
  patternStartTime: number,
  keyframesStartTime: number,
  animationDuration: number
): Animation => {
  return {
    uuid: "cdef5b05-e8aa-44e3-8261-7619e90b0ef0",
    name: "Test animation",
    image: null,
    animationPatterns: [testAnimationPattern(patternStartTime, keyframesStartTime, animationDuration)],
  };
};

export const testLasershowAnimation = (startTimeMs: number, animationDuration: number): LasershowAnimation => {
  return {
    uuid: "3bd7badd-c3b1-4f95-bd30-553f7fd66753",
    lasershowUuid: "5c7a1e06-33f5-4f93-bae6-8c0cbb7cc4c4",
    animationUuid: "cdef5b05-e8aa-44e3-8261-7619e90b0ef0",
    name: "Test lasershow animation",
    animation: testAnimation(0, 0, animationDuration),
    startTimeMs,
    timelineId: 0,
  };
};

export const testLasershow = (startTimeMs: number, animationDuration: number): Lasershow => {
  return {
    uuid: "826d257c-48df-4e4d-bd1f-627ff98ce8e2",
    name: "Test lasershow",
    image: "",
    lasershowAnimations: [testLasershowAnimation(startTimeMs, animationDuration)],
  };
};
