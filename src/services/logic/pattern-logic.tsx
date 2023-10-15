import { Get, Post, Delete } from "services/shared/api/api-actions";
import { sendRequest } from "services/shared/api/api-middleware";
import apiEndpoints from "services/shared/api/api-endpoints";
import { toastSubject } from "services/shared/toast-messages";
import { Pattern } from "models/components/shared/pattern";
import { mapNumber, numberIsBetweenOrEqual } from "services/shared/math";
import { Animation, AnimationPattern, AnimationPatternKeyFrame } from "models/components/shared/animation";
import { Point } from "models/components/shared/point";
import { applyParametersToPointsForCanvas } from "services/shared/converters";
import { propertiesSettings } from "./animation-logic";

export type PreviousCurrentAndNextKeyFramePerProperty = {
  previous: AnimationPatternKeyFrame[];
  current: AnimationPatternKeyFrame[];
  next: AnimationPatternKeyFrame[];
};

export const getPatterns = async (): Promise<Pattern[]> => {
  const value = await sendRequest(() => Get(apiEndpoints.pattern), [200]);
  return value?.json();
};

export const savePattern = (pattern: Pattern) => {
  return sendRequest(() => Post(apiEndpoints.pattern, pattern), [], toastSubject.changesSaved);
};

export const removePattern = (uuid: string) => {
  return sendRequest(() => Delete(`${apiEndpoints.pattern}/${uuid}`), [], toastSubject.changesSaved);
};

export const playPattern = (pattern: Pattern) => {
  return sendRequest(() => Post(apiEndpoints.pattern + "/play", pattern), []);
};

export const getAnimationPatternsInTimelineRange = (
  animation: Animation | null,
  startRange: number,
  endRange: number
) => animation?.animationPatterns.filter((ap) => numberIsBetweenOrEqual(ap.startTimeMs, startRange, endRange));

export const getKeyframesPastStartTimeSortedByTime = (
  property: string,
  animationPattern: AnimationPattern,
  starttime: number
) =>
  animationPattern?.animationKeyFrames
    .filter((ak: { timeMs: number; propertyEdited: string }) => ak.timeMs > starttime && ak.propertyEdited === property)
    .sort((a: { timeMs: number }, b: { timeMs: number }) => a.timeMs - b.timeMs);

export const getKeyframesBeforeStartTimeSortedByTimeDescending = (
  property: string,
  animationPattern: AnimationPattern,
  timelinePositionMs: number
) =>
  animationPattern?.animationKeyFrames
    .filter(
      (ak: { timeMs: number; propertyEdited: string }) =>
        ak.timeMs < timelinePositionMs && ak.propertyEdited === property
    )
    .sort((a: { timeMs: number }, b: { timeMs: number }) => b.timeMs - a.timeMs);

export const getCurrentKeyFrame = (selectedAnimationPattern: AnimationPattern, timelinePositionMs: number) =>
  selectedAnimationPattern?.animationKeyFrames.filter((ak: { timeMs: number }) => ak.timeMs === timelinePositionMs);

export const getPreviousCurrentAndNextKeyFrames = (
  animationPattern: AnimationPattern,
  timelinePositionMs: number
): PreviousCurrentAndNextKeyFramePerProperty => {
  let previousNextAndCurrentKeyFramePerProperty: PreviousCurrentAndNextKeyFramePerProperty = {
    previous: [],
    current: getCurrentKeyFrame(animationPattern, timelinePositionMs) ?? [],
    next: [],
  };

  propertiesSettings.forEach((propertySetting) => {
    const previous = getKeyframesBeforeStartTimeSortedByTimeDescending(
      propertySetting.property,
      animationPattern,
      timelinePositionMs
    )?.at(0);
    if (previous !== undefined) {
      previousNextAndCurrentKeyFramePerProperty.previous.push(previous);
    }

    const next = getKeyframesPastStartTimeSortedByTime(
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
  pattern: Pattern,
  previousNextAndCurrentKeyFrames: PreviousCurrentAndNextKeyFramePerProperty,
  timelinePositionMs: number
): Point[] => {
  if (pattern?.points === undefined) {
    return [];
  }

  let points: Point[] = [...pattern.points];
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
      : previousNextAndCurrentKeyFrames.previous.find((kf) => kf.propertyEdited === currentPropertySetting.property);

    const nextKeyFrame = previousNextAndCurrentKeyFrames.next.find(
      (kf) => kf.propertyEdited === currentPropertySetting.property
    );

    const valuesPerPropertyIndex = valuesPerProperty.findIndex(
      (vpp) => vpp.property === currentPropertySetting.property
    );
    if (valuesPerPropertyIndex !== -1 && previousKeyFrame !== undefined && nextKeyFrame !== undefined) {
      valuesPerProperty[valuesPerPropertyIndex].value = calculateNewValueByKeyFrames(
        previousKeyFrame,
        nextKeyFrame,
        timelinePositionMs
      );
    } else if (valuesPerPropertyIndex !== -1 && previousKeyFrame !== undefined) {
      valuesPerProperty[valuesPerPropertyIndex].value = previousKeyFrame.propertyValue;
    }
  }

  const scale = valuesPerProperty.find((vpp) => vpp.property === "scale")?.value ?? 1;
  const xOffset = valuesPerProperty.find((vpp) => vpp.property === "xOffset")?.value ?? 0;
  const yOffset = valuesPerProperty.find((vpp) => vpp.property === "yOffset")?.value ?? 0;
  const rotation = valuesPerProperty.find((vpp) => vpp.property === "rotation")?.value ?? 0;

  return applyParametersToPointsForCanvas(scale, xOffset, yOffset, rotation, [...points]);
};

const calculateNewValueByKeyFrames = (
  previousKeyFrame: AnimationPatternKeyFrame,
  nextKeyFrame: AnimationPatternKeyFrame,
  timelinePositionMs: number
) => {
  const newPropertyValue = mapNumber(
    timelinePositionMs,
    previousKeyFrame.timeMs,
    nextKeyFrame.timeMs,
    previousKeyFrame.propertyValue,
    nextKeyFrame.propertyValue
  );

  return newPropertyValue;
};
