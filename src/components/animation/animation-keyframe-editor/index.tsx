import { Grid } from "@mui/material";
import PointsDrawer from "components/shared/points-drawer";
import { Animation, AnimationKeyFrame } from "models/components/shared/animation";
import React, { useEffect, useState } from "react";

import AnimationProperties from "./animation-properties";
import AnimationKeyFrames from "./animation-keyframes";

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
    getPointsToDrawByTimelinePosition();
    if (playAnimation) {
      interval = setInterval(
        () => setTimelinePositionMs(timelinePositionMs + selectableSteps[selectableStepsIndex]),
        10
      );
    }

    return () => clearInterval(interval);
  }, [playAnimation, selectableStepsIndex, timelinePositionMs, selectedKeyFrameUuid, animation]);

  const getPointsToDrawByTimelinePosition = () => {
    const previousKeyFrames = animation?.animationKeyFrames
      .filter((ak) => ak.timeMs < timelinePositionMs)
      .sort((a, b) => b.timeMs - a.timeMs);

    let propertiesFiltered: string[] = [];
    let previousKeyFramesPerProperty: AnimationKeyFrame[] = [];
    previousKeyFrames?.forEach((pkf) => {
      if (propertiesFiltered.includes(pkf.propertyEdited)) {
        return;
      }

      propertiesFiltered.push(pkf.propertyEdited);
      previousKeyFramesPerProperty.push(pkf);
    });

    propertiesFiltered = [];
    const nextKeyFrames = animation?.animationKeyFrames
      .filter((ak) => ak.timeMs > timelinePositionMs)
      .sort((a, b) => a.timeMs - b.timeMs);

    let nextKeyFramesPerProperty: AnimationKeyFrame[] = [];
    nextKeyFrames?.forEach((nkf) => {
      if (propertiesFiltered.includes(nkf.propertyEdited)) {
        return;
      }

      propertiesFiltered.push(nkf.propertyEdited);
      nextKeyFramesPerProperty.push(nkf);
    });

    console.log("previous");
    console.log(previousKeyFramesPerProperty);
    console.log("next");
    console.log(nextKeyFramesPerProperty);
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
        <PointsDrawer pointsToDraw={[]} />
      </Grid>
    </Grid>
  );
}
