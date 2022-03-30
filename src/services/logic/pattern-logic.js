import { Get, Post, Delete } from "services/shared/api/api-actions";
import { sendRequest } from "services/shared/api/api-middleware";
import apiEndpoints from "services/shared/api/api-urls";
import { createGuid } from "services/shared/math";
import { toastSubject } from "services/shared/toast-messages";

export const getCircleTemplate = () => {
  const dotsPerCircle = 30;
  const interval = (Math.PI * 2) / dotsPerCircle;
  const radius = 4000;

  let points = [];
  const uuid = createGuid();
  let iterations = 0;

  for (let i = dotsPerCircle; i > 0; i--) {
    const desiredRadianAngleOnCircle = interval * i;
    const x = Math.round(radius * Math.cos(desiredRadianAngleOnCircle));
    const y = Math.round(radius * Math.sin(desiredRadianAngleOnCircle));
    points.push({
      uuid: createGuid(),
      patternUuid: uuid,
      x,
      y,
      redLaserPowerPwm: 6,
      greenLaserPowerPwm: 0,
      blueLaserPowerPwm: 0,
      order: iterations,
    });

    iterations++;
  }

  return { points, scale: 1, name: "Circle", uuid };
};

export const getPatternPlaceHolder = () => {
  const uuid = createGuid();
  return {
    scale: 1,
    name: null,
    uuid,
    points: [
      {
        uuid: createGuid(),
        patternUuid: uuid,
        x: 0,
        y: 0,
        redLaserPowerPwm: 6,
        greenLaserPowerPwm: 0,
        blueLaserPowerPwm: 0,
        order: 0,
      },
    ],
  };
};

export const getPatterns = () => {
  return sendRequest(() => Get(apiEndpoints.pattern), [200]).then((value) =>
    value.json()
  );
};

export const savePattern = (pattern) => {
  return sendRequest(
    () => Post(apiEndpoints.pattern, pattern),
    [],
    toastSubject.changesSaved
  );
};

export const removePattern = (uuid) => {
  return sendRequest(
    () => Delete(apiEndpoints.pattern + uuid),
    [],
    toastSubject.changesSaved
  );
};

export const playPattern = (pattern) => {
  return sendRequest(() => Post(apiEndpoints.pattern + "/play", pattern), []);
};
