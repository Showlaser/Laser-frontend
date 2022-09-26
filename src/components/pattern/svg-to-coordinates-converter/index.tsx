import * as React from "react";
import { showSuccess, showError, toastSubject } from "services/shared/toast-messages";
import "./index.css";
import { Grid, SpeedDial, SpeedDialAction } from "@mui/material";
import { Point } from "models/components/shared/point";
import { getLargestNumber, rotatePoint, createGuid } from "services/shared/math";
import ToLaserProjector from "components/shared/to-laser-projector";
import TabSelector, { TabSelectorData } from "components/tabs";
import GeneralSection from "./sections/general-section";
import PointsSection from "./sections/points-section";
import { getHeightAnWidthOfPattern, prepareCanvas, svgToPoints } from "services/logic/svg-to-coordinates-converter";
import { Pattern, getPatternPlaceHolder } from "models/components/shared/pattern";
import SettingsIcon from "@mui/icons-material/Settings";
import SaveIcon from "@mui/icons-material/Save";
import ClearIcon from "@mui/icons-material/Clear";
import { addItemToVersionHistory } from "services/shared/version-history";
import { rgbColorStringFromPoint } from "services/shared/converters";
import { savePattern } from "services/logic/pattern-logic";
import { getRandomObjectName } from "services/shared/random-object-name-generator";
import PointsDrawer from "components/shared/points-drawer";

type Props = {
  patternNamesInUse: string[];
  uploadedFile: File;
  setUploadedFile: (file: any) => void;
  patternFromServer: Pattern | null;
  clearServerPattern: () => void;
};

export default function SvgToCoordinatesConverter({
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
  const [uploadedFileName, setUploadedFileName] = React.useState<string>("");
  const [numberOfPoints, setNumberOfPoints] = React.useState<number>(200);
  const [showPointNumber, setShowPointNumber] = React.useState<boolean>(false);
  const [selectedPointsUuid, setSelectedPointsUuid] = React.useState<string[]>([]);
  const [patternNameIsInUse, setPatternNameIsInUse] = React.useState<boolean>(false);
  const [pointsToDraw, setPointToDraw] = React.useState<Point[]>([]);

  const alertUser = (e: BeforeUnloadEvent) => {
    e.preventDefault();
    e.returnValue = "Are you sure you want to leave the page?";
  };

  React.useEffect(() => {
    if (uploadedFile === undefined) {
      return;
    }

    onFileUpload(uploadedFile);
    window.addEventListener("beforeunload", alertUser);
    return () => {
      window.removeEventListener("beforeunload", alertUser);
    };
  }, [uploadedFile, numberOfPoints]);

  React.useEffect(() => {
    const updatedPoints: Point[] = applySettingsToPoints(pattern.points.length, pattern.points);
    setPointToDraw(updatedPoints);
  }, [showPointNumber, selectedPointsUuid, pattern]);

  const onInvalidFile = () => {
    showError(toastSubject.invalidFile);
    setUploadedFile(undefined);
  };

  const clearEditor = () => {
    setUploadedFile(undefined);
    clearServerPattern();
  };

  const updatePatternProperty = (property: string, value: any) => {
    let updatedPattern: any = { ...pattern };
    updatedPattern[property] = value;
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
      const convertedPoints = svgToPoints(result, numberOfPoints, pattern.uuid);
      if (convertedPoints.length === 0) {
        onInvalidFile();
        return;
      }

      updatePatternProperty("points", convertedPoints);
      setUploadedFileName(file.name.substring(0, file.name.length - 4));
      fitPatternInCanvas(convertedPoints);
    };

    reader.readAsText(file);
  };

  const fitPatternInCanvas = (convertedPoints: Point[]) => {
    const heightAndWidth = getHeightAnWidthOfPattern(convertedPoints);
    const widthOfCanvas = 150;

    if (heightAndWidth.height > widthOfCanvas || heightAndWidth.width > widthOfCanvas) {
      const largestNumber = getLargestNumber(heightAndWidth.height, heightAndWidth.width);
      const percentageDifference = 100 - (widthOfCanvas / largestNumber) * 100;
      const newScale = Math.round(((pattern.scale * (100 - percentageDifference)) / 100) * 10) / 10;
      updatePatternProperty("scale", newScale);
    }
  };

  const applySettingsToPoints = (dotsToDrawLength: number, dotsToDraw: Point[]) => {
    let updatedPoints: Point[] = [];
    for (let index = 0; index < dotsToDrawLength; index++) {
      let rotatedPoint: Point = rotatePoint(
        { ...dotsToDraw[index] },
        pattern.rotation,
        pattern.xOffset,
        pattern.yOffset
      );

      rotatedPoint.x += pattern.xOffset;
      rotatedPoint.y += pattern.yOffset;
      rotatedPoint.x *= pattern.scale;
      rotatedPoint.y *= pattern.scale;
      updatedPoints.push(rotatedPoint);
    }
    return updatedPoints;
  };

  const onSave = async () => {
    if (patternNameIsInUse) {
      showError(toastSubject.duplicatedName);
      return;
    }

    const canvas: HTMLCanvasElement | null = document.getElementById("svg-canvas") as HTMLCanvasElement;
    let patternToUpdate = { ...pattern };
    if (canvas !== null) {
      patternToUpdate.image = canvas.toDataURL();
      setPattern(patternToUpdate);
    }

    await savePattern(patternToUpdate);
    localStorage.setItem("pattern", JSON.stringify(patternToUpdate));
    addItemToVersionHistory("Pattern editor", patternToUpdate);
    showSuccess(toastSubject.changesSaved);
    setPattern(patternToUpdate);
  };

  const sectionProps = {
    patternNamesInUse,
    setPatternNameIsInUse,
    pattern,
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

  return (
    <Grid container spacing={3} style={{ width: "50%" }}>
      <Grid item style={{ width: "100%" }}>
        <TabSelector data={tabSelectorData} />
      </Grid>
      <br />
      <PointsDrawer
        selectedPointsUuid={selectedPointsUuid}
        showPointNumber={showPointNumber}
        pointsToDraw={pointsToDraw}
      />
      <SpeedDial
        ariaLabel="SpeedDial basic example"
        sx={{ position: "absolute", bottom: 30, right: 30 }}
        icon={<SettingsIcon />}
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
        <SpeedDialAction icon={<SaveIcon />} onClick={() => onSave()} tooltipTitle="Save pattern" />
      </SpeedDial>
    </Grid>
  );
}
