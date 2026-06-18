import ClearIcon from "@mui/icons-material/Clear";
import HistoryIcon from "@mui/icons-material/History";
import SaveIcon from "@mui/icons-material/Save";
import SettingsIcon from "@mui/icons-material/Settings";
import { Badge, Grid, Paper, SpeedDial, SpeedDialAction } from "@mui/material";
import PointsDrawer from "components/shared/points-drawer";
import { SharedTimeline } from "components/shared/shared-timeline";
import TabSelector from "components/tabs";
import { Lasershow, LasershowAnimation } from "models/components/shared/lasershow";
import { Point } from "models/components/shared/point";
import { SelectedLasershowContext, SelectedLasershowContextType } from "pages/lasershow-editor";
import React, { useEffect, useState } from "react";
import { getAnimationDuration, getPointsToDrawFromAnimation } from "services/logic/animation-logic";
import { getLasershowDuration, saveLasershow } from "services/logic/lasershow-logic";
import { canvasPxSize, playbackFrameRateInFps, selectableSteps } from "services/shared/config";
import { useUnsavedChanges } from "services/shared/use-unsaved-changes";
import { useUndoRedo } from "services/shared/use-undo-redo";
import { numberIsBetweenOrEqual } from "services/shared/math";
import LasershowAnimationProperties from "./lasershow-animation-properties";
import LasershowExport from "./lasershow-export";
import LasershowManager from "./lasershow-manager";
import LasershowOverview from "./lasershow-overview";
import VersionHistoryModal from "components/shared/version-history-modal";
import { addItemToVersionHistory } from "services/shared/version-history";

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
    SelectedLasershowContext,
  ) as SelectedLasershowContextType;

  const [timelinePositionMs, setTimelinePositionMs] = useState<number>(0);
  const [selectableStepsIndex, setSelectableStepsIndex] = useState<number>(0);
  const [selectedLasershowAnimation, setSelectedLasershowAnimation] =
    useState<LasershowAnimation | null>(null);
  const [playLasershow, setPlayLasershow] = useState<boolean>(false);
  const [selectedTabId, setSelectedTabId] = React.useState<number>(0);
  const [versionHistoryOpen, setVersionHistoryOpen] = useState<boolean>(false);
  const { isDirty, markSaved } = useUnsavedChanges(
    selectedLasershow,
    selectedLasershow?.uuid ?? null,
  );

  const applyLasershow = (lasershow: Lasershow) => {
    setSelectedLasershow(lasershow);
    const syncedAnimation = lasershow.lasershowAnimations.find(
      (la) => la.uuid === selectedLasershowAnimation?.uuid,
    );
    if (syncedAnimation !== undefined) {
      setSelectedLasershowAnimation(syncedAnimation);
    }
  };

  const { undo, redo } = useUndoRedo(
    selectedLasershow,
    applyLasershow,
    selectedLasershow?.uuid ?? null,
  );

  const timelinePositionMemo = React.useMemo(
    () => ({ timelinePositionMs, setTimelinePositionMs }),
    [timelinePositionMs],
  );
  const lasershowSelectableStepsIndexMemo = React.useMemo(
    () => ({ selectableStepsIndex, setSelectableStepsIndex }),
    [selectableStepsIndex],
  );
  const selectedLasershowAnimationMemo = React.useMemo(
    () => ({
      selectedLasershowAnimation,
      setSelectedLasershowAnimation,
    }),
    [selectedLasershowAnimation],
  );

  const stepsToDrawMaxRange = (timelinePositionMs + selectableSteps[selectableStepsIndex] * 10) | 0;

  const playLasershowMemo = React.useMemo(
    () => ({ playLasershow, setPlayLasershow }),
    [playLasershow],
  );

  const lasershowDuration = getLasershowDuration(selectedLasershow);

  useEffect(() => {
    let interval: ReturnType<typeof setTimeout>;
    if (playLasershow) {
      if (timelinePositionMs >= lasershowDuration) {
        setPlayLasershow(false);
      }

      interval = setInterval(
        () => setTimelinePositionMs(timelinePositionMs + 1000 / playbackFrameRateInFps),
        10,
      );
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
        "points-drawer-canvas",
      ) as HTMLCanvasElement;
      const lasershowToUpdate = { ...selectedLasershow };
      if (canvas !== null) {
        lasershowToUpdate.image = canvas.toDataURL("image/webp", 0.4);
      }

      await saveLasershow(lasershowToUpdate);
      markSaved();
      addItemToVersionHistory("Lasershow editor", lasershowToUpdate, {
        name: lasershowToUpdate.name,
        image: lasershowToUpdate.image,
      });
    }
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!e.ctrlKey) {
        return;
      }

      if (e.key === "s") {
        e.preventDefault();
        saveLasershowOnApi();
      } else if (e.key === "z") {
        e.preventDefault();
        undo();
      } else if (e.key === "y") {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- rebind when the lasershow/undo handlers change
  }, [selectedLasershow, undo, redo]);

  const getPointsToDraw = (
    positionMs: number,
    convertValuesFromPointsDrawer: boolean,
  ): Point[][] => {
    const lasershowAnimationsToPlay = selectedLasershow?.lasershowAnimations.filter((la) =>
      numberIsBetweenOrEqual(
        positionMs,
        la.startTimeMs,
        getAnimationDuration(la.animation) + la.startTimeMs,
      ),
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
        convertValuesFromPointsDrawer,
      );
      lasershowPoints = lasershowPoints.concat(points);
    }

    return lasershowPoints;
  };

  const onTimelineItemClick = (uuid: string) => {
    const lasershowAnimation = selectedLasershow?.lasershowAnimations.find(
      (lsa) => lsa.uuid === uuid,
    );
    if (lasershowAnimation !== undefined) {
      setSelectedLasershowAnimation(lasershowAnimation);
      setTimelinePositionMs(lasershowAnimation.startTimeMs);
    }
  };

  const deleteSelectedLasershowAnimations = (uuid: string) => {
    const lasershowAnimationToRemove = selectedLasershow?.lasershowAnimations.find(
      (lsa) => lsa.uuid === uuid,
    );

    if (selectedLasershow === undefined || lasershowAnimationToRemove === undefined) {
      return;
    }

    if (!window.confirm(`Are you sure you want to remove ${lasershowAnimationToRemove.name}?`)) {
      return;
    }

    const updatedLasershow = { ...selectedLasershow } as Lasershow;
    const animationsToKeep = updatedLasershow.lasershowAnimations?.filter((a) => a.uuid !== uuid);

    updatedLasershow.lasershowAnimations = animationsToKeep;
    setSelectedLasershow(updatedLasershow);
  };

  const onMoveTimelineItem = (forward: boolean) => {
    if (selectedLasershow === null) {
      return;
    }

    const updatedLasershow = { ...selectedLasershow } as Lasershow;
    const lasershowAnimationIndex = updatedLasershow.lasershowAnimations.findIndex(
      (ap) => ap.uuid === selectedLasershowAnimation?.uuid,
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
      updatedLasershow.lasershowAnimations[lasershowAnimationIndex].startTimeMs,
    );
  };

  const onTimelineItemMove = (uuid: string, newStartTimeMs: number, newTimelineId: number) => {
    if (selectedLasershow === null) {
      return;
    }

    const updatedLasershow = { ...selectedLasershow } as Lasershow;
    const index = updatedLasershow.lasershowAnimations.findIndex((la) => la.uuid === uuid);
    if (index === -1) {
      return;
    }

    updatedLasershow.lasershowAnimations[index].startTimeMs = newStartTimeMs;
    updatedLasershow.lasershowAnimations[index].timelineId = newTimelineId;
    setSelectedLasershow(updatedLasershow);
    setSelectedLasershowAnimation(updatedLasershow.lasershowAnimations[index]);
    setTimelinePositionMs(newStartTimeMs);
  };

  return (
    <>
      <Grid container direction="row" spacing={1}>
        {getWrapperContext(
          <Grid>
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
          </Grid>,
        )}
        <Grid size="grow">
          <PointsDrawer pointsToDraw={getPointsToDraw(timelinePositionMs, true)} />
        </Grid>
        <Grid size={3}>
          <LasershowOverview
            lasershowAnimations={selectedLasershow?.lasershowAnimations ?? []}
            timelinePositionMs={timelinePositionMs}
            selectedUuid={selectedLasershowAnimation?.uuid ?? ""}
            onSelect={onTimelineItemClick}
          />
        </Grid>
      </Grid>
      <Grid size={12}>
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
                onTimelineItemMove={onTimelineItemMove}
                timelineItems={selectedLasershow.lasershowAnimations.map((la) => ({
                  uuid: la.uuid,
                  name: la.name,
                  startTime: la.startTimeMs,
                  duration: getAnimationDuration(la.animation),
                  timelineId: la.timelineId,
                }))}
              />,
            )
          : null}
      </Grid>
      <Grid>
        <SpeedDial
          ariaLabel="SpeedDial basic example"
          sx={{ position: "fixed", bottom: 30, right: 30 }}
          icon={<SettingsIcon />}
          FabProps={{ color: isDirty ? "warning" : "primary" }}
        >
          <SpeedDialAction
            key="sd-upload-clear"
            icon={<ClearIcon />}
            onClick={() =>
              window.confirm(
                "Are you sure you want to clear the field? Unsaved changes will be lost",
              )
                ? setSelectedLasershow(null)
                : null
            }
            title="Clear editor field"
          />
          <SpeedDialAction
            icon={
              <Badge color="warning" variant="dot" invisible={!isDirty}>
                <SaveIcon />
              </Badge>
            }
            onClick={saveLasershowOnApi}
            title={
              isDirty ? "Save lasershow — unsaved changes (ctrl + s)" : "Save lasershow (ctrl + s)"
            }
          />
          <SpeedDialAction
            key="sd-version-history"
            icon={<HistoryIcon />}
            onClick={() => setVersionHistoryOpen(true)}
            title="Version history"
          />
        </SpeedDial>
      </Grid>
      <VersionHistoryModal
        open={versionHistoryOpen}
        pageName="Lasershow editor"
        onClose={() => setVersionHistoryOpen(false)}
        onRestore={(state) => applyLasershow(state as Lasershow)}
      />
    </>
  );
}
