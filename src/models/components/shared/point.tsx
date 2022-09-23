export type Point = {
  uuid: string;
  patternUuid: string;
  redLaserPowerPwm: number;
  greenLaserPowerPwm: number;
  blueLaserPowerPwm: number;
  connectedToPointOrderNr: number | null;
  orderNr: number;
  x: number;
  y: number;
};
