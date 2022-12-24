import { createGuid } from "services/shared/math";
import { getRandomObjectName } from "services/shared/random-object-name-generator";
import { Point } from "./point";

export type Pattern = {
  uuid: string;
  name: string;
  image: string | null;
  points: Point[];
  scale: number;
  xOffset: number;
  yOffset: number;
  rotation: number;
};

export interface SectionProps {
  patternNamesInUse: string[];
  setPatternNameIsInUse: (state: boolean) => void;
  pattern: Pattern;
  setPattern: (pattern: Pattern) => void;
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

export const getPatternPlaceHolder = (): Pattern => ({
  uuid: createGuid(),
  image: null,
  rotation: 0,
  points: [],
  name: getRandomObjectName(),
  scale: 1,
  xOffset: 0,
  yOffset: 0,
});
