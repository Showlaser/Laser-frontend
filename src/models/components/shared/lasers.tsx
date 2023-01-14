export enum LaserStatus {
  Emitting,
  Standby,
  PoweredOff,
  EmergencyButtonPressed,
}

export enum LaserHealth {
  Overheating,
  Ok,
  Unknown,
  DefectGalvo,
}

export type LaserLog = {
  laserUuid: string;
  dateTime: Date;
  temperature: number;
  health: LaserHealth;
};

export type LaserInfo = {
  uuid: string;
  name: string;
  specs: string;
  status: LaserStatus;
  online: boolean;
  logs: LaserLog[];
};
