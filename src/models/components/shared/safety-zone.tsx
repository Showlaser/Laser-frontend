import { createGuid } from "services/shared/math";

export type SafetyZone = {
  uuid: string;
  name: string;
  appliedOnShowLaserUuid: string;
  description: string;
  maxLaserPowerInZonePercentage: number;
  points: SafetyZonePoint[];
};

export type SafetyZonePoint = {
  uuid: string;
  safetyZoneUuid: string;
  x: number;
  y: number;
  orderNr: number;
};

export const getSafetyZonePointsPlaceHolder = (safetyZoneUuid: string, orderNr: number): SafetyZonePoint => {
  return {
    uuid: createGuid(),
    safetyZoneUuid,
    orderNr,
    x: 0,
    y: 0,
  };
};
