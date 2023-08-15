import { Grid } from "@mui/material";
import PointsDrawer from "components/shared/points-drawer";
import {
  AnimationPattern,
  AnimationPatternKeyFrame,
} from "models/components/shared/animation";
import React, { useEffect, useState } from "react";
import AnimationPatternProperties from "./animation-properties";
import AnimationPatternKeyFrames from "./animation-keyframes";
import { Point } from "models/components/shared/point";
import { mapNumber, numberIsBetweenOrEqual } from "services/shared/math";
import { applyParametersToPointsForCanvas } from "services/shared/converters";
import { propertiesSettings } from "services/logic/animation-logic";
import AnimationPatternTimeline from "./animation-pattern-timeline";
import {
  SelectedAnimationContext,
  SelectedAnimationContextType,
  SelectedAnimationPatternContext,
  SelectedAnimationPatternContextType,
  SelectedAnimationPatternIndexContext,
} from "pages/animation";
import { Pattern } from "models/components/shared/pattern";

type PreviousCurrentAndNextKeyFramePerProperty = {
  previous: AnimationPatternKeyFrame[];
  current: AnimationPatternKeyFrame[];
  next: AnimationPatternKeyFrame[];
};

export type TimeLineContextType = {
  timelinePositionMs: number;
  setTimelinePositionMs: React.Dispatch<React.SetStateAction<number>>;
};

export type SelectableStepsIndexContextType = {
  selectableStepsIndex: number;
  setSelectableStepsIndex: React.Dispatch<React.SetStateAction<number>>;
};

export type SelectedKeyFrameContextType = {
  selectedKeyFrameUuid: string;
  setSelectedKeyFrameUuid: React.Dispatch<React.SetStateAction<string>>;
};

export type PlayAnimationContextType = {
  playAnimation: boolean;
  setPlayAnimation: React.Dispatch<React.SetStateAction<boolean>>;
};

export const TimeLinePositionContext =
  React.createContext<TimeLineContextType | null>(null);
export const SelectableStepsIndexContext =
  React.createContext<SelectableStepsIndexContextType | null>(null);
export const SelectedKeyFrameContext =
  React.createContext<SelectedKeyFrameContextType | null>(null);
export const PlayAnimationContext =
  React.createContext<PlayAnimationContextType | null>(null);
export const XCorrectionContext = React.createContext<number[]>([]);
export const StepsToDrawMaxRangeContext = React.createContext<number>(0);
export const SelectableStepsContext = React.createContext<number[]>([
  10, 100, 1000, 10000,
]);

export default function AnimationKeyFrameEditor() {
  const { selectedAnimation, setSelectedAnimation } = React.useContext(
    SelectedAnimationContext
  ) as SelectedAnimationContextType;
  const { selectedAnimationPattern, setSelectedAnimationPattern } =
    React.useContext(
      SelectedAnimationPatternContext
    ) as SelectedAnimationPatternContextType;

  const selectedAnimationPatternIndex = React.useContext(
    SelectedAnimationPatternIndexContext
  ) as number;

  const [timelinePositionMs, setTimelinePositionMs] = useState<number>(0);
  const [selectableStepsIndex, setSelectableStepsIndex] = useState<number>(0);
  const [selectedKeyFrameUuid, setSelectedKeyFrameUuid] = useState<string>("");
  const [playAnimation, setPlayAnimation] = useState<boolean>(false);
  const selectableSteps = [10, 100, 1000, 10000];
  let stepsToDrawMaxRange =
    (timelinePositionMs + selectableSteps[selectableStepsIndex] * 10) | 0;

  const timelinePositionMemo = React.useMemo(
    () => ({ timelinePositionMs, setTimelinePositionMs }),
    [timelinePositionMs]
  );
  const selectableStepsMemo = React.useMemo(
    () => ({ selectableStepsIndex, setSelectableStepsIndex }),
    [selectableSteps]
  );
  const selectedKeyFrameMemo = React.useMemo(
    () => ({ selectedKeyFrameUuid, setSelectedKeyFrameUuid }),
    [selectableSteps]
  );
  const playAnimationMemo = React.useMemo(
    () => ({ playAnimation, setPlayAnimation }),
    [playAnimation]
  );

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (playAnimation) {
      interval = setInterval(
        () => setTimelinePositionMs(timelinePositionMs + 10),
        10
      );
    }

    return () => clearInterval(interval);
  }, [
    playAnimation,
    selectableStepsIndex,
    timelinePositionMs,
    selectedKeyFrameUuid,
    selectedAnimation,
  ]);

  const getWrapperContext = (reactObject: React.ReactNode) => (
    <TimeLinePositionContext.Provider value={timelinePositionMemo}>
      <SelectableStepsIndexContext.Provider value={selectableStepsMemo}>
        <SelectedKeyFrameContext.Provider value={selectedKeyFrameMemo}>
          <PlayAnimationContext.Provider value={playAnimationMemo}>
            <XCorrectionContext.Provider value={[20, 350, 3000, 8000]}>
              <SelectableStepsContext.Provider value={selectableSteps}>
                <StepsToDrawMaxRangeContext.Provider
                  value={stepsToDrawMaxRange}
                >
                  {reactObject}
                </StepsToDrawMaxRangeContext.Provider>
              </SelectableStepsContext.Provider>
            </XCorrectionContext.Provider>
          </PlayAnimationContext.Provider>
        </SelectedKeyFrameContext.Provider>
      </SelectableStepsIndexContext.Provider>
    </TimeLinePositionContext.Provider>
  );

  const getNextKeyFramesByPropertySorted = (
    property: string,
    animationPattern: AnimationPattern
  ) =>
    animationPattern?.animationKeyFrames
      .filter(
        (ak: { timeMs: number; propertyEdited: string }) =>
          ak.timeMs > timelinePositionMs && ak.propertyEdited === property
      )
      .sort(
        (a: { timeMs: number }, b: { timeMs: number }) => a.timeMs - b.timeMs
      );

  const getPreviousKeyFramesByPropertySortedDescendingFromAnimationPattern = (
    property: string,
    animationPattern: AnimationPattern
  ) =>
    animationPattern?.animationKeyFrames
      .filter(
        (ak: { timeMs: number; propertyEdited: string }) =>
          ak.timeMs < timelinePositionMs && ak.propertyEdited === property
      )
      .sort(
        (a: { timeMs: number }, b: { timeMs: number }) => b.timeMs - a.timeMs
      );

  const getCurrentKeyFrame = () =>
    selectedAnimationPattern?.animationKeyFrames.filter(
      (ak: { timeMs: number }) => ak.timeMs === timelinePositionMs
    );

  const getPreviousCurrentAndNextKeyFramePerPropertyFromAnimationPattern = (
    animationPattern: AnimationPattern
  ): PreviousCurrentAndNextKeyFramePerProperty => {
    let previousNextAndCurrentKeyFramePerProperty: PreviousCurrentAndNextKeyFramePerProperty =
      {
        previous: [],
        current: getCurrentKeyFrame() ?? [],
        next: [],
      };

    propertiesSettings.forEach((propertySetting) => {
      const previous =
        getPreviousKeyFramesByPropertySortedDescendingFromAnimationPattern(
          propertySetting.property,
          animationPattern
        )?.at(0);
      if (previous !== undefined) {
        previousNextAndCurrentKeyFramePerProperty.previous.push(previous);
      }

      const next = getNextKeyFramesByPropertySorted(
        propertySetting.property,
        animationPattern
      )?.at(0);
      if (next !== undefined) {
        previousNextAndCurrentKeyFramePerProperty.next.push(next);
      }
    });

    return previousNextAndCurrentKeyFramePerProperty;
  };

  const getPatternPointsByTimelinePosition = (
    pattern: Pattern,
    previousNextAndCurrentKeyFrames: PreviousCurrentAndNextKeyFramePerProperty
  ): Point[] => {
    if (pattern?.points === undefined) {
      return [];
    }

    let points: Point[] = [...pattern.points];
    let valuesPerProperty = propertiesSettings.map((propertiesSetting) => ({
      property: propertiesSetting.property,
      value: propertiesSetting.default,
    }));

    for (let i = 0; i < 4; i++) {
      const currentPropertySetting = propertiesSettings[i];
      const currentKeyFrame = previousNextAndCurrentKeyFrames.current.find(
        (kf) => kf.propertyEdited === currentPropertySetting.property
      );

      const currentKeyFrameIsAvailable = currentKeyFrame !== undefined;
      const previousKeyFrame = currentKeyFrameIsAvailable
        ? currentKeyFrame
        : previousNextAndCurrentKeyFrames.previous.find(
            (kf) => kf.propertyEdited === currentPropertySetting.property
          );

      const nextKeyFrame = previousNextAndCurrentKeyFrames.next.find(
        (kf) => kf.propertyEdited === currentPropertySetting.property
      );

      const valuesPerPropertyIndex = valuesPerProperty.findIndex(
        (vpp) => vpp.property === currentPropertySetting.property
      );
      if (
        valuesPerPropertyIndex !== -1 &&
        previousKeyFrame !== undefined &&
        nextKeyFrame !== undefined
      ) {
        valuesPerProperty[valuesPerPropertyIndex].value =
          calculateNewValueByKeyFrames(previousKeyFrame, nextKeyFrame);
      } else if (
        valuesPerPropertyIndex !== -1 &&
        previousKeyFrame !== undefined
      ) {
        valuesPerProperty[valuesPerPropertyIndex].value =
          previousKeyFrame.propertyValue;
      }
    }

    const scale =
      valuesPerProperty.find((vpp) => vpp.property === "scale")?.value ?? 1;
    const xOffset =
      valuesPerProperty.find((vpp) => vpp.property === "xOffset")?.value ?? 0;
    const yOffset =
      valuesPerProperty.find((vpp) => vpp.property === "yOffset")?.value ?? 0;
    const rotation =
      valuesPerProperty.find((vpp) => vpp.property === "rotation")?.value ?? 0;

    return applyParametersToPointsForCanvas(scale, xOffset, yOffset, rotation, [
      ...points,
    ]);
  };

  const calculateNewValueByKeyFrames = (
    previousKeyFrame: AnimationPatternKeyFrame,
    nextKeyFrame: AnimationPatternKeyFrame
  ) => {
    const newPropertyValue = mapNumber(
      timelinePositionMs,
      previousKeyFrame.timeMs,
      nextKeyFrame.timeMs,
      previousKeyFrame.propertyValue,
      nextKeyFrame.propertyValue
    );

    return newPropertyValue;
  };

  const getPointsToDraw = () => {
    const animationPatternsToPlay = selectedAnimation?.animationPatterns.filter(
      (ap) => {
        const animationStartTimeMs = ap.startTimeMs;

        const animationLengthMs =
          Math.max(...ap.animationKeyFrames.map((akf) => akf.timeMs)) +
          ap.startTimeMs;

        return numberIsBetweenOrEqual(
          timelinePositionMs,
          animationStartTimeMs,
          animationLengthMs
        );
      }
    );

    const animationPatternsToPlayLength = animationPatternsToPlay?.length ?? 0;
    if (
      animationPatternsToPlayLength === 0 ||
      animationPatternsToPlay === undefined
    ) {
      return [];
    }

    let points: Point[] = [];
    for (let i = 0; i < animationPatternsToPlayLength; i++) {
      const animationPattern = animationPatternsToPlay[i];
      const previousCurrentAndNextKeyFrames =
        getPreviousCurrentAndNextKeyFramePerPropertyFromAnimationPattern(
          animationPattern
        );
      const patternPoints = getPatternPointsByTimelinePosition(
        animationPattern.pattern,
        previousCurrentAndNextKeyFrames
      );

      points = points.concat(patternPoints);
    }

    return points;
  };

  return (
    <>
      <Grid container direction="row" spacing={2} key={selectedKeyFrameUuid}>
        <Grid item xs={3}>
          {getWrapperContext(<AnimationPatternProperties />)}
        </Grid>
        <Grid item xs>
          {getWrapperContext(<AnimationPatternKeyFrames />)}
        </Grid>
        <Grid item xs>
          <PointsDrawer pointsToDraw={getPointsToDraw()} />
        </Grid>
      </Grid>
      <Grid item xs>
        {getWrapperContext(<AnimationPatternTimeline />)}
      </Grid>
    </>
  );
}
