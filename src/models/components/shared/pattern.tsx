import { Point } from "./point";

export type Pattern = {
  uuid: string;
  name: string;
  points: Point[];
  scale: number;
  xOffset: number;
  yOffset: number;
  rotation: number;
};

export interface SectionProps {
  scale: number;
  setScale: (value: number) => void;
  numberOfPoints: number;
  setNumberOfPoints: (value: number) => void;
  xOffset: number;
  setXOffset: (value: number) => void;
  yOffset: number;
  setYOffset: (value: number) => void;
  rotation: number;
  setRotation: (value: number) => void;
  showPointNumber: boolean;
  setShowPointNumber: (value: boolean) => void;
  points: Point[];
  setPoints: (points: Point[]) => void;
  selectedPointsUuid: string[];
  setSelectedPointsUuid: (value: string[]) => void;
  fileName: string;
  setFileName: (value: string) => void;
}

export type WidthAndHeight = {
  width: number;
  height: number;
};
