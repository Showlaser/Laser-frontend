import { createGuid } from "services/shared/math";
import { Pattern } from "./pattern";

export enum AnimationProperty {
  scale = "Scale",
  xOffset = "Xoffset",
  yOffset = "Yoffset",
  rotation = "Rotation",
  undefined = "",
}

export type AnimationPatternKeyFrame = {
  uuid: string;
  animationPatternUuid: string;
  timeMs: number;
  propertyEdited: AnimationProperty;
  propertyValue: number;
};

export const getAnimationPatternDuration = (animationPattern: AnimationPattern | null) => {
  if (animationPattern === null) {
    return 0;
  }
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
