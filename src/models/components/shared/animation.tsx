import { createGuid } from "services/shared/math";
import { Pattern, getPatternPlaceHolder } from "./pattern";

export enum AnimationEffects {
  Enlarge,
  Reduce,
}

export type AnimationKeyFrame = {
  uuid: string;
  timeMs: number;
  propertyEdited: string;
  propertyValue: number;
};

export type AnimationPattern = {
  uuid: string;
  pattern: Pattern;
  animationKeyFrames: AnimationKeyFrame[];
};

export type Animation = {
  uuid: string;
  name: string;
  image: string | null;
  animationPatterns: AnimationPattern[];
  animationEffects: AnimationEffect[];
};

export const animationPlaceholder = (): Animation => ({
  uuid: createGuid(),
  name: "Placeholder animation",
  image: null,
  animationPatterns: [],
  animationEffects: [],
});
