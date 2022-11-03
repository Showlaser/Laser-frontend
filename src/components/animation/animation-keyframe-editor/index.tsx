import { Grid } from "@mui/material";
import PointsDrawer from "components/shared/points-drawer";
import { Animation, AnimationKeyFrame } from "models/components/shared/animation";
import React, { useEffect, useState } from "react";

import AnimationProperties from "./animation-properties";
import AnimationKeyFrames from "./animation-keyframes";
import { Point } from "models/components/shared/point";
import { mapNumber } from "services/shared/math";
import { applyParametersToPoints } from "services/shared/converters";
import { propertiesSettings } from "services/logic/animation-logic";

type PreviousCurrentAndNextKeyFramePerProperty = {
  previous: AnimationKeyFrame[];
  current: AnimationKeyFrame[];
  next: AnimationKeyFrame[];
};

type Props = {
  animation: Animation | null;
  setSelectedAnimation: (animation: Animation | null) => void;
};

export default function AnimationKeyFrameEditor({ animation, setSelectedAnimation }: Props) {
  const [timelinePositionMs, setTimelinePositionMs] = useState<number>(0);
  const [selectableStepsIndex, setSelectableStepsIndex] = useState<number>(0);
  const [selectedKeyFrameUuid, setSelectedKeyFrameUuid] = useState<string>("");
  const [playAnimation, setPlayAnimation] = useState<boolean>(false);
  const selectableSteps = [10, 100, 1000, 10000];
  const xCorrection = [20, 350, 3000, 8000];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (playAnimation) {
      interval = setInterval(() => setTimelinePositionMs(timelinePositionMs + 10), 10);
    }

    return () => clearInterval(interval);
  }, [playAnimation, selectableStepsIndex, timelinePositionMs, selectedKeyFrameUuid, animation]);

  const getNextKeyFramesByPropertySorted = (property: string) =>
    animation?.animationKeyFrames
      .filter((ak) => ak.timeMs > timelinePositionMs && ak.propertyEdited === property)
      .sort((a, b) => a.timeMs - b.timeMs);

  const getPreviousKeyFramesByPropertySortedDescending = (property: string) =>
    animation?.animationKeyFrames
      .filter((ak) => ak.timeMs < timelinePositionMs && ak.propertyEdited === property)
      .sort((a, b) => b.timeMs - a.timeMs);

  const getCurrentKeyFrame = () => animation?.animationKeyFrames.filter((ak) => ak.timeMs === timelinePositionMs);

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
    const pattern = animation?.pattern;
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

    const scale = valuesPerProperty.find((vpp) => vpp.property === "scale")?.value ?? 4;
    const xOffset = valuesPerProperty.find((vpp) => vpp.property === "xOffset")?.value ?? 0;
    const yOffset = valuesPerProperty.find((vpp) => vpp.property === "yOffset")?.value ?? 0;
    const rotation = valuesPerProperty.find((vpp) => vpp.property === "rotation")?.value ?? 0;

    return applyParametersToPoints(scale, xOffset, yOffset, rotation, [...points]);
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
    const points = getPointsByTimelinePosition(previousCurrentAndNextKeyFrames);
    return points;
  };

  return (
    <Grid container direction="row" spacing={2} key={selectedKeyFrameUuid}>
      <Grid item xs={2}>
        <AnimationProperties
          animation={animation}
          selectedKeyFrameUuid={selectedKeyFrameUuid}
          setSelectedKeyFrameUuid={setSelectedKeyFrameUuid}
          setSelectedAnimation={setSelectedAnimation}
          setTimelinePositionMs={setTimelinePositionMs}
          xCorrection={xCorrection}
          selectableStepsIndex={selectableStepsIndex}
        />
      </Grid>
      <Grid item xs>
        <AnimationKeyFrames
          animation={animation}
          selectedKeyFrameUuid={selectedKeyFrameUuid}
          setSelectedKeyFrameUuid={setSelectedKeyFrameUuid}
          setSelectedAnimation={setSelectedAnimation}
          setTimelinePositionMs={setTimelinePositionMs}
          xCorrection={xCorrection}
          selectableStepsIndex={selectableStepsIndex}
          timelinePositionMs={timelinePositionMs}
          playAnimation={playAnimation}
          setSelectableStepsIndex={setSelectableStepsIndex}
          selectableSteps={selectableSteps}
          setPlayAnimation={setPlayAnimation}
        />
      </Grid>
      <Grid item xs>
        <PointsDrawer pointsToDraw={getPointsToDraw()} />
      </Grid>
    </Grid>
  );
}
