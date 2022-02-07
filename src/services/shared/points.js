import { createGuid } from "./math";

export const getPointsPlaceHolder = (patternUuid) => {
  return {
    uuid: createGuid(),
    patternUuid,
    x: 0,
    y: 0,
    redLaserPowerPwm: 6,
    greenLaserPowerPwm: 0,
    blueLaserPowerPwm: 0,
  };
};
