import { Delete, Get, Post } from "services/shared/api/api-actions";
import { sendRequest } from "services/shared/api/api-middleware";
import apiEndpoints from "services/shared/api/api-urls";
import { createGuid } from "services/shared/math";
import { toastSubject } from "services/shared/toast-messages";

export function getAnimations() {
  return sendRequest(() => Get(apiEndpoints.animation), []).then((value) =>
    value.json()
  );
}

export const saveAnimation = (animation) => {
  return sendRequest(
    () => Post(apiEndpoints.animation, animation),
    [],
    toastSubject.changesSaved
  );
};

export const removeAnimation = (uuid) => {
  return sendRequest(
    () => Delete(apiEndpoints.animation + uuid),
    [],
    toastSubject.changesSaved
  );
};

export const getPatternAnimationPlaceholder = (
  selectedPattern,
  selectedAnimation
) => {
  const patternAnimationUuid = createGuid();
  const settingsUuid = createGuid();
  const points = selectedPattern?.points?.map((p) => ({
    uuid: p.uuid,
    timelineSettingsUuid: settingsUuid,
    x: p.x,
    y: p.x,
    redLaserPowerPwm: 6,
    greenLaserPowerPwm: 0,
    blueLaserPowerPwm: 0,
  }));

  const lastItemInTimeline = selectedAnimation.patternAnimations
    .filter((pa) => pa?.timelineId === 0)
    ?.at(-1);
  const startTimeOffset =
    lastItemInTimeline !== undefined
      ? lastItemInTimeline?.startTimeOffset + 50
      : 0;

  return {
    uuid: patternAnimationUuid,
    animationUuid: selectedAnimation?.uuid,
    name: selectedPattern.name,
    startTimeOffset,
    animationSettings: [
      getPatternAnimationSettingsPlaceholder(
        settingsUuid,
        patternAnimationUuid,
        points
      ),
    ],
    timelineId: 0,
  };
};

export const getPatternAnimationSettingsPlaceholder = (
  settingsUuid,
  patternAnimationUuid,
  points
) => {
  return {
    uuid: settingsUuid,
    patternAnimationUuid: patternAnimationUuid,
    scale: 0.5,
    centerX: 0,
    centerY: 0,
    points,
    startTime: 0,
  };
};
