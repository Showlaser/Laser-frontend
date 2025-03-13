import { createGuid } from "services/shared/math";
import { Pattern } from "./pattern";

export enum AnimationProperty {
  scale = "scale",
  xOffset = "xOffset",
  yOffset = "yOffset",
  rotation = "rotation",
  undefined = "",
}

export type AnimationPatternKeyFrame = {
  uuid: string;
  animationPatternUuid: string;
  timeMs: number;
  propertyEdited: AnimationProperty;
  propertyValue: number;
};

export const getAnimationPatternDuration = (animationPattern: AnimationPattern) => {
  return Math.max(...animationPattern.animationPatternKeyFrames.map((akf) => akf.timeMs));
};

export type AnimationPattern = {
  uuid: string;
  animationUuid: string;
  patternUuid: string;
  name: string;
  pattern: Pattern;
  animationPatternKeyFrames: AnimationPatternKeyFrame[];
  startTimeMs: number;
  timelineId: number;
};

export type Animation = {
  uuid: string;
  name: string;
  image: string | null;
  animationPatterns: AnimationPattern[];
};

export const animationPlaceholder = (): Animation => ({
  uuid: createGuid(),
  name: "Placeholder animation",
  image: null,
  animationPatterns: [],
});
