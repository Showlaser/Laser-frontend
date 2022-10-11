import { Grid } from "@mui/material";
import PointsDrawer from "components/shared/points-drawer";
import { Animation, AnimationKeyFrame } from "models/components/shared/animation";
import React, { useEffect, useState } from "react";

import AnimationProperties from "./animation-properties";
import AnimationKeyFrames from "./animation-keyframes";
import { Point } from "models/components/shared/point";
import { rotatePoint } from "services/shared/math";

type PreviousNextAndCurrentKeyFramePerProperty = {
  previous: AnimationKeyFrame[];
  current: AnimationKeyFrame | undefined;
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
  const propertiesSettings = [
    {
      property: "scale",
      type: "float",
      min: 0.1,
      max: 10,
    },
    {
      property: "xOffset",
      type: "int",
      min: -200,
      max: 200,
    },
    {
      property: "yOffset",
      type: "int",
      min: -200,
      max: 200,
    },
    {
      property: "rotation",
      type: "int",
      min: -360,
      max: 360,
    },
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (playAnimation) {
      interval = setInterval(() => setTimelinePositionMs(timelinePositionMs + 10), 10);
    }

    return () => clearInterval(interval);
  }, [playAnimation, selectableStepsIndex, timelinePositionMs, selectedKeyFrameUuid, animation]);

  const getPreviousKeyFramesByPropertySorted = (property: string) =>
    animation?.animationKeyFrames
      .filter((ak) => ak.timeMs > timelinePositionMs && ak.propertyEdited === property)
      .sort((a, b) => a.timeMs - b.timeMs);

  const getPreviousKeyFramesByPropertySortedDescending = (property: string) =>
    animation?.animationKeyFrames
      .filter((ak) => ak.timeMs < timelinePositionMs && ak.propertyEdited === property)
      .sort((a, b) => b.timeMs - a.timeMs);

  const getCurrentKeyFrame = () => animation?.animationKeyFrames.find((ak) => ak.timeMs === timelinePositionMs);

  const getPreviousAndNextKeyFramePerProperty = (): PreviousNextAndCurrentKeyFramePerProperty => {
    let previousNextAndCurrentKeyFramePerProperty: PreviousNextAndCurrentKeyFramePerProperty = {
      previous: [],
      current: getCurrentKeyFrame(),
      next: [],
    };

    propertiesSettings.forEach((propertySetting) => {
      const previous = getPreviousKeyFramesByPropertySortedDescending(propertySetting.property)?.at(0);
      if (previous !== undefined) {
        previousNextAndCurrentKeyFramePerProperty.previous.push(previous);
      }

      const next = getPreviousKeyFramesByPropertySorted(propertySetting.property)?.at(0);
      if (next !== undefined) {
        previousNextAndCurrentKeyFramePerProperty.next.push(next);
      }
    });

    return previousNextAndCurrentKeyFramePerProperty;
  };

  const getPointsByTimelinePosition = (
    previousNextAndCurrentKeyFrames: PreviousNextAndCurrentKeyFramePerProperty
  ): Point[] => {
    const pattern = animation?.pattern;
    if (pattern?.points === undefined) {
      return [];
    }

    let points: Point[] = [...pattern.points];
    const pointsLength = points.length;

    for (let i = 0; i < 4; i++) {
      const currentPropertySetting = propertiesSettings[i];
      const currentKeyFrameIsAvailable =
        previousNextAndCurrentKeyFrames?.current?.propertyEdited === currentPropertySetting.property &&
        previousNextAndCurrentKeyFrames.current !== undefined;

      const previousKeyFrame = currentKeyFrameIsAvailable
        ? previousNextAndCurrentKeyFrames.current
        : previousNextAndCurrentKeyFrames.previous.find((kf) => kf.propertyEdited === currentPropertySetting.property);
      const nextKeyFrame = previousNextAndCurrentKeyFrames.next.find(
        (kf) => kf.propertyEdited === currentPropertySetting.property
      );
    }

    return points;
  };

  const calculateNewValueByKeyFrames = (previousKeyFrame: AnimationKeyFrame, nextKeyFrame: AnimationKeyFrame) => {
    const timeDifferenceBetweenKeyFrames = nextKeyFrame.timeMs - previousKeyFrame.timeMs;
    const differenceBetweenNextKeyFrameAndTimelinePosition = nextKeyFrame.timeMs - timelinePositionMs;
    const differenceBetweenPreviousAndNewPropertyValue = previousKeyFrame.propertyValue - nextKeyFrame.propertyValue;
    const conversionValue = differenceBetweenNextKeyFrameAndTimelinePosition / timeDifferenceBetweenKeyFrames;
    const newPropertyValue = differenceBetweenPreviousAndNewPropertyValue * conversionValue;
  };

  const getPointsToDraw = () => {
    const previousAndNextKeyFrames = getPreviousAndNextKeyFramePerProperty();
    const points = getPointsByTimelinePosition(previousAndNextKeyFrames);
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
function createGuid(): string {
  throw new Error("Function not implemented.");
}
