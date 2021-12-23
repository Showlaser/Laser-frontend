import { Get } from "services/shared/api/api-actions";
import { sendRequest } from "services/shared/api/api-middleware";
import apiEndpoints from "services/shared/api/api-urls";
import { createGuid } from "services/shared/math";

export const getCircleTemplate = () => {
  const dotsPerCircle = 30;
  const interval = (Math.PI * 2) / dotsPerCircle;
  const radius = 4000;

  let points = [];

  for (let i = dotsPerCircle; i > 0; i--) {
    const desiredRadianAngleOnCircle = interval * i;
    const x = Math.round(radius * Math.cos(desiredRadianAngleOnCircle));
    const y = Math.round(radius * Math.sin(desiredRadianAngleOnCircle));
    points.push({
      uuid: createGuid(),
      x,
      y,
      connectedToUuid: null,
    });
  }

  return { points, scale: 1 };
};

export const patternPlaceHolders = {
  Circle: {
    scale: 1,
    points: [
      {
        uuid: createGuid(),
        x: -4000,
        y: 4000,
        connectedToUuid: null,
      },
      {
        uuid: createGuid(),
        x: 4000,
        y: 4000,
        connectedToUuid: null,
      },
      {
        uuid: createGuid(),
        x: 4000,
        y: -4000,
        connectedToUuid: null,
      },
      {
        uuid: createGuid(),
        x: -4000,
        y: -4000,
        connectedToUuid: null,
      },
    ],
  },
};

export const getPatterns = () => {
  return sendRequest(() => Get(apiEndpoints.pattern), [200]).then((value) =>
    value.json()
  );
};
