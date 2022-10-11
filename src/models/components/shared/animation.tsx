import { convertKeyFrameValuesToPoint } from "services/shared/converters";
import { createGuid, rotatePoint } from "services/shared/math";
import { Pattern, getPatternPlaceHolder } from "./pattern";
import { Point } from "./point";

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

export const generateKeyFramesFromAnimation = (animation: Animation): AnimationKeyFrame[] => {
  const { pattern } = animation;
  return convertKeyFrameValuesToPoint(
    pattern.scale,
    pattern.xOffset,
    pattern.yOffset,
    pattern.rotation,
    pattern.points
  );
};
