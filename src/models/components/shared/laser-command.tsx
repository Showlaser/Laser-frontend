// The numbers corresponds to red   green   blue    xGalvo  yGalvo
export type LaserCommand = [number, string, number, number, number, number, number];
export type LaserCommandModel = {
  time: number;
  patternUuid: string;
  r: number;
  g: number;
  b: number;
  x: number;
  y: number;
};
