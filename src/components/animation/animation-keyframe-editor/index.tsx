import { Grid, Paper, SpeedDial, SpeedDialAction } from "@mui/material";
import PointsDrawer from "components/shared/points-drawer";
import React, { useEffect, useState } from "react";
import AnimationPatternProperties from "./animation-pattern-properties";
import AnimationPatternKeyFrames from "./animation-keyframes";
import { Point } from "models/components/shared/point";
import { numberIsBetweenOrEqual } from "services/shared/math";
import AnimationPatternTimeline from "./animation-pattern-timeline";
import {
  SelectedAnimationContext,
  SelectedAnimationContextType,
  SelectedAnimationPatternContext,
  SelectedAnimationPatternContextType,
} from "pages/animation-editor";
import TabSelector from "components/tabs";
import AnimationManager from "./animation-manager";
import { canvasPxSize, selectableSteps } from "services/shared/config";
import {
  getPatternPointsByTimelinePosition,
  getPreviousCurrentAndNextKeyFramePerProperty,
} from "services/logic/pattern-logic";
import SettingsIcon from "@mui/icons-material/Settings";
import SaveIcon from "@mui/icons-material/Save";
import ClearIcon from "@mui/icons-material/Clear";
import { getAnimationDuration, saveAnimation } from "services/logic/animation-logic";

export type AnimationTimeLineContextType = {
  timelinePositionMs: number;
  setTimelinePositionMs: React.Dispatch<React.SetStateAction<number>>;
};

export type AnimationSelectableStepsIndexContextType = {
  selectableStepsIndex: number;
  setSelectableStepsIndex: React.Dispatch<React.SetStateAction<number>>;
};

export type AnimationSelectedKeyFrameContextType = {
  selectedKeyFrameUuid: string;
  setSelectedKeyFrameUuid: React.Dispatch<React.SetStateAction<string>>;
};

export type AnimationPlayAnimationContextType = {
  playAnimation: boolean;
  setPlayAnimation: React.Dispatch<React.SetStateAction<boolean>>;
};

export type AnimationDurationContextType = {
  getAnimationDuration: () => number;
};

export const AnimationTimeLinePositionContext = React.createContext<AnimationTimeLineContextType | null>(null);
export const AnimationSelectableStepsIndexContext =
  React.createContext<AnimationSelectableStepsIndexContextType | null>(null);
export const AnimationSelectedKeyFrameContext = React.createContext<AnimationSelectedKeyFrameContextType | null>(null);
export const AnimationPlayAnimationContext = React.createContext<AnimationPlayAnimationContextType | null>(null);
export const AnimationStepsToDrawMaxRangeContext = React.createContext<number>(0);
export const AnimationDurationContext = React.createContext<AnimationDurationContextType | null>(null);

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
  const [selectedTabId, setSelectedTabId] = React.useState<number>(0);

  const stepsToDrawMaxRange = (timelinePositionMs + selectableSteps[selectableStepsIndex] * 10) | 0;

  const timelinePositionMemo = React.useMemo(
    () => ({ timelinePositionMs, setTimelinePositionMs }),
    [timelinePositionMs]
  );
  const selectedKeyFrameMemo = React.useMemo(
    () => ({ selectedKeyFrameUuid, setSelectedKeyFrameUuid }),
    [selectedKeyFrameUuid]
  );
  const playAnimationMemo = React.useMemo(() => ({ playAnimation, setPlayAnimation }), [playAnimation]);
  const selectableStepsIndexMemo = React.useMemo(
    () => ({ selectableStepsIndex, setSelectableStepsIndex }),
    [playAnimation]
  );

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (playAnimation) {
      if (selectedAnimation === null) {
        return;
      }

      if (timelinePositionMs >= getAnimationDuration(selectedAnimation)) {
        setPlayAnimation(false);
      }

      interval = setInterval(() => setTimelinePositionMs(timelinePositionMs + 10), 10);
    }

    return () => clearInterval(interval);
  }, [playAnimation, selectableStepsIndex, timelinePositionMs, selectedKeyFrameUuid, selectedAnimation]);

  useEffect(() => {
    setSelectedTabId(1);
  }, [selectedAnimationPattern]);

  const getWrapperContext = (reactObject: React.ReactNode) => (
    <AnimationTimeLinePositionContext.Provider value={timelinePositionMemo}>
      <AnimationSelectedKeyFrameContext.Provider value={selectedKeyFrameMemo}>
        <AnimationPlayAnimationContext.Provider value={playAnimationMemo}>
          <AnimationSelectableStepsIndexContext.Provider value={selectableStepsIndexMemo}>
            <AnimationStepsToDrawMaxRangeContext.Provider value={stepsToDrawMaxRange}>
              {reactObject}
            </AnimationStepsToDrawMaxRangeContext.Provider>
          </AnimationSelectableStepsIndexContext.Provider>
        </AnimationPlayAnimationContext.Provider>
      </AnimationSelectedKeyFrameContext.Provider>
    </AnimationTimeLinePositionContext.Provider>
  );

  const getPointsToDraw = (): Point[] => {
    const animationPatternsToPlay = selectedAnimation?.animationPatterns.filter((ap) =>
      numberIsBetweenOrEqual(timelinePositionMs, ap.startTimeMs, ap.getDuration + ap.startTimeMs)
    );
    const animationPatternsToPlayLength = animationPatternsToPlay?.length ?? 0;
    if (animationPatternsToPlayLength === 0 || animationPatternsToPlay === undefined) {
      return [];
    }

    let points: Point[] = [];
    for (let i = 0; i < animationPatternsToPlayLength; i++) {
      const animationPattern = animationPatternsToPlay[i];
      if (animationPattern.pattern === undefined) {
        return [];
      }

      const previousCurrentAndNextKeyFrames = getPreviousCurrentAndNextKeyFramePerProperty(
        animationPattern,
        timelinePositionMs
      );
      const patternPoints = getPatternPointsByTimelinePosition(
        animationPattern.pattern,
        previousCurrentAndNextKeyFrames,
        timelinePositionMs
      );

      points = points.concat(patternPoints);
    }

    return points;
  };

  const saveAnimationOnApi = async () => {
    if (selectedAnimation !== null) {
      await saveAnimation(selectedAnimation);
    }
  };

  return (
    <>
      <Grid container direction="row" spacing={1} key={selectedKeyFrameUuid}>
        {getWrapperContext(
          <Grid item xs={4}>
            <Paper
              style={{
                maxHeight: canvasPxSize,
              }}
            >
              <TabSelector
                data={[
                  {
                    tabName: "Animation manager",
                    tabChildren: <AnimationManager />,
                  },
                  {
                    tabName: "Animation pattern properties",
                    tabChildren: <AnimationPatternProperties />,
                  },
                ]}
                selectedTabId={selectedTabId}
                setSelectedTabId={setSelectedTabId}
                disableAnimation={true}
              />
            </Paper>
          </Grid>
        )}
        <Grid item xs>
          {getWrapperContext(<AnimationPatternKeyFrames />)}
        </Grid>
        <Grid item xs>
          <PointsDrawer pointsToDraw={getPointsToDraw()} />
        </Grid>
      </Grid>
      <Grid item xs={12}>
        {getWrapperContext(<AnimationPatternTimeline />)}
      </Grid>
      <Grid>
        <SpeedDial
          ariaLabel="SpeedDial basic example"
          sx={{ position: "fixed", bottom: 30, right: 30 }}
          icon={<SettingsIcon />}
        >
          <SpeedDialAction
            key="sd-upload-clear"
            icon={<ClearIcon />}
            onClick={() =>
              window.confirm("Are you sure you want to clear the field? Unsaved changes will be lost")
                ? setSelectedAnimation(null)
                : null
            }
            tooltipTitle="Clear editor field"
          />
          <SpeedDialAction icon={<SaveIcon />} onClick={saveAnimationOnApi} tooltipTitle="Save animation (ctrl + s)" />
        </SpeedDial>
      </Grid>
    </>
  );
}
