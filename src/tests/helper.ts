import { Point } from "models/components/shared/point";

export const getPointsTestSet = (): Point[] => [
  {
    uuid: "test",
    patternUuid: "test",
    x: 1000,
    y: 0,
    redLaserPowerPwm: 0,
    greenLaserPowerPwm: 0,
    blueLaserPowerPwm: 0,
    connectedToPointOrderNr: 0,
    orderNr: 0,
  },
  {
    uuid: "test",
    patternUuid: "test",
    x: 0,
    y: 0,
    redLaserPowerPwm: 0,
    greenLaserPowerPwm: 0,
    blueLaserPowerPwm: 0,
    connectedToPointOrderNr: 0,
    orderNr: 1,
  },
  {
    uuid: "test",
    patternUuid: "test",
    x: 1000,
    y: 0,
    redLaserPowerPwm: 0,
    greenLaserPowerPwm: 0,
    blueLaserPowerPwm: 0,
    connectedToPointOrderNr: 0,
    orderNr: 2,
  },
];

type pointsTestSetParameters = { x: number; y: number };
export const generatePointsTestSet = (coordinates: pointsTestSetParameters[]): Point[] =>
  coordinates.map((coordinate, index) => ({
    uuid: "test",
    patternUuid: "test",
    x: coordinate.x,
    y: coordinate.y,
    redLaserPowerPwm: 0,
    greenLaserPowerPwm: 0,
    blueLaserPowerPwm: 0,
    connectedToPointOrderNr: 0,
    orderNr: index,
  }));
