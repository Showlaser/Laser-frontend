import { LaserModel } from "./registered-laser";

export type UDPBroadcast = {
  uuid: string;
  ip: string;
  modelType: LaserModel.Version5;
};
