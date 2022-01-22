import { Delete, Get, Post } from "services/shared/api/api-actions";
import { sendRequest } from "services/shared/api/api-middleware";
import apiEndpoints from "services/shared/api/api-urls";
import { createGuid } from "services/shared/math";
import { toastSubject } from "services/shared/toast-messages";

export function getAnimations() {
  return sendRequest(() => Get(apiEndpoints.animation), []);
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

export const getAnimationTimelinePlaceholder = (
  selectedPattern,
  selectedAnimation
) => {
  const animationTimelineUuid = createGuid();
  const timelineSettingsUuid = createGuid();
  const points = selectedPattern?.points?.map((p) => ({
    uuid: p.uuid,
    timelineSettingsUuid,
    x: p.x,
    y: p.x,
  }));

  return {
    uuid: animationTimelineUuid,
    animationUuid: selectedAnimation?.uuid,
    settings: {
      uuid: timelineSettingsUuid,
      animationTimelineUuid: animationTimelineUuid,
      scale: 0.5,
      centerX: 0,
      centerY: 0,
      points,
      startTime: 0,
    },
  };
};
