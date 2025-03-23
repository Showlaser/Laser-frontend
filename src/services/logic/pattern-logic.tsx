import {
  Animation,
  AnimationPattern,
  AnimationPatternKeyFrame,
  AnimationProperty,
  getAnimationPatternDuration,
} from "models/components/shared/animation";
import { Pattern } from "models/components/shared/pattern";
import { Point } from "models/components/shared/point";
import { Delete, Get, Post } from "services/shared/api/api-actions";
import apiEndpoints from "services/shared/api/api-endpoints";
import { sendRequest } from "services/shared/api/api-middleware";
import { applyParametersToPointsForCanvas } from "services/shared/converters";
import { mapNumber, numberIsBetweenOrEqual } from "services/shared/math";
import { toastSubject } from "services/shared/toast-messages";
import { propertiesSettings } from "./animation-logic";

export type PreviousCurrentAndNextKeyFramePerProperty = {
  previous: AnimationPatternKeyFrame[];
  current: AnimationPatternKeyFrame[];
  next: AnimationPatternKeyFrame[];
};

export const getPatterns = async (): Promise<Pattern[]> => {
  const result = await sendRequest(() => Get(apiEndpoints.pattern), [200]);
  if (result?.status === 200) {
    return result?.json();
  }

  return [];
};

export const savePattern = (pattern: Pattern) => {
  return sendRequest(() => Post(apiEndpoints.pattern, pattern), [], toastSubject.changesSaved);
};

export const removePattern = (uuid: string) => {
  return sendRequest(
    () => Delete(`${apiEndpoints.pattern}/${uuid}`),
    [],
    toastSubject.changesSaved
  );
};

export const playPattern = (pattern: Pattern) => {
  return sendRequest(() => Post(apiEndpoints.pattern + "/play", pattern), []);
};

export const getAnimationPatternsInsideTimelineRange = (
  animation: Animation | null,
  startRange: number,
  endRange: number
) =>
  animation?.animationPatterns.filter((ap) =>
    numberIsBetweenOrEqual(ap.startTimeMs, startRange, endRange)
  );

export const getAnimationPatternsToDrawInTimeline = (
  animation: Animation | null,
  timelinePositionMs: number,
  stepsToDrawMaxRange: number
) => {
  return animation?.animationPatterns?.filter((ap) => {
    const patternStartsBeforeTimeline = ap.startTimeMs < timelinePositionMs;
    const patternEndsAfterStepsToDraw =
      ap.startTimeMs + getAnimationPatternDuration(ap) > stepsToDrawMaxRange;
    const patternStartsInTimelineRange = numberIsBetweenOrEqual(
      ap.startTimeMs,
      timelinePositionMs,
      stepsToDrawMaxRange
    );

    const patternEndsInTimelineRange = numberIsBetweenOrEqual(
      ap.startTimeMs + getAnimationPatternDuration(ap),
      timelinePositionMs,
      stepsToDrawMaxRange
    );

    return (
      (patternStartsBeforeTimeline && patternEndsAfterStepsToDraw) ||
      (patternStartsInTimelineRange && patternEndsAfterStepsToDraw) ||
      (patternStartsInTimelineRange && patternEndsInTimelineRange) ||
      (patternStartsBeforeTimeline && patternEndsInTimelineRange)
    );
  });
};

export const getKeyFramesPastTimelinePositionSortedByTime = (
  property: AnimationProperty,
  animationPattern: AnimationPattern,
  timelinePositionMs: number
) =>
  animationPattern?.animationPatternKeyFrames
    .filter(
      (ak: { timeMs: number; propertyEdited: AnimationProperty }) =>
        ak.timeMs + animationPattern.startTimeMs > timelinePositionMs &&
        ak.propertyEdited === property
    )
    .sort((a: { timeMs: number }, b: { timeMs: number }) => a.timeMs - b.timeMs);

export const getKeyFramesBeforeTimelinePositionSortedByTimeDescending = (
  property: AnimationProperty,
  animationPattern: AnimationPattern,
  timelinePositionMs: number
) => {
  return animationPattern?.animationPatternKeyFrames
    .filter((ak: { timeMs: number; propertyEdited: AnimationProperty }) => {
      return (
        ak.timeMs + animationPattern.startTimeMs < timelinePositionMs &&
        ak.propertyEdited === property
      );
    })
    .sort((a: { timeMs: number }, b: { timeMs: number }) => b.timeMs - a.timeMs);
};

export const getCurrentKeyFrame = (
  selectedAnimationPattern: AnimationPattern,
  timelinePositionMs: number
) =>
  selectedAnimationPattern?.animationPatternKeyFrames.filter(
    (ak: { timeMs: number }) =>
      ak.timeMs + selectedAnimationPattern.startTimeMs === timelinePositionMs
  );

export const getPreviousCurrentAndNextKeyFramePerProperty = (
  animationPattern: AnimationPattern,
  timelinePositionMs: number
): PreviousCurrentAndNextKeyFramePerProperty => {
  let previousNextAndCurrentKeyFramePerProperty: PreviousCurrentAndNextKeyFramePerProperty = {
    previous: [],
    current: getCurrentKeyFrame(animationPattern, timelinePositionMs) ?? [],
    next: [],
  };

  propertiesSettings.forEach((propertySetting) => {
    const previous = getKeyFramesBeforeTimelinePositionSortedByTimeDescending(
      propertySetting.property,
      animationPattern,
      timelinePositionMs
    )?.at(0);
    if (previous !== undefined) {
      previousNextAndCurrentKeyFramePerProperty.previous.push(previous);
    }

    const next = getKeyFramesPastTimelinePositionSortedByTime(
      propertySetting.property,
      animationPattern,
      timelinePositionMs
    )?.at(0);
    if (next !== undefined) {
      previousNextAndCurrentKeyFramePerProperty.next.push(next);
    }
  });

  return previousNextAndCurrentKeyFramePerProperty;
};

export const getPatternPointsByTimelinePosition = (
  animationPattern: AnimationPattern,
  previousNextAndCurrentKeyFrames: PreviousCurrentAndNextKeyFramePerProperty,
  timelinePositionMs: number,
  convertValuesFromPointsDrawer?: boolean
): Point[] => {
  if (animationPattern?.pattern?.points === undefined) {
    return [];
  }

  let points: Point[] = [...animationPattern.pattern.points];
  let valuesPerProperty = propertiesSettings.map((propertiesSetting) => ({
    property: propertiesSetting.property,
    value: propertiesSetting.defaultValue,
  }));

  const propertiesSettingsLength = propertiesSettings.length;
  for (let i = 0; i < propertiesSettingsLength; i++) {
    const currentPropertySetting = propertiesSettings[i];
    const currentKeyFrame = previousNextAndCurrentKeyFrames.current.find(
      (kf) => kf.propertyEdited === currentPropertySetting.property
    );

    const currentKeyFrameIsAvailable = currentKeyFrame !== undefined;
    const previousKeyFrame = currentKeyFrameIsAvailable
      ? currentKeyFrame
      : previousNextAndCurrentKeyFrames.previous.find(
          (kf) => kf.propertyEdited === currentPropertySetting.property
        );

    const nextKeyFrame = previousNextAndCurrentKeyFrames.next.find(
      (kf) => kf.propertyEdited === currentPropertySetting.property
    );

    const valuesPerPropertyIndex = valuesPerProperty.findIndex(
      (vpp) => vpp.property === currentPropertySetting.property
    );
    if (
      valuesPerPropertyIndex !== -1 &&
      previousKeyFrame !== undefined &&
      nextKeyFrame !== undefined
    ) {
      valuesPerProperty[valuesPerPropertyIndex].value = calculateNewValueByKeyFrames(
        animationPattern,
        previousKeyFrame,
        nextKeyFrame,
        timelinePositionMs
      );
    } else if (valuesPerPropertyIndex !== -1 && previousKeyFrame !== undefined) {
      valuesPerProperty[valuesPerPropertyIndex].value = previousKeyFrame.propertyValue;
    }
  }

  const getDefaultPropertyValue = (property: AnimationProperty) =>
    propertiesSettings.find((p) => p.property === property)?.defaultValue ?? 0;

  const scale =
    valuesPerProperty.find((vpp) => vpp.property === AnimationProperty.scale)?.value ??
    getDefaultPropertyValue(AnimationProperty.scale);
  const xOffset =
    valuesPerProperty.find((vpp) => vpp.property === AnimationProperty.xOffset)?.value ??
    getDefaultPropertyValue(AnimationProperty.xOffset);
  const yOffset =
    valuesPerProperty.find((vpp) => vpp.property === AnimationProperty.yOffset)?.value ??
    getDefaultPropertyValue(AnimationProperty.yOffset);
  const rotation =
    valuesPerProperty.find((vpp) => vpp.property === AnimationProperty.rotation)?.value ??
    getDefaultPropertyValue(AnimationProperty.rotation);

  return applyParametersToPointsForCanvas(
    scale,
    xOffset,
    yOffset,
    rotation,
    [...points],
    convertValuesFromPointsDrawer
  );
};

const calculateNewValueByKeyFrames = (
  animationPattern: AnimationPattern,
  previousKeyFrame: AnimationPatternKeyFrame,
  nextKeyFrame: AnimationPatternKeyFrame,
  timelinePositionMs: number
) => {
  const newPropertyValue = mapNumber(
    timelinePositionMs,
    previousKeyFrame.timeMs + animationPattern.startTimeMs,
    nextKeyFrame.timeMs + +animationPattern.startTimeMs,
    previousKeyFrame.propertyValue,
    nextKeyFrame.propertyValue
  );

  return newPropertyValue;
};
