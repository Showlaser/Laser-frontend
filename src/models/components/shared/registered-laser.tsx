export enum LaserStatus {
  Emitting,
  Standby,
  PoweredOff,
  EmergencyButtonPressed,
  PendingConnection,
  ConnectionLost,
}

export enum LaserModel {
  Version5,
}

export type RegisteredLaser = {
  uuid?: string;
  name?: string;
  modelType?: LaserModel;
  status?: LaserStatus;
  ipAddress?: string;
};

export const getRegisteredLaserPlaceholder = (): RegisteredLaser => {
  return {
    uuid: "",
    name: "",
    modelType: LaserModel.Version5,
    status: LaserStatus.PendingConnection,
    ipAddress: "",
  };
};
