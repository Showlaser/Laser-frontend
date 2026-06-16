import ClearIcon from "@mui/icons-material/Clear";
import HistoryIcon from "@mui/icons-material/History";
import SaveIcon from "@mui/icons-material/Save";
import SettingsIcon from "@mui/icons-material/Settings";
import { Badge, Grid, Paper, SpeedDial, SpeedDialAction } from "@mui/material";
import PointsDrawer from "components/shared/points-drawer";
import VersionHistoryModal from "components/shared/version-history-modal";
import { SharedTimeline } from "components/shared/shared-timeline";
import TabSelector from "components/tabs";
import {
  Animation,
  AnimationPattern,
  AnimationPatternKeyFrame,
  getAnimationPatternDuration,
} from "models/components/shared/animation";
import {
  SelectedAnimationContext,
  SelectedAnimationContextType,
  SelectedAnimationPatternContext,
  SelectedAnimationPatternContextType,
  SelectedAnimationPatternIndexContext,
} from "pages/animation-editor";
import React, { useEffect, useState } from "react";
import {
  getAnimationDuration,
  getPointsToDrawFromAnimation,
  saveAnimation,
} from "services/logic/animation-logic";
import { playbackFrameRateInFps, selectableSteps } from "services/shared/config";
import { useUnsavedChanges } from "services/shared/use-unsaved-changes";
import { useUndoRedo } from "services/shared/use-undo-redo";
import { addItemToVersionHistory } from "services/shared/version-history";
import AnimationPatternKeyFrames from "./animation-keyframes";
import AnimationManager from "./animation-manager";
import AnimationPatternProperties from "./animation-pattern-properties";

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

export const AnimationTimeLinePositionContext =
  React.createContext<AnimationTimeLineContextType | null>(null);
export const AnimationSelectableStepsIndexContext =
  React.createContext<AnimationSelectableStepsIndexContextType | null>(null);
export const AnimationSelectedKeyFrameContext =
  React.createContext<AnimationSelectedKeyFrameContextType | null>(null);
export const AnimationPlayAnimationContext =
  React.createContext<AnimationPlayAnimationContextType | null>(null);
export const AnimationStepsToDrawMaxRangeContext = React.createContext<number>(0);
export const AnimationDurationContext = React.createContext<AnimationDurationContextType | null>(
  null,
);

export default function AnimationKeyFrameEditor() {
  const selectedAnimationPatternIndex = React.useContext(SelectedAnimationPatternIndexContext);
  const { selectedAnimation, setSelectedAnimation } = React.useContext(
    SelectedAnimationContext,
  ) as SelectedAnimationContextType;
  const { selectedAnimationPattern, setSelectedAnimationPattern } = React.useContext(
    SelectedAnimationPatternContext,
  ) as SelectedAnimationPatternContextType;

  const [timelinePositionMs, setTimelinePositionMs] = useState<number>(0);
  const [selectableStepsIndex, setSelectableStepsIndex] = useState<number>(0);
  const [selectedKeyFrameUuid, setSelectedKeyFrameUuid] = useState<string>("");
  const [playAnimation, setPlayAnimation] = useState<boolean>(false);
  const [selectedTabId, setSelectedTabId] = React.useState<number>(0);
  const [versionHistoryOpen, setVersionHistoryOpen] = useState<boolean>(false);
  const { isDirty, markSaved } = useUnsavedChanges(
    selectedAnimation,
    selectedAnimation?.uuid ?? null,
  );

  const applyAnimation = (animation: Animation) => {
    setSelectedAnimation(animation);
    const syncedPattern = animation.animationPatterns.find(
      (ap) => ap.uuid === selectedAnimationPattern?.uuid,
    );
    if (syncedPattern !== undefined) {
      setSelectedAnimationPattern(syncedPattern);
    }
  };

  const { undo, redo } = useUndoRedo(
    selectedAnimation,
    applyAnimation,
    selectedAnimation?.uuid ?? null,
  );

  const stepsToDrawMaxRange = (timelinePositionMs + selectableSteps[selectableStepsIndex] * 10) | 0;

  const timelinePositionMemo = React.useMemo(
    () => ({ timelinePositionMs, setTimelinePositionMs }),
    [timelinePositionMs],
  );
  const selectedKeyFrameMemo = React.useMemo(
    () => ({ selectedKeyFrameUuid, setSelectedKeyFrameUuid }),
    [selectedKeyFrameUuid],
  );
  const playAnimationMemo = React.useMemo(
    () => ({ playAnimation, setPlayAnimation }),
    [playAnimation],
  );
  const selectableStepsIndexMemo = React.useMemo(
    () => ({ selectableStepsIndex, setSelectableStepsIndex }),
    [selectableStepsIndex],
  );

  useEffect(() => {
    let interval: ReturnType<typeof setTimeout>;
    if (playAnimation) {
      if (selectedAnimation === null) {
        return;
      }

      if (timelinePositionMs >= getAnimationDuration(selectedAnimation)) {
        setPlayAnimation(false);
      }

      interval = setInterval(
        () => setTimelinePositionMs(timelinePositionMs + 1000 / playbackFrameRateInFps),
        10,
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

  const saveAnimationOnApi = async () => {
    if (selectedAnimation !== null) {
      await saveAnimation(selectedAnimation);
      markSaved();
      const canvas = document.getElementById("points-drawer-canvas") as HTMLCanvasElement | null;
      addItemToVersionHistory("Animation", selectedAnimation, {
        name: selectedAnimation.name,
        image: canvas?.toDataURL("image/webp", 0.4),
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
        saveAnimationOnApi();
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
    // eslint-disable-next-line react-hooks/exhaustive-deps -- rebind when the animation/undo handlers change
  }, [selectedAnimation, undo, redo]);

  const updatePatternProperty = (propertyName: string, value: unknown) => {
    if (selectedAnimation?.animationPatterns === undefined) {
      return;
    }

    const updatedAnimation = { ...selectedAnimation } as NonNullable<typeof selectedAnimation>;
    (updatedAnimation.animationPatterns[selectedAnimationPatternIndex] as Record<string, unknown>)[
      propertyName
    ] = value;
    setSelectedAnimation(updatedAnimation);
  };

  const onTimelineItemClick = (uuid: string) => {
    const selectedAnimationPattern = selectedAnimation?.animationPatterns.find(
      (ap) => ap.uuid === uuid,
    );
    if (selectedAnimationPattern !== undefined) {
      setSelectedAnimationPattern(selectedAnimationPattern);
      setTimelinePositionMs(selectedAnimationPattern.startTimeMs);
    }
  };

  const onTimelineItemDelete = (uuid: string) => {
    const animationPatternToRemove = selectedAnimation?.animationPatterns.find(
      (lsa) => lsa.uuid === uuid,
    );

    if (selectedAnimation === null || animationPatternToRemove === undefined) {
      return;
    }

    if (!window.confirm(`Are you sure you want to remove ${animationPatternToRemove.name}?`)) {
      return;
    }

    const updatedAnimation = { ...selectedAnimation } as Animation;
    const animationPatternsToKeep: AnimationPattern[] = updatedAnimation.animationPatterns.filter(
      (ap) => ap.uuid !== uuid,
    );

    updatedAnimation.animationPatterns = animationPatternsToKeep;
    setSelectedAnimation(updatedAnimation);
    setSelectedAnimationPattern(null);
  };

  const onMoveTimelineItem = (forward: boolean) => {
    if (selectedAnimation === undefined) {
      return;
    }

    const updatedAnimation = { ...selectedAnimation } as Animation;
    const animationPatternIndex = updatedAnimation.animationPatterns.findIndex(
      (ap) => ap.uuid === selectedAnimationPattern?.uuid,
    );
    if (forward) {
      updatedAnimation.animationPatterns[animationPatternIndex].startTimeMs += 10;
    } else if (
      !forward &&
      updatedAnimation.animationPatterns[animationPatternIndex].startTimeMs > 0
    ) {
      updatedAnimation.animationPatterns[animationPatternIndex].startTimeMs -= 10;
    }

    setSelectedAnimation(updatedAnimation);
    setTimelinePositionMs(updatedAnimation.animationPatterns[animationPatternIndex].startTimeMs);
  };

  const onTimelineItemMove = (uuid: string, newStartTimeMs: number, newTimelineId: number) => {
    if (selectedAnimation === null) {
      return;
    }

    const updatedAnimation = { ...selectedAnimation } as Animation;
    const index = updatedAnimation.animationPatterns.findIndex((ap) => ap.uuid === uuid);
    if (index === -1) {
      return;
    }

    updatedAnimation.animationPatterns[index].startTimeMs = newStartTimeMs;
    updatedAnimation.animationPatterns[index].timelineId = newTimelineId;
    setSelectedAnimation(updatedAnimation);
    setSelectedAnimationPattern(updatedAnimation.animationPatterns[index]);
    setTimelinePositionMs(newStartTimeMs);
  };

  const deleteKeyframe = (keyFrameUuid: string) => {
    if (selectedAnimation === null || keyFrameUuid.length < 5) {
      return;
    }

    const updatedAnimation: Animation = { ...selectedAnimation };

    if (!window.confirm("Are you sure you want to remove this keyframe")) {
      return;
    }

    const keyFrames =
      updatedAnimation.animationPatterns[selectedAnimationPatternIndex].animationPatternKeyFrames;
    const indexToRemove = keyFrames.findIndex(
      (kf: AnimationPatternKeyFrame) => kf.uuid === keyFrameUuid,
    );
    if (indexToRemove === -1) {
      return;
    }

    const removedKeyFrame = keyFrames[indexToRemove];
    keyFrames.splice(indexToRemove, 1);

    const samePropertyKeyFrames = keyFrames
      .filter(
        (kf: AnimationPatternKeyFrame) => kf.propertyEdited === removedKeyFrame.propertyEdited,
      )
      .sort((a: AnimationPatternKeyFrame, b: AnimationPatternKeyFrame) => a.timeMs - b.timeMs);
    const previousKeyFrame =
      [...samePropertyKeyFrames]
        .reverse()
        .find((kf: AnimationPatternKeyFrame) => kf.timeMs <= removedKeyFrame.timeMs) ??
      samePropertyKeyFrames[0];

    setSelectedKeyFrameUuid(previousKeyFrame?.uuid ?? "");
    setSelectedAnimation(updatedAnimation);
  };

  return (
    <div>
      <Grid container direction="row" spacing={1} key={selectedKeyFrameUuid}>
        {getWrapperContext(
          <Grid item xs={4}>
            <Paper>
              <TabSelector
                data={[
                  {
                    tabName: "Animation manager",
                    tabChildren: <AnimationManager />,
                  },
                  {
                    tabName: "Animation pattern properties",
                    tabChildren: (
                      <AnimationPatternProperties
                        updatePatternProperty={updatePatternProperty}
                        deleteKeyframe={deleteKeyframe}
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
        <Grid item xs>
          {getWrapperContext(<AnimationPatternKeyFrames deleteKeyframe={deleteKeyframe} />)}
        </Grid>
        <Grid item xs>
          <PointsDrawer
            pointsToDraw={getPointsToDrawFromAnimation(timelinePositionMs, selectedAnimation)}
          />
        </Grid>
      </Grid>
      <Grid item xs={12}>
        {selectedAnimation !== null
          ? getWrapperContext(
              <SharedTimeline
                selectedItemUuid={selectedAnimationPattern?.uuid ?? ""}
                onTimelineItemClick={onTimelineItemClick}
                play={playAnimation}
                setPlay={setPlayAnimation}
                timelinePositionMs={timelinePositionMs}
                setTimelinePositionMs={setTimelinePositionMs}
                totalDuration={getAnimationDuration(selectedAnimation)}
                selectableStepsIndex={selectableStepsIndex}
                setSelectableStepsIndex={setSelectableStepsIndex}
                onTimelineItemDelete={onTimelineItemDelete}
                onMoveTimelineItem={onMoveTimelineItem}
                onTimelineItemMove={onTimelineItemMove}
                timelineItems={selectedAnimation.animationPatterns.map((ap) => ({
                  uuid: ap.uuid,
                  name: ap.name,
                  startTime: ap.startTimeMs,
                  duration: getAnimationPatternDuration(ap),
                  timelineId: ap.timelineId,
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
                ? setSelectedAnimation(null)
                : null
            }
            tooltipTitle="Clear editor field"
          />
          <SpeedDialAction
            icon={
              <Badge color="warning" variant="dot" invisible={!isDirty}>
                <SaveIcon />
              </Badge>
            }
            onClick={saveAnimationOnApi}
            tooltipTitle={
              isDirty ? "Save animation — unsaved changes (ctrl + s)" : "Save animation (ctrl + s)"
            }
          />
          <SpeedDialAction
            key="sd-version-history"
            icon={<HistoryIcon />}
            onClick={() => setVersionHistoryOpen(true)}
            tooltipTitle="Version history"
          />
        </SpeedDial>
      </Grid>
      <VersionHistoryModal
        open={versionHistoryOpen}
        pageName="Animation"
        onClose={() => setVersionHistoryOpen(false)}
        onRestore={(state) => applyAnimation(state as Animation)}
      />
    </div>
  );
}
