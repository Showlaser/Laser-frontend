import ClearIcon from "@mui/icons-material/Clear";
import SaveIcon from "@mui/icons-material/Save";
import SettingsIcon from "@mui/icons-material/Settings";
import { Grid, Paper, SpeedDial, SpeedDialAction } from "@mui/material";
import PointsDrawer from "components/shared/points-drawer";
import { SharedTimeline } from "components/shared/shared-timeline";
import TabSelector from "components/tabs";
import { Lasershow, LasershowAnimation } from "models/components/shared/lasershow";
import { Point } from "models/components/shared/point";
import { SelectedLasershowContext, SelectedLasershowContextType } from "pages/lasershow-editor";
import React, { useEffect, useState } from "react";
import { getAnimationDuration, getPointsToDrawFromAnimation } from "services/logic/animation-logic";
import { getLasershowDuration, saveLasershow } from "services/logic/lasershow-logic";
import { canvasPxSize, selectableSteps } from "services/shared/config";
import { numberIsBetweenOrEqual } from "services/shared/math";
import LasershowAnimationProperties from "./lasershow-animation-properties";
import LasershowExport from "./lasershow-export";
import LasershowManager from "./lasershow-manager";

export type LasershowTimeLineContextType = {
  timelinePositionMs: number;
  setTimelinePositionMs: React.Dispatch<React.SetStateAction<number>>;
};

export type LasershowSelectableStepsIndexContextType = {
  selectableStepsIndex: number;
  setSelectableStepsIndex: React.Dispatch<React.SetStateAction<number>>;
};

export type SelectedLasershowAnimationContextType = {
  selectedLasershowAnimation: LasershowAnimation | null;
  setSelectedLasershowAnimation: React.Dispatch<React.SetStateAction<LasershowAnimation | null>>;
};

export type PlayLasershowContextType = {
  playLasershow: boolean;
  setPlayLasershow: React.Dispatch<React.SetStateAction<boolean>>;
};

export const LasershowTimeLinePositionContext =
  React.createContext<LasershowTimeLineContextType | null>(null);
export const LasershowSelectableStepsIndexContext =
  React.createContext<LasershowSelectableStepsIndexContextType | null>(null);
export const SelectedLasershowAnimationContext =
  React.createContext<SelectedLasershowAnimationContextType | null>(null);
export const PlayLasershowContext = React.createContext<PlayLasershowContextType | null>(null);
export const LasershowStepsToDrawMaxRangeContext = React.createContext<number>(0);

export default function LasershowEditorContent() {
  const { selectedLasershow, setSelectedLasershow } = React.useContext(
    SelectedLasershowContext
  ) as SelectedLasershowContextType;

  const [timelinePositionMs, setTimelinePositionMs] = useState<number>(0);
  const [selectableStepsIndex, setSelectableStepsIndex] = useState<number>(0);
  const [selectedLasershowAnimation, setSelectedLasershowAnimation] =
    useState<LasershowAnimation | null>(null);
  const [playLasershow, setPlayLasershow] = useState<boolean>(false);
  const [selectedTabId, setSelectedTabId] = React.useState<number>(0);

  const timelinePositionMemo = React.useMemo(
    () => ({ timelinePositionMs, setTimelinePositionMs }),
    [timelinePositionMs]
  );
  const lasershowSelectableStepsIndexMemo = React.useMemo(
    () => ({ selectableStepsIndex, setSelectableStepsIndex }),
    [selectableStepsIndex]
  );
  const selectedLasershowAnimationMemo = React.useMemo(
    () => ({
      selectedLasershowAnimation,
      setSelectedLasershowAnimation,
    }),
    [selectedLasershowAnimation]
  );

  const stepsToDrawMaxRange = (timelinePositionMs + selectableSteps[selectableStepsIndex] * 10) | 0;

  const playLasershowMemo = React.useMemo(
    () => ({ playLasershow, setPlayLasershow }),
    [playLasershow]
  );

  const lasershowDuration = getLasershowDuration(selectedLasershow);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (playLasershow) {
      if (timelinePositionMs >= lasershowDuration) {
        setPlayLasershow(false);
      }

      interval = setInterval(() => setTimelinePositionMs(timelinePositionMs + 10), 10);
    }

    return () => clearInterval(interval);
  }, [
    playLasershow,
    selectableStepsIndex,
    timelinePositionMs,
    selectedLasershowAnimation,
    selectedLasershow,
    lasershowDuration,
  ]);

  useEffect(() => {
    setSelectedTabId(1);
  }, [selectedLasershowAnimation]);

  const getWrapperContext = (reactObject: React.ReactNode) => (
    <LasershowTimeLinePositionContext.Provider value={timelinePositionMemo}>
      <LasershowSelectableStepsIndexContext.Provider value={lasershowSelectableStepsIndexMemo}>
        <SelectedLasershowAnimationContext.Provider value={selectedLasershowAnimationMemo}>
          <PlayLasershowContext.Provider value={playLasershowMemo}>
            <LasershowStepsToDrawMaxRangeContext.Provider value={stepsToDrawMaxRange}>
              {reactObject}
            </LasershowStepsToDrawMaxRangeContext.Provider>
          </PlayLasershowContext.Provider>
        </SelectedLasershowAnimationContext.Provider>
      </LasershowSelectableStepsIndexContext.Provider>
    </LasershowTimeLinePositionContext.Provider>
  );

  const saveLasershowOnApi = async () => {
    if (selectedLasershow !== null) {
      const canvas: HTMLCanvasElement | null = document.getElementById(
        "points-drawer-canvas"
      ) as HTMLCanvasElement;
      let lasershowToUpdate = { ...selectedLasershow };
      if (canvas !== null) {
        lasershowToUpdate.image = canvas.toDataURL("image/webp", 0.4);
      }

      await saveLasershow(lasershowToUpdate);
    }
  };

  const getPointsToDraw = (
    positionMs: number,
    convertValuesFromPointsDrawer: boolean
  ): Point[][] => {
    const lasershowAnimationsToPlay = selectedLasershow?.lasershowAnimations.filter((la) =>
      numberIsBetweenOrEqual(
        positionMs,
        la.startTimeMs,
        getAnimationDuration(la.animation) + la.startTimeMs
      )
    );

    if (lasershowAnimationsToPlay?.length === 0 || lasershowAnimationsToPlay === undefined) {
      return [];
    }

    let lasershowPoints: Point[][] = [];
    for (let li = 0; li < lasershowAnimationsToPlay.length; li++) {
      const lasershowAnimation = lasershowAnimationsToPlay[li];
      const points = getPointsToDrawFromAnimation(
        positionMs - lasershowAnimation.startTimeMs,
        lasershowAnimation.animation,
        convertValuesFromPointsDrawer
      );
      lasershowPoints = lasershowPoints.concat(points);
    }

    return lasershowPoints;
  };

  const onTimelineItemClick = (uuid: string) => {
    const lasershowAnimation = selectedLasershow?.lasershowAnimations.find(
      (lsa) => lsa.uuid === uuid
    );
    if (lasershowAnimation !== undefined) {
      setSelectedLasershowAnimation(lasershowAnimation);
      setTimelinePositionMs(lasershowAnimation.startTimeMs);
    }
  };

  const deleteSelectedLasershowAnimations = (uuid: string) => {
    const lasershowAnimationToRemove = selectedLasershow?.lasershowAnimations.find(
      (lsa) => lsa.uuid === uuid
    );

    if (selectedLasershow === undefined || lasershowAnimationToRemove === undefined) {
      return;
    }

    if (!window.confirm(`Are you sure you want to remove ${lasershowAnimationToRemove.name}?`)) {
      return;
    }

    let updatedLasershow = { ...selectedLasershow } as Lasershow;
    const animationsToKeep = updatedLasershow.lasershowAnimations?.filter((a) => a.uuid !== uuid);

    updatedLasershow.lasershowAnimations = animationsToKeep;
    setSelectedLasershow(updatedLasershow);
  };

  const onMoveTimelineItem = (forward: boolean) => {
    if (selectedLasershow === null) {
      return;
    }

    let updatedLasershow = { ...selectedLasershow } as Lasershow;
    const lasershowAnimationIndex = updatedLasershow.lasershowAnimations.findIndex(
      (ap) => ap.uuid === selectedLasershowAnimation?.uuid
    );
    if (forward) {
      updatedLasershow.lasershowAnimations[lasershowAnimationIndex].startTimeMs += 10;
    } else if (
      !forward &&
      updatedLasershow.lasershowAnimations[lasershowAnimationIndex].startTimeMs > 0
    ) {
      updatedLasershow.lasershowAnimations[lasershowAnimationIndex].startTimeMs -= 10;
    }

    setSelectedLasershow(updatedLasershow);
    setTimelinePositionMs(
      updatedLasershow.lasershowAnimations[lasershowAnimationIndex].startTimeMs
    );
  };

  return (
    <>
      <Grid container direction="row" spacing={1}>
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
                    tabName: "Lasershow manager",
                    tabChildren: <LasershowManager />,
                  },
                  {
                    tabName: "Lasershow animation properties",
                    tabChildren: <LasershowAnimationProperties />,
                  },
                  {
                    tabName: "Export lasershow",
                    tabChildren: (
                      <LasershowExport
                        selectedLasershow={selectedLasershow}
                        getPointsToDraw={getPointsToDraw}
                        lasershowDuration={lasershowDuration}
                      />
                    ),
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
          <PointsDrawer pointsToDraw={getPointsToDraw(timelinePositionMs, true)} />
        </Grid>
      </Grid>
      <Grid item xs={12}>
        {selectedLasershow !== null
          ? getWrapperContext(
              <SharedTimeline
                selectedItemUuid={selectedLasershowAnimation?.uuid ?? ""}
                onTimelineItemClick={onTimelineItemClick}
                play={playLasershow}
                setPlay={setPlayLasershow}
                timelinePositionMs={timelinePositionMs}
                setTimelinePositionMs={setTimelinePositionMs}
                totalDuration={lasershowDuration}
                selectableStepsIndex={selectableStepsIndex}
                setSelectableStepsIndex={setSelectableStepsIndex}
                onTimelineItemDelete={deleteSelectedLasershowAnimations}
                onMoveTimelineItem={onMoveTimelineItem}
                timelineItems={selectedLasershow.lasershowAnimations.map((la) => ({
                  uuid: la.uuid,
                  name: la.name,
                  startTime: la.startTimeMs,
                  duration: getAnimationDuration(la.animation),
                  timelineId: la.timelineId,
                }))}
              />
            )
          : null}
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
              window.confirm(
                "Are you sure you want to clear the field? Unsaved changes will be lost"
              )
                ? setSelectedLasershow(null)
                : null
            }
            tooltipTitle="Clear editor field"
          />
          <SpeedDialAction
            icon={<SaveIcon />}
            onClick={saveLasershowOnApi}
            tooltipTitle="Save animation (ctrl + s)"
          />
        </SpeedDial>
      </Grid>
    </>
  );
}
