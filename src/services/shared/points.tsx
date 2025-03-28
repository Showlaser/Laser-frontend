import { Point } from "models/components/shared/point";
import { createGuid, emptyGuid } from "./math";

export const getPointsPlaceHolder = (
  parentUuid: string,
  orderNr: number
): Point => {
  return {
    uuid: createGuid(),
    patternUuid: parentUuid,
    redLaserPowerPwm: 255,
    greenLaserPowerPwm: 255,
    blueLaserPowerPwm: 255,
    connectedToPointUuid: emptyGuid,
    orderNr,
    x: 0,
    y: 0,
  };
};
