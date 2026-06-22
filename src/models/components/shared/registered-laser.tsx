export enum LaserModel {
  Version5,
}

export enum LaserStatus {
  Emitting = "Emitting",
  Standby = "Standby",
  EmergencyButtonPressed = "EmergencyButtonPressed",
  PendingConnection = "PendingConnection",
  ConnectionLost = "ConnectionLost",
  Defect = "Defect",
  NotConfigured = "NotConfigured",
}

export type RegisteredLaser = {
  uuid?: string;
  name?: string;
  modelType?: LaserModel;
  status?: LaserStatus;
  ipAddress?: string;
  maxPowerPerlaserInPercentage?: number;
  projectionTopInPercentage?: number;
  projectionBottomInPercentage?: number;
  projectionLeftInPercentage?: number;
  projectionRightInPercentage?: number;
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
