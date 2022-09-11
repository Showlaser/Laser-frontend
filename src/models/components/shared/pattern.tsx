import { Point } from "./point";

export type pattern = {
  name: string;
  points: Point[];
  scale: number;
  xOffset: number;
  yOffset: number;
  rotation: number;
};
