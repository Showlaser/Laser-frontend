import * as React from "react";
import { showError, toastSubject } from "services/shared/toast-messages";
import "./index.css";
import { Grid } from "@mui/material";
import { Point } from "models/components/shared/point";
import { createGuid, rotatePoint } from "services/shared/math";
import ToLaserProjector from "components/shared/to-laser-projector";
import TabSelector, { TabSelectorData } from "components/tabs";
import GeneralSection from "./sections/general-section";
import PointsSection from "./sections/points-section";
import { prepareCanvas, svgToPoints } from "services/logic/svg-to-coordinates-converter";

export interface SectionProps {
  scale: number;
  setScale: (value: number) => void;
  numberOfPoints: number;
  setNumberOfPoints: (value: number) => void;
  xOffset: number;
  setXOffset: (value: number) => void;
  yOffset: number;
  setYOffset: (value: number) => void;
  rotation: number;
  setRotation: (value: number) => void;
  connectDots: boolean;
  setConnectDots: (value: boolean) => void;
  showPointNumber: boolean;
  setShowPointNumber: (value: boolean) => void;
  points: Point[];
  setPoints: (points: Point[]) => void;
  selectedPointsUuid: string[];
  setSelectedPointsUuid: (value: string[]) => void;
}

type Props = {
  uploadedFile: File;
};

export default function SvgToCoordinatesConverter({ uploadedFile }: Props) {
  const [uploadedFileName, setUploadedFileName] = React.useState<string>();
  const [rawSvg, setRawSvg] = React.useState<string | ArrayBuffer | null>();
  const [scale, setScale] = React.useState<number>(4);
  const [numberOfPoints, setNumberOfPoints] = React.useState<number>(200);
  const [xOffset, setXOffset] = React.useState<number>(0);
  const [yOffset, setYOffset] = React.useState<number>(0);
  const [connectDots, setConnectDots] = React.useState<boolean>(false);
  const [showPointNumber, setShowPointNumber] = React.useState<boolean>(false);
  const [rotation, setRotation] = React.useState<number>(0);
  const [points, setPoints] = React.useState<Point[]>([]);
  const [selectedPointsUuid, setSelectedPointsUuid] = React.useState<string[]>([]);

  React.useEffect(() => {
    onFileUpload(uploadedFile);
  }, [uploadedFile, numberOfPoints]);

  React.useEffect(() => {
    drawOnCanvas(points);
  }, [xOffset, yOffset, connectDots, rotation, showPointNumber, scale, selectedPointsUuid]);

  const onFileUpload = (file: File) => {
    if (file.type !== "image/svg+xml") {
      showError(toastSubject.invalidFile);
      return;
    }

    const reader = new FileReader();
    reader.onload = function () {
      const result = reader.result;
      setRawSvg(result);
      const convertedPoints = svgToPoints(result, numberOfPoints);
      setPoints(convertedPoints);
      drawOnCanvas(convertedPoints);
      setUploadedFileName(file.name);
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
      drawDot(ctx, point, pointIsHighlighted, index, updatedPoints, dotsToDrawLength, screenScale);
    }
  };

  const drawDot = (
    ctx: CanvasRenderingContext2D,
    point: Point,
    pointIsHighlighted: boolean,
    index: number,
    updatedPoints: Point[],
    dotsToDrawLength: number,
    screenScale: number
  ) => {
    const dotThickness: number = 2;
    let color: string = point.colorRgb ? point.colorRgb : "#ffffff";
    if (pointIsHighlighted) {
      color = "#4287f5";
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

    connectDots
      ? drawDotsConnected(updatedPoints, index, dotsToDrawLength, ctx)
      : drawDots(ctx, point, screenScale, dotThickness);
  };

  function drawDots(ctx: CanvasRenderingContext2D, d: Point, screenScale: number, dotThickness: number) {
    ctx.arc(d.x * screenScale, d.y * screenScale, dotThickness, 0, 2 * Math.PI, true);
    ctx.fill();
    ctx.closePath();
  }

  const drawDotsConnected = (
    dotsToDraw: Point[],
    index: number,
    dotsToDrawLength: number,
    ctx: CanvasRenderingContext2D
  ) => {
    const currentCoordinates = dotsToDraw[index];
    if (index === dotsToDrawLength - 1) {
      const firstCoordinates = dotsToDraw[0];
      ctx.moveTo(currentCoordinates.x, currentCoordinates.y);
      ctx.lineTo(firstCoordinates.x, firstCoordinates.y);
    } else {
      const nextCoordinates = dotsToDraw[index + 1];
      ctx.moveTo(currentCoordinates.x, currentCoordinates.y);
      ctx.lineTo(nextCoordinates.x, nextCoordinates.y);
    }

    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.stroke();
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
    connectDots,
    setConnectDots,
    showPointNumber,
    setShowPointNumber,
    points,
    setPoints,
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
      <div id="svg-canvas-container">
        <canvas id="svg-canvas" />
      </div>
    </Grid>
  );
}
