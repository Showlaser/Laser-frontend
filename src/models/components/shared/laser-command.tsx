export type ExportedLasershow = LaserCommandModelCluster[];

export type LaserCommandModelCluster = {
  timeMs: number;
  commands: LaserCommandModel[][];
};

export type LaserCommandModel = {
  r: number;
  g: number;
  b: number;
  x: number;
  y: number;
};
