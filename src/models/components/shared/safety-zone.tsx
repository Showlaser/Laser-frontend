import { Point } from "./point";

export type SafetyZone = {
  uuid: string;
  name: string;
  description: string;
  enabled: boolean;
  maxLaserPowerInZonePwm: number;
  points: Point[];
};

export type SafetyZonePoint = {
  uuid: string;
  safetyZoneUuid: string;
  x: number;
  y: number;
  orderNr: number;
};
