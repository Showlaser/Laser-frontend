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
  const timelineSettingsUuid = createGuid();
  const points = selectedPattern?.points?.map((p) => ({
    uuid: p.uuid,
    timelineSettingsUuid,
    x: p.x,
    y: p.x,
    redLaserPowerPwm: 6,
    greenLaserPowerPwm: 0,
    blueLaserPowerPwm: 0,
  }));

  let startTimeOffset = 0;
  while (
    selectedAnimation.patternAnimations.some(
      (pa) => pa.startTimeOffset === startTimeOffset
    )
  ) {
    startTimeOffset += 25;
  }

  return {
    uuid: patternAnimationUuid,
    animationUuid: selectedAnimation?.uuid,
    name: selectedPattern.name,
    startTimeOffset,
    animationSettings: [
      {
        uuid: timelineSettingsUuid,
        patternAnimationUuid: patternAnimationUuid,
        scale: 0.5,
        centerX: 0,
        centerY: 0,
        points,
        startTime: 0,
      },
    ],
    timelineId: 0,
  };
};
