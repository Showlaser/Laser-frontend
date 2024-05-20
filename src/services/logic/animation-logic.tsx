import { Delete, Get, Post } from "services/shared/api/api-actions";
import { sendRequest } from "services/shared/api/api-middleware";
import apiEndpoints from "services/shared/api/api-endpoints";
import { toastSubject } from "services/shared/toast-messages";
import { Animation, getAnimationPatternDuration } from "models/components/shared/animation";
import { Point } from "models/components/shared/point";
import { numberIsBetweenOrEqual } from "services/shared/math";
import { getPreviousCurrentAndNextKeyFramePerProperty, getPatternPointsByTimelinePosition } from "./pattern-logic";

export const getAnimations = async (): Promise<Animation[] | undefined> => {
  const result = await sendRequest(() => Get(apiEndpoints.animation), []);
  if (result?.status === 200) {
    return (await result?.json()) as Animation[];
  }

  return undefined;
};

export const saveAnimation = async (animation: Animation) =>
  await sendRequest(() => Post(apiEndpoints.animation, animation), [], toastSubject.changesSaved);

export const removeAnimation = async (uuid: string) =>
  sendRequest(() => Delete(`${apiEndpoints.animation}/${uuid}`), [], toastSubject.changesSaved);

export const playAnimation = async (animation: Animation) =>
  sendRequest(() => Post(apiEndpoints.animation + "/play", animation), []);

export const propertiesSettings = [
  {
    property: "scale",
    type: "float",
    defaultValue: 1,
    min: 0.1,
    max: 10,
  },
  {
    property: "xOffset",
    type: "int",
    defaultValue: 0,
    min: -200,
    max: 200,
  },
  {
    property: "yOffset",
    type: "int",
    defaultValue: 0,
    min: -200,
    max: 200,
  },
  {
    property: "rotation",
    type: "int",
    defaultValue: 0,
    min: -360,
    max: 360,
  },
];

export const getAnimationDuration = (animation: Animation | null) => {
  if (animation === null) {
    return 0;
  }

  const times = animation?.animationPatterns.map((ap) => ap.startTimeMs + getAnimationPatternDuration(ap));
  if (times === undefined) {
    return 0;
  }

  return Math.max(...times);
};

export const getPointsToDrawFromAnimation = (timelinePositionMs: number, animation: Animation | null): Point[] => {
  const animationPatternsToPlay = animation?.animationPatterns.filter((ap) =>
    numberIsBetweenOrEqual(timelinePositionMs, ap.startTimeMs, getAnimationPatternDuration(ap) + ap.startTimeMs)
  );
  const animationPatternsToPlayLength = animationPatternsToPlay?.length ?? 0;
  if (animationPatternsToPlayLength === 0 || animationPatternsToPlay === undefined) {
    return [];
  }

  let points: Point[] = [];
  for (let i = 0; i < animationPatternsToPlayLength; i++) {
    const animationPattern = animationPatternsToPlay[i];
    if (animationPattern.pattern === undefined) {
      return [];
    }

    const previousCurrentAndNextKeyFrames = getPreviousCurrentAndNextKeyFramePerProperty(
      animationPattern,
      timelinePositionMs
    );
    const patternPoints = getPatternPointsByTimelinePosition(
      animationPattern.pattern,
      previousCurrentAndNextKeyFrames,
      timelinePositionMs
    );

    points = points.concat(patternPoints);
  }

  return points;
};
