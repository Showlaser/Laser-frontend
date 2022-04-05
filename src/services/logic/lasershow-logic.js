import { Delete, Get, Post } from "services/shared/api/api-actions";
import { sendRequest } from "services/shared/api/api-middleware";
import apiEndpoints from "services/shared/api/api-urls";
import { createGuid } from "services/shared/math";
import { toastSubject } from "services/shared/toast-messages";

export function getLasershows() {
  return sendRequest(() => Get(apiEndpoints.lasershow), []).then((value) =>
    value.json()
  );
}

export const playLasershow = (lasershow) => {
  return sendRequest(
    () => Post(apiEndpoints.lasershow + "/play", lasershow),
    []
  );
};

export const saveLasershow = (lasershow) => {
  return sendRequest(
    () => Post(apiEndpoints.lasershow, lasershow),
    [],
    toastSubject.changesSaved
  );
};

export const removeLasershow = (uuid) => {
  return sendRequest(
    () => Delete(`${apiEndpoints.lasershow}/${uuid}`),
    [],
    toastSubject.changesSaved
  );
};

export function getLasershowAnimationPlaceHolder(
  selectedLasershow,
  selectedAnimation
) {
  const uuid = createGuid();

  return {
    uuid,
    lasershowUuid: selectedLasershow.uuid,
    name: selectedAnimation?.name,
    startTime: 0,
    timeLineId: 0,
    animation: selectedAnimation,
  };
}
