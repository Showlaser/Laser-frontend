export enum LaserStatus {
  Emitting,
  Standby,
  PoweredOff,
  EmergencyButtonPressed,
}

export const LaserHealth = {
  Overheating: "Overheating",
  Ok: "Ok",
  Unknown: "Unknown",
  DefectGalvo: "DefectGalvo",
};

type valueof<T> = T[keyof T];

export type LaserLog = {
  laserUuid: string;
  dateTime: Date;
  temperature: number;
  health: valueof<typeof LaserHealth>;
};

export type LaserInfo = {
  uuid: string;
  name: string;
  specs: string;
  status: LaserStatus;
  online: boolean;
  logs: LaserLog[];
};
