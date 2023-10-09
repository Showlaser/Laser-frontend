import { Animation, AnimationPattern, AnimationPatternKeyFrame } from "models/components/shared/animation";
import { Pattern } from "models/components/shared/pattern";
import { Point } from "models/components/shared/point";
import { propertiesSettings } from "services/logic/animation-logic";
import { createGuid } from "services/shared/math";

export const getPointsTestSet = (): Point[] => [
  {
    uuid: "test",
    patternUuid: "test",
    x: 1000,
    y: 0,
    redLaserPowerPwm: 0,
    greenLaserPowerPwm: 0,
    blueLaserPowerPwm: 0,
    connectedToPointOrderNr: 0,
    orderNr: 0,
  },
  {
    uuid: "test",
    patternUuid: "test",
    x: 0,
    y: 0,
    redLaserPowerPwm: 0,
    greenLaserPowerPwm: 0,
    blueLaserPowerPwm: 0,
    connectedToPointOrderNr: 0,
    orderNr: 1,
  },
  {
    uuid: "test",
    patternUuid: "test",
    x: 1000,
    y: 0,
    redLaserPowerPwm: 0,
    greenLaserPowerPwm: 0,
    blueLaserPowerPwm: 0,
    connectedToPointOrderNr: 0,
    orderNr: 2,
  },
];

type pointsTestSetParameters = { x: number; y: number };
export const generatePointsTestSet = (coordinates: pointsTestSetParameters[]): Point[] =>
  coordinates.map((coordinate, index) => ({
    uuid: "test",
    patternUuid: "test",
    x: coordinate.x,
    y: coordinate.y,
    redLaserPowerPwm: 0,
    greenLaserPowerPwm: 0,
    blueLaserPowerPwm: 0,
    connectedToPointOrderNr: 0,
    orderNr: index,
  }));

export const getTestAnimationPatternKeyFrames = (): AnimationPatternKeyFrame[] =>
  propertiesSettings.map((propertySetting) => ({
    uuid: createGuid(),
    timeMs: 0,
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

export const testAnimationPattern = (): AnimationPattern => {
  const animationPattern: AnimationPattern = new AnimationPattern();
  animationPattern.uuid = "4145ab82-6a79-48d1-8425-747a464a4940";
  animationPattern.name = "Test animation pattern";
  animationPattern.pattern = testPattern;
  animationPattern.animationKeyFrames = getTestAnimationPatternKeyFrames();
  animationPattern.startTimeMs = 0;
  animationPattern.timelineId = 0;

  return animationPattern;
};

export const testAnimation: Animation = {
  uuid: "cdef5b05-e8aa-44e3-8261-7619e90b0ef0",
  name: "Test animation",
  image: null,
  animationPatterns: [testAnimationPattern()],
};
