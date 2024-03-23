import { createGuid } from "services/shared/math";
import { Pattern } from "./pattern";

export type AnimationPatternKeyFrame = {
  uuid: string;
  animationPatternUuid: string;
  timeMs: number;
  propertyEdited: string;
  propertyValue: number;
};

export const getAnimationPatternDuration = (animationPattern: AnimationPattern) => {
  return Math.max(...animationPattern.animationPatternKeyFrames.map((akf) => akf.timeMs));
};

export type AnimationPattern = {
  uuid: string | undefined;
  animationUuid: string | undefined;
  patternUuid: string | undefined;
  name: string | undefined;
  pattern: Pattern | undefined;
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
