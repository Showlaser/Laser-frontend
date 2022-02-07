import { createGuid } from "./math";

export const getPointsPlaceHolder = (foreignKeyUuid) => {
  return {
    uuid: createGuid(),
    patternUuid: foreignKeyUuid,
    x: 0,
    y: 0,
    redLaserPowerPwm: 6,
    greenLaserPowerPwm: 0,
    blueLaserPowerPwm: 0,
  };
};
