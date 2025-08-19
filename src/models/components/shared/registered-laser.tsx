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
  uuid?: String;
  name?: String;
  modelType?: LaserModel;
  status?: LaserStatus;
  ipAddress?: String;
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
