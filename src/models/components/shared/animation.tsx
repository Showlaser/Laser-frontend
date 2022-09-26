import { createGuid } from "services/shared/math";
import { Pattern, getPatternPlaceHolder } from "./pattern";
import { Point } from "./point";

export enum AnimationEffects {
  Enlarge,
  Reduce,
}

export type PatternAnimation = {
  uuid: string;
  animationUuid: string;
  startTimeMs: number;
  endTimeMs: number;
  effect: AnimationEffects;
  effectSpeed: number;
  effectProgress: number;
};

export type Animation = {
  uuid: string;
  name: string;
  image: string | null;
  pattern: Pattern;
  patternAnimations: PatternAnimation[];
};

export const animationPlaceholder = (): Animation => ({
  uuid: createGuid(),
  name: "Placeholder animation",
  image: null,
  pattern: getPatternPlaceHolder(),
  patternAnimations: [],
});
