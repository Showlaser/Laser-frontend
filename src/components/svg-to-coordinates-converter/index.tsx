import * as React from "react";
import { showSuccess, showError, toastSubject } from "services/shared/toast-messages";
import "./index.css";
import { Grid, SpeedDial, SpeedDialAction } from "@mui/material";
import { Point } from "models/components/shared/point";
import { rotatePoint } from "services/shared/math";
import ToLaserProjector from "components/shared/to-laser-projector";
import TabSelector, { TabSelectorData } from "components/tabs";
import GeneralSection from "./sections/general-section";
import PointsSection from "./sections/points-section";
import { prepareCanvas, svgToPoints } from "services/logic/svg-to-coordinates-converter";
import { Pattern } from "models/components/shared/pattern";
import SettingsIcon from "@mui/icons-material/Settings";
import SaveIcon from "@mui/icons-material/Save";
import ClearIcon from "@mui/icons-material/Clear";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import { addItemToVersionHistory } from "services/shared/version-history";

type Props = {
  uploadedFile: File;
  setUploadedFile: (file: any) => void;
};

export default function SvgToCoordinatesConverter({ uploadedFile, setUploadedFile }: Props) {
  const [uploadedFileName, setUploadedFileName] = React.useState<string>("");
  const [scale, setScale] = React.useState<number>(4);
  const [numberOfPoints, setNumberOfPoints] = React.useState<number>(200);
  const [xOffset, setXOffset] = React.useState<number>(0);
  const [yOffset, setYOffset] = React.useState<number>(0);
  const [showPointNumber, setShowPointNumber] = React.useState<boolean>(false);
  const [rotation, setRotation] = React.useState<number>(0);
  const [points, setPoints] = React.useState<Point[]>([]);
  const [selectedPointsUuid, setSelectedPointsUuid] = React.useState<string[]>([]);

  const pattern: Pattern = {
    name: uploadedFileName,
    points,
    scale,
    xOffset,
    yOffset,
    rotation,
  };

  const alertUser = (e: BeforeUnloadEvent) => {
    e.preventDefault();
    e.returnValue = "Are you sure you want to leave the page?";
  };

  React.useEffect(() => {
    onFileUpload(uploadedFile);
    window.addEventListener("beforeunload", alertUser);
    return () => {
      window.removeEventListener("beforeunload", alertUser);
    };
  }, [uploadedFile, numberOfPoints]);

  React.useEffect(() => {
    drawOnCanvas(points);
  }, [xOffset, yOffset, rotation, showPointNumber, scale, selectedPointsUuid, points]);

  const onInvalidFile = () => {
    showError(toastSubject.invalidFile);
    setUploadedFile(undefined);
  };

  const onFileUpload = (file: File) => {
    if (file.type !== "image/svg+xml") {
      onInvalidFile();
      return;
    }

    const reader = new FileReader();
    reader.onload = function () {
      const result = reader.result;
      const convertedPoints = svgToPoints(result, numberOfPoints);
      if (convertedPoints.length === 0) {
        onInvalidFile();
        return;
      }

      setPoints(convertedPoints);
      drawOnCanvas(convertedPoints);
      setUploadedFileName(file.name.substring(0, file.name.length - 4));
    };

    reader.readAsText(file);
  };

  const applySettingsToPoints = (dotsToDrawLength: number, dotsToDraw: Point[]) => {
    let updatedPoints: Point[] = [];
    for (let index = 0; index < dotsToDrawLength; index++) {
      let rotatedPoint: Point = rotatePoint({ ...dotsToDraw[index] }, rotation, xOffset, yOffset);

      rotatedPoint.x += xOffset;
      rotatedPoint.y += yOffset;
      rotatedPoint.x *= scale;
      rotatedPoint.y *= scale;
      updatedPoints.push(rotatedPoint);
    }
    return updatedPoints;
  };

  const drawOnCanvas = (dotsToDraw: Point[]) => {
    const dotsToDrawLength = dotsToDraw.length;
    const updatedPoints: Point[] = applySettingsToPoints(dotsToDrawLength, dotsToDraw);

    const screenScale = window.devicePixelRatio || 1;
    const canvas = document.getElementById("svg-canvas") as HTMLCanvasElement;
    const ctx = prepareCanvas(canvas);
    if (ctx === null) {
      return;
    }

    for (let index = 0; index < dotsToDrawLength; index++) {
      const point = updatedPoints[index];
      const pointIsHighlighted = selectedPointsUuid.some((sp) => sp === point.uuid);
      drawPoint(ctx, point, pointIsHighlighted, index, updatedPoints, screenScale);
    }
  };

  const drawPoint = (
    ctx: CanvasRenderingContext2D,
    point: Point,
    pointIsHighlighted: boolean,
    index: number,
    updatedPoints: Point[],
    screenScale: number
  ) => {
    let dotThickness: number = 2;
    let color: string = point.colorRgb;
    if (pointIsHighlighted) {
      color = "#4287f5";
      dotThickness = 3;
    }

    ctx.font = "10px sans-serif";
    ctx.fillStyle = color;
    ctx.beginPath();

    if (showPointNumber) {
      if (pointIsHighlighted) {
        ctx.font = "20px sans-serif";
        ctx.fillStyle = "#4287f5";
      }

      ctx.fillText(index.toString(), point.x, point.y);
    }

    if (point.connectedToPointOrderNr !== null && point.connectedToPointOrderNr >= 0) {
      const nextPoint = updatedPoints[point.connectedToPointOrderNr];
      drawLine(point, nextPoint, ctx);
    } else if (point.connectedToPointOrderNr === null) {
      drawDot(ctx, point, screenScale, dotThickness);
    }
  };

  const drawDot = (ctx: CanvasRenderingContext2D, point: Point, screenScale: number, dotThickness: number) => {
    ctx.arc(point.x * screenScale, point.y * screenScale, dotThickness, 0, 2 * Math.PI, true);
    ctx.fill();
    ctx.closePath();
  };

  const drawLine = (fromPoint: Point, toPoint: Point, ctx: CanvasRenderingContext2D) => {
    ctx.moveTo(fromPoint.x, fromPoint.y);
    ctx.lineTo(toPoint.x, toPoint.y);
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  const onSave = () => {
    localStorage.setItem("pattern", JSON.stringify(pattern));
    addItemToVersionHistory("Pattern editor", pattern);
    showSuccess(toastSubject.changesSaved);
  };

  const sectionProps = {
    scale,
    setScale,
    numberOfPoints,
    setNumberOfPoints,
    xOffset,
    setXOffset,
    yOffset,
    setYOffset,
    rotation,
    setRotation,
    showPointNumber,
    setShowPointNumber,
    points,
    setPoints,
    selectedPointsUuid,
    setSelectedPointsUuid,
    fileName: uploadedFileName,
    setFileName: setUploadedFileName,
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
      <div id="svg-canvas-container">
        <canvas id="svg-canvas" />
      </div>
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
              ? setUploadedFile(undefined)
              : null
          }
          tooltipTitle="Clear editor field"
        />
        <SpeedDialAction icon={<SaveIcon />} onClick={() => onSave()} tooltipTitle="Save pattern" />
      </SpeedDial>
    </Grid>
  );
}
