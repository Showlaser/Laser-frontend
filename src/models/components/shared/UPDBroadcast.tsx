import { LaserModel, LaserStatus } from "./registered-laser";

export type UDPBroadcast = {
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
