import { Delete, Get, Post } from "services/shared/api/api-actions";
import { sendRequest } from "services/shared/api/api-middleware";
import apiEndpoints from "services/shared/api/api-endpoints";
import { createGuid } from "services/shared/math";
import { toastSubject } from "services/shared/toast-messages";

export async function getAnimations() {
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
    () => Delete(`${apiEndpoints.animation}/${uuid}`),
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
  selectedPattern.points = selectedPattern?.points?.sort((a, b) =>
    a.order > b.order ? 1 : -1
  );

  const points = selectedPattern?.points?.map((p, index) => ({
    uuid: createGuid(),
    patternAnimationSettingsUuid: settingsUuid,
    x: p.x,
    y: p.y,
    redLaserPowerPwm: p.redLaserPowerPwm,
    greenLaserPowerPwm: p.greenLaserPowerPwm,
    blueLaserPowerPwm: p.blueLaserPowerPwm,
    order: index,
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
    timeLineId: 0,
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

export const playAnimation = (animation) => {
  return sendRequest(
    () => Post(apiEndpoints.animation + "/play", animation),
    []
  );
};
