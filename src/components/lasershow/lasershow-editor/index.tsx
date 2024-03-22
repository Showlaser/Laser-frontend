import React, { useEffect, useState } from "react";
import LasershowManager from "./lasershow-manager";
import { Grid, Paper, SpeedDial, SpeedDialAction } from "@mui/material";
import { canvasPxSize, selectableSteps } from "services/shared/config";
import { SelectedLasershowContext, SelectedLasershowContextType } from "pages/lasershow-editor";
import TabSelector from "components/tabs";
import SettingsIcon from "@mui/icons-material/Settings";
import SaveIcon from "@mui/icons-material/Save";
import ClearIcon from "@mui/icons-material/Clear";
import { saveLasershow } from "services/logic/lasershow-logic";
import { LasershowAnimation } from "models/components/shared/lasershow";
import { getAnimationDuration } from "services/logic/animation-logic";

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

export type LasershowDurationContextType = {
  getLasershowDuration: () => number;
};

export const LasershowTimeLinePositionContext = React.createContext<LasershowTimeLineContextType | null>(null);
export const LasershowSelectableStepsIndexContext =
  React.createContext<LasershowSelectableStepsIndexContextType | null>(null);
export const SelectedLasershowAnimationContext = React.createContext<SelectedLasershowAnimationContextType | null>(
  null
);
export const PlayLasershowContext = React.createContext<PlayLasershowContextType | null>(null);
export const LasershowStepsToDrawMaxRangeContext = React.createContext<number>(0);
export const LasershowDurationContext = React.createContext<LasershowDurationContextType | null>(null);

export default function LasershowEditorContent() {
  const { selectedLasershow, setSelectedLasershow } = React.useContext(
    SelectedLasershowContext
  ) as SelectedLasershowContextType;

  const [timelinePositionMs, setTimelinePositionMs] = useState<number>(0);
  const [selectableStepsIndex, setSelectableStepsIndex] = useState<number>(0);
  const [selectedLasershowAnimation, setSelectedLasershowAnimation] = useState<LasershowAnimation | null>(null);
  const [playLasershow, setPlayLasershow] = useState<boolean>(false);
  const [selectedTabId, setSelectedTabId] = React.useState<number>(0);

  const timelinePositionMemo = React.useMemo(
    () => ({ timelinePositionMs, setTimelinePositionMs }),
    [timelinePositionMs]
  );
  const lasershowSelectableStepsIndexMemo = React.useMemo(
    () => ({ selectableStepsIndex, setSelectableStepsIndex }),
    [selectableSteps]
  );
  const selectedLasershowAnimationMemo = React.useMemo(
    () => ({ selectedLasershowAnimation, setSelectedLasershowAnimation }),
    [selectableSteps]
  );

  const stepsToDrawMaxRange = (timelinePositionMs + selectableSteps[selectableStepsIndex] * 10) | 0;

  const playLasershowMemo = React.useMemo(() => ({ playLasershow, setPlayLasershow }), [playLasershow]);

  const getLasershowDuration = () => {
    const times = selectedLasershow?.lasershowAnimations.map((la) => getAnimationDuration(la.animation));
    if (times === undefined) {
      return 0;
    }

    return Math.max(...times);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (playLasershow) {
      if (timelinePositionMs >= getLasershowDuration()) {
        setPlayLasershow(false);
      }

      interval = setInterval(() => setTimelinePositionMs(timelinePositionMs + 10), 10);
    }

    return () => clearInterval(interval);
  }, [playLasershow, selectableStepsIndex, timelinePositionMs, selectedLasershowAnimation]);

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
      await saveLasershow(selectedLasershow);
    }
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
                    tabChildren: <></>,
                  },
                ]}
                selectedTabId={selectedTabId}
                setSelectedTabId={setSelectedTabId}
                disableAnimation={true}
              />
            </Paper>
          </Grid>
        )}
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
      </Grid>
    </>
  );
}
