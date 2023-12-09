import { createGuid } from "services/shared/math";
import { Pattern } from "./pattern";

export type AnimationPatternKeyFrame = {
  uuid: string;
  animationPatternUuid: string;
  timeMs: number;
  propertyEdited: string;
  propertyValue: number;
};

export class AnimationPattern {
  public uuid: string | undefined;
  public animationUuid: string | undefined;
  public name: string | undefined;
  public pattern: Pattern | undefined;
  public animationPatternKeyFrames: AnimationPatternKeyFrame[] = [];
  public startTimeMs: number = 0;
  public timelineId: number = 0;

  public get getDuration() {
    return Math.max(...this.animationPatternKeyFrames.map((akf) => akf.timeMs));
  }
}

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
