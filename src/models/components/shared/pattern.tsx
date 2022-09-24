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
  patternNamesInUse: string[];
  pattern: Pattern;
  updatePatternProperty: (property: string, value: any) => void;
  numberOfPoints: number;
  setNumberOfPoints: (count: number) => void;
  showPointNumber: boolean;
  setShowPointNumber: (show: boolean) => void;
  selectedPointsUuid: string[];
  setSelectedPointsUuid: (selected: string[]) => void;
}

export type WidthAndHeight = {
  width: number;
  height: number;
};
