import { Grid } from "@mui/material";
import PointsDrawer from "components/shared/points-drawer";
import { Animation, AnimationKeyFrame, AnimationPattern as AnimationPattern } from "models/components/shared/animation";
import React, { useEffect, useState } from "react";

import AnimationProperties from "./animation-properties";
import AnimationKeyFrames from "./animation-keyframes";
import { Point } from "models/components/shared/point";
import { mapNumber } from "services/shared/math";
import { applyParametersToPointsForCanvas } from "services/shared/converters";
import { propertiesSettings } from "services/logic/animation-logic";
import AnimationPatternTimeline from "./animation-pattern-timeline";
import {
  SelectedAnimationContext,
  SelectedAnimationContextType,
  SelectedAnimationPatternContext,
  SelectedAnimationPatternContextType,
} from "pages/animation";

type PreviousCurrentAndNextKeyFramePerProperty = {
  previous: AnimationKeyFrame[];
  current: AnimationKeyFrame[];
  next: AnimationKeyFrame[];
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

export const TimeLinePositionContext = React.createContext<TimeLineContextType | null>(null);
export const SelectableStepsIndexContext = React.createContext<SelectableStepsIndexContextType | null>(null);
export const SelectedKeyFrameContext = React.createContext<SelectedKeyFrameContextType | null>(null);
export const PlayAnimationContext = React.createContext<PlayAnimationContextType | null>(null);
export const XCorrectionContext = React.createContext<number[]>([]);
export const SelectableStepsContext = React.createContext<number[]>([10, 100, 1000, 10000]);

export default function AnimationKeyFrameEditor() {
  const { selectedAnimation, setSelectedAnimation } = React.useContext(
    SelectedAnimationContext
  ) as SelectedAnimationContextType;
  const { selectedAnimationPattern, setSelectedAnimationPattern } = React.useContext(
    SelectedAnimationPatternContext
  ) as SelectedAnimationPatternContextType;

  const [timelinePositionMs, setTimelinePositionMs] = useState<number>(0);
  const [selectableStepsIndex, setSelectableStepsIndex] = useState<number>(0);
  const [selectedKeyFrameUuid, setSelectedKeyFrameUuid] = useState<string>("");
  const [playAnimation, setPlayAnimation] = useState<boolean>(false);
  const selectableSteps = [10, 100, 1000, 10000];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (playAnimation) {
      interval = setInterval(() => setTimelinePositionMs(timelinePositionMs + 10), 10);
    }

    return () => clearInterval(interval);
  }, [playAnimation, selectableStepsIndex, timelinePositionMs, selectedKeyFrameUuid, selectedAnimation]);

  const getWrapperContext = (reactObject: React.ReactNode) => (
    <TimeLinePositionContext.Provider value={{ timelinePositionMs, setTimelinePositionMs }}>
      <SelectableStepsIndexContext.Provider value={{ selectableStepsIndex, setSelectableStepsIndex }}>
        <SelectedKeyFrameContext.Provider value={{ selectedKeyFrameUuid, setSelectedKeyFrameUuid }}>
          <PlayAnimationContext.Provider value={{ playAnimation, setPlayAnimation }}>
            <XCorrectionContext.Provider value={[20, 350, 3000, 8000]}>
              <SelectableStepsContext.Provider value={selectableSteps}>{reactObject}</SelectableStepsContext.Provider>
            </XCorrectionContext.Provider>
          </PlayAnimationContext.Provider>
        </SelectedKeyFrameContext.Provider>
      </SelectableStepsIndexContext.Provider>
    </TimeLinePositionContext.Provider>
  );

  const getNextKeyFramesByPropertySorted = (property: string) =>
    selectedAnimationPattern?.animationKeyFrames
      .filter(
        (ak: { timeMs: number; propertyEdited: string }) =>
          ak.timeMs > timelinePositionMs && ak.propertyEdited === property
      )
      .sort((a: { timeMs: number }, b: { timeMs: number }) => a.timeMs - b.timeMs);

  const getPreviousKeyFramesByPropertySortedDescending = (property: string) =>
    selectedAnimationPattern?.animationKeyFrames
      .filter(
        (ak: { timeMs: number; propertyEdited: string }) =>
          ak.timeMs < timelinePositionMs && ak.propertyEdited === property
      )
      .sort((a: { timeMs: number }, b: { timeMs: number }) => b.timeMs - a.timeMs);

  const getCurrentKeyFrame = () =>
    selectedAnimationPattern?.animationKeyFrames.filter((ak: { timeMs: number }) => ak.timeMs === timelinePositionMs);

  const getPreviousCurrentAndNextKeyFramePerProperty = (): PreviousCurrentAndNextKeyFramePerProperty => {
    let previousNextAndCurrentKeyFramePerProperty: PreviousCurrentAndNextKeyFramePerProperty = {
      previous: [],
      current: getCurrentKeyFrame() ?? [],
      next: [],
    };

    propertiesSettings.forEach((propertySetting) => {
      const previous = getPreviousKeyFramesByPropertySortedDescending(propertySetting.property)?.at(0);
      if (previous !== undefined) {
        previousNextAndCurrentKeyFramePerProperty.previous.push(previous);
      }

      const next = getNextKeyFramesByPropertySorted(propertySetting.property)?.at(0);
      if (next !== undefined) {
        previousNextAndCurrentKeyFramePerProperty.next.push(next);
      }
    });

    return previousNextAndCurrentKeyFramePerProperty;
  };

  const getPointsByTimelinePosition = (
    previousNextAndCurrentKeyFrames: PreviousCurrentAndNextKeyFramePerProperty
  ): Point[] => {
    const pattern = selectedAnimationPattern?.pattern;
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
        : previousNextAndCurrentKeyFrames.previous.find((kf) => kf.propertyEdited === currentPropertySetting.property);

      const nextKeyFrame = previousNextAndCurrentKeyFrames.next.find(
        (kf) => kf.propertyEdited === currentPropertySetting.property
      );

      const valuesPerPropertyIndex = valuesPerProperty.findIndex(
        (vpp) => vpp.property === currentPropertySetting.property
      );
      if (valuesPerPropertyIndex !== -1 && previousKeyFrame !== undefined && nextKeyFrame !== undefined) {
        valuesPerProperty[valuesPerPropertyIndex].value = calculateNewValueByKeyFrames(previousKeyFrame, nextKeyFrame);
      } else if (valuesPerPropertyIndex !== -1 && previousKeyFrame !== undefined) {
        valuesPerProperty[valuesPerPropertyIndex].value = previousKeyFrame.propertyValue;
      }
    }

    const scale = valuesPerProperty.find((vpp) => vpp.property === "scale")?.value ?? 1;
    const xOffset = valuesPerProperty.find((vpp) => vpp.property === "xOffset")?.value ?? 0;
    const yOffset = valuesPerProperty.find((vpp) => vpp.property === "yOffset")?.value ?? 0;
    const rotation = valuesPerProperty.find((vpp) => vpp.property === "rotation")?.value ?? 0;

    return applyParametersToPointsForCanvas(scale, xOffset, yOffset, rotation, [...points]);
  };

  const calculateNewValueByKeyFrames = (previousKeyFrame: AnimationKeyFrame, nextKeyFrame: AnimationKeyFrame) => {
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
    const previousCurrentAndNextKeyFrames = getPreviousCurrentAndNextKeyFramePerProperty();
    return getPointsByTimelinePosition(previousCurrentAndNextKeyFrames);
  };

  return (
    <>
      <Grid container direction="row" spacing={2} key={selectedKeyFrameUuid}>
        <Grid item xs={3} style={{ maxWidth: "25vh" }}>
          {getWrapperContext(<AnimationProperties />)}
        </Grid>
        <Grid item xs>
          {getWrapperContext(<AnimationKeyFrames />)}
        </Grid>
        <Grid item xs>
          <PointsDrawer pointsToDraw={getPointsToDraw()} />
        </Grid>
      </Grid>
      <Grid item xs>
        <AnimationPatternTimeline
          selectedAnimation={selectedAnimation}
          selectedAnimationPattern={selectedAnimationPattern}
          setSelectedAnimationPattern={setSelectedAnimationPattern}
        />
      </Grid>
    </>
  );
}
