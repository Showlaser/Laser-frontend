import ClearIcon from "@mui/icons-material/Clear";
import HistoryIcon from "@mui/icons-material/History";
import SaveIcon from "@mui/icons-material/Save";
import SettingsIcon from "@mui/icons-material/Settings";
import { Badge, Grid, SpeedDial, SpeedDialAction } from "@mui/material";
import PointsDrawer from "components/shared/points-drawer";
import ToLaserProjector from "components/shared/to-laser-projector";
import VersionHistoryModal from "components/shared/version-history-modal";
import TabSelector, { TabSelectorData } from "components/tabs";
import { Pattern, getPatternPlaceHolder } from "models/components/shared/pattern";
import { Point } from "models/components/shared/point";
import * as React from "react";
import { useEffect } from "react";
import { savePattern } from "services/logic/pattern-logic";
import { svgToPoints } from "services/logic/svg-to-coordinates-converter";
import { applyParametersToPointsForCanvasByPattern } from "services/shared/converters";
import { showError, showSuccess, toastSubject } from "services/shared/toast-messages";
import { addItemToVersionHistory } from "services/shared/version-history";
import { useUnsavedChanges } from "services/shared/use-unsaved-changes";
import { useUndoRedo } from "services/shared/use-undo-redo";
import GeneralSection from "./sections/general-section";
import PointsSection from "./sections/points-section";

type Props = {
  patternNamesInUse: string[];
  uploadedFile: File | undefined;
  setUploadedFile: (file: File | undefined) => void;
  patternFromServer: Pattern | null;
  clearServerPattern: () => void;
};

export default function PatternEditor({
  patternNamesInUse,
  uploadedFile,
  setUploadedFile,
  patternFromServer,
  clearServerPattern,
}: Props) {
  const patternPlaceHolder: Pattern = getPatternPlaceHolder();

  const [pattern, setPattern] = React.useState<Pattern>(
    patternFromServer === null ? patternPlaceHolder : patternFromServer
  );
  const [numberOfPoints, setNumberOfPoints] = React.useState<number>(200);
  const [showPointNumber, setShowPointNumber] = React.useState<boolean>(false);
  const [selectedPointsUuid, setSelectedPointsUuid] = React.useState<string[]>([]);
  const [patternNameIsInUse, setPatternNameIsInUse] = React.useState<boolean>(false);
  const [pointsToDraw, setPointToDraw] = React.useState<Point[]>([]);
  const [selectedTabId, setSelectedTabId] = React.useState<number>(0);
  const [versionHistoryOpen, setVersionHistoryOpen] = React.useState<boolean>(false);

  const { isDirty, markSaved } = useUnsavedChanges(pattern, pattern.uuid);
  const { undo, redo } = useUndoRedo(pattern, setPattern, pattern.uuid);

  useEffect(() => {
    if (uploadedFile === undefined) {
      return;
    }

    onFileUpload(uploadedFile);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run when the uploaded file/point count changes
  }, [uploadedFile, numberOfPoints]);

  useEffect(() => {
    const pointsToDraw: Point[] = applyParametersToPointsForCanvasByPattern(pattern);
    setPointToDraw(pointsToDraw);
  }, [showPointNumber, selectedPointsUuid, pattern]);

  const onInvalidFile = () => {
    showError(toastSubject.invalidFile);
    setUploadedFile(undefined);
  };

  const clearEditor = () => {
    setUploadedFile(undefined);
    clearServerPattern();
  };

  const updatePatternProperty = (property: string, value: unknown) => {
    const updatedPattern = { ...pattern };
    (updatedPattern as Record<string, unknown>)[property] = value;
    setPattern(updatedPattern);
  };

  const onFileUpload = (file: File) => {
    if (file.type !== "image/svg+xml") {
      onInvalidFile();
      return;
    }

    const reader = new FileReader();
    reader.onload = function () {
      const result = reader.result;
      if (typeof result !== "string") {
        onInvalidFile();
        return;
      }
      const convertedPoints = svgToPoints(result, numberOfPoints, pattern.uuid);
      if (convertedPoints.length === 0) {
        onInvalidFile();
        return;
      }

      updatePatternProperty("points", convertedPoints);
    };

    reader.readAsText(file);
  };

  const onSave = async () => {
    if (patternNameIsInUse) {
      showError(toastSubject.duplicatedName);
      return;
    }

    const canvas: HTMLCanvasElement | null = document.getElementById(
      "points-drawer-canvas"
    ) as HTMLCanvasElement;
    const patternToUpdate = { ...pattern };
    if (canvas !== null) {
      patternToUpdate.image = canvas.toDataURL("image/webp", 0.4);
      setPattern(patternToUpdate);
    }

    await savePattern(patternToUpdate);
    localStorage.setItem("pattern", JSON.stringify(patternToUpdate));
    addItemToVersionHistory("Pattern editor", patternToUpdate, {
      name: patternToUpdate.name,
      image: patternToUpdate.image,
    });
    showSuccess(toastSubject.changesSaved);
    setPattern(patternToUpdate);
    markSaved(patternToUpdate);
  };

  const sectionProps = {
    patternNamesInUse,
    setPatternNameIsInUse,
    pattern,
    setPattern,
    updatePatternProperty,
    numberOfPoints,
    setNumberOfPoints,
    showPointNumber,
    setShowPointNumber,
    selectedPointsUuid,
    setSelectedPointsUuid,
  };

  const tabSelectorData: TabSelectorData[] = [
    {
      tabName: "General",
      tabChildren: <GeneralSection {...sectionProps} />,
    },
    {
      tabName: "Points",
      tabChildren: <PointsSection {...sectionProps} />,
    },
    {
      tabName: "Send to laser",
      tabChildren: <ToLaserProjector {...sectionProps} />,
    },
  ];

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!e.ctrlKey) {
      return;
    }

    if (e.key === "s") {
      e.preventDefault();
      onSave();
    } else if (e.key === "z") {
      e.preventDefault();
      undo();
    } else if (e.key === "y") {
      e.preventDefault();
      redo();
    }
  };

  return (
    <Grid
      style={{ outline: "none" }}
      container
      tabIndex={0}
      onKeyDown={onKeyDown}
      direction="row"
      spacing={2}
    >
      <Grid size={6.5}>
        <TabSelector
          data={tabSelectorData}
          selectedTabId={selectedTabId}
          setSelectedTabId={setSelectedTabId}
        />
      </Grid>
      <Grid sx={{ marginLeft: "40px" }}>
        <PointsDrawer
          selectedPointsUuid={selectedPointsUuid}
          showPointNumber={showPointNumber}
          pointsToDraw={[pointsToDraw]}
        />
      </Grid>
      <SpeedDial
        ariaLabel="SpeedDial basic example"
        id="svg-to-coordinates-converter-speeddial"
        sx={{ position: "fixed", bottom: 30, right: 30 }}
        icon={<SettingsIcon />}
        FabProps={{ color: isDirty ? "warning" : "primary" }}
      >
        <SpeedDialAction
          key="sd-upload-clear"
          icon={<ClearIcon />}
          onClick={() =>
            window.confirm("Are you sure you want to clear the field? Unsaved changes will be lost")
              ? clearEditor()
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
          onClick={() => onSave()}
          tooltipTitle={
            isDirty ? "Save pattern — unsaved changes (ctrl + s)" : "Save pattern (ctrl + s)"
          }
        />
        <SpeedDialAction
          key="sd-version-history"
          icon={<HistoryIcon />}
          onClick={() => setVersionHistoryOpen(true)}
          tooltipTitle="Version history"
        />
      </SpeedDial>
      <VersionHistoryModal
        open={versionHistoryOpen}
        pageName="Pattern editor"
        onClose={() => setVersionHistoryOpen(false)}
        onRestore={(state) => setPattern(state as Pattern)}
      />
    </Grid>
  );
}
