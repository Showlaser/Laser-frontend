import { createGuid } from "./math";

export const getPointsPlaceHolder = (parentUuid: string, index: number) => {
  return {
    uuid: createGuid(),
    patternUuid: parentUuid,
    patternAnimationSettingsUuid: parentUuid,
    zoneUuid: parentUuid,
    x: 0,
    y: 0,
    redLaserPowerPwm: 6,
    greenLaserPowerPwm: 0,
    blueLaserPowerPwm: 0,
    order: index,
  };
};
