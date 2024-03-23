import { Lasershow } from "models/components/shared/lasershow";
import { Delete, Get, Post } from "services/shared/api/api-actions";
import apiEndpoints from "services/shared/api/api-endpoints";
import { sendRequest } from "services/shared/api/api-middleware";
import { toastSubject } from "services/shared/toast-messages";
import { getAnimationDuration } from "./animation-logic";
import { numberIsBetweenOrEqual } from "services/shared/math";

export const getLasershows = async (): Promise<Response | undefined> =>
  sendRequest(() => Get(apiEndpoints.lasershow), []);

export const saveLasershow = async (lasershow: Lasershow) =>
  await sendRequest(() => Post(apiEndpoints.lasershow, lasershow), [], toastSubject.changesSaved);

export const removeLasershow = async (uuid: string) =>
  sendRequest(() => Delete(`${apiEndpoints.lasershow}/${uuid}`), [], toastSubject.changesSaved);

export const playLasershow = async (lasershow: Lasershow) =>
  sendRequest(() => Post(apiEndpoints.lasershow + "/play", lasershow), []);

export const getLasershowAnimationsToDrawInTimeline = (
  lasershow: Lasershow | null,
  timelinePositionMs: number,
  stepsToDrawMaxRange: number
) => {
  return lasershow?.lasershowAnimations?.filter((la) => {
    const animationStartsBeforeTimeline = la.startTimeMs < timelinePositionMs;
    const animationEndsAfterStepsToDraw = la.startTimeMs + getAnimationDuration(la.animation) > stepsToDrawMaxRange;
    const animationStartsInTimelineRange = numberIsBetweenOrEqual(
      la.startTimeMs,
      timelinePositionMs,
      stepsToDrawMaxRange
    );

    const patternEndsInTimelineRange = numberIsBetweenOrEqual(
      la.startTimeMs + getAnimationDuration(la.animation),
      timelinePositionMs,
      stepsToDrawMaxRange
    );

    return (
      (animationStartsBeforeTimeline && animationEndsAfterStepsToDraw) ||
      (animationStartsInTimelineRange && animationEndsAfterStepsToDraw) ||
      (animationStartsInTimelineRange && patternEndsInTimelineRange) ||
      (animationStartsBeforeTimeline && patternEndsInTimelineRange)
    );
  });
};

export const getLasershowDuration = (lasershow: Lasershow | null) => {
  const times = lasershow?.lasershowAnimations.map((la) => getAnimationDuration(la.animation));
  if (times === undefined) {
    return 0;
  }

  return Math.max(...times);
};
