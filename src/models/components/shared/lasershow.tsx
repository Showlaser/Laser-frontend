import { createGuid } from "services/shared/math";
import { Animation } from "./animation";
import { getRandomObjectName } from "services/shared/random-object-name-generator";

export type LasershowAnimation = {
  uuid: string;
  lasershowUuid: string;
  animationUuid: string;
  name: string;
  animation: Animation;
  startTimeMs: number;
  timeLineId: number;
};

export type Lasershow = {
  uuid: string;
  name: string;
  image: string;
  lasershowAnimations: LasershowAnimation[];
};

export function getLasershowPlaceholder(): Lasershow {
  return {
    uuid: createGuid(),
    name: getRandomObjectName(),
    image: "",
    lasershowAnimations: [],
  };
}
