export type Point = {
  uuid: string;
  patternUuid: string;
  redLaserPowerPwm: number;
  greenLaserPowerPwm: number;
  blueLaserPowerPwm: number;
  connectedToPointUuid: string;
  orderNr: number;
  x: number;
  y: number;
};
