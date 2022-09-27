import { createGuid } from "services/shared/math";
import { Pattern, getPatternPlaceHolder } from "./pattern";

export enum AnimationEffects {
  Enlarge,
  Reduce,
}

export type AnimationKeyFrame = {
  timeMs: number;
  propertyEdited: string;
  propertyValue: string | number;
};

export type AnimationEffect = {};

export type Animation = {
  uuid: string;
  name: string;
  image: string | null;
  pattern: Pattern;
  animationKeyFrames: AnimationKeyFrame[];
  animationEffects: AnimationEffect[];
};

export const animationPlaceholder = (): Animation => ({
  uuid: createGuid(),
  name: "Placeholder animation",
  image: null,
  pattern: getPatternPlaceHolder(),
  animationKeyFrames: [],
  animationEffects: [],
});
