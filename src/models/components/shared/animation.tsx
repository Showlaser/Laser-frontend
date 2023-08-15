import { createGuid } from "services/shared/math";
import { Pattern } from "./pattern";

export type AnimationPatternKeyFrame = {
  uuid: string;
  timeMs: number;
  propertyEdited: string;
  propertyValue: number;
};

export type AnimationPattern = {
  uuid: string;
  name: string;
  pattern: Pattern;
  animationKeyFrames: AnimationPatternKeyFrame[];
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
