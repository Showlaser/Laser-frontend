import { createGuid } from "./math";

export const getPointsPlaceHolder = (patternUuid, index) => {
  return {
    uuid: createGuid(),
    PatternAnimationSettingsUuid: patternUuid,
    x: 0,
    y: 0,
    redLaserPowerPwm: 6,
    greenLaserPowerPwm: 0,
    blueLaserPowerPwm: 0,
    order: index,
  };
};
