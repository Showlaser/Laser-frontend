import * as React from "react";
import { showError, toastSubject } from "services/shared/toast-messages";
import { range } from "d3-array";
import "./index.css";
import { Grid } from "@mui/material";
import { Point } from "models/components/shared/point";
import { createGuid, rotatePoint } from "services/shared/math";
import ToLaserProjector from "components/shared/to-laser-projector";
import TabSelector, { TabSelectorData } from "components/tabs";
import GeneralSection from "./sections/general-section";
import PointsSection from "./sections/points-section";
const flattenSVG = require("flatten-svg");

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
  const [selectedPointsUuid, setSelectedPointsUuid] = React.useState<string[]>(
    []
  );

  React.useEffect(() => {
    onFileUpload(uploadedFile);
  }, [uploadedFile, numberOfPoints]);

  React.useEffect(() => {
    onParametersChange();
  }, [
    xOffset,
    yOffset,
    connectDots,
    rotation,
    showPointNumber,
    scale,
    selectedPointsUuid,
  ]);

  const onFileUpload = (file: File) => {
    if (file.type !== "image/svg+xml") {
      showError(toastSubject.invalidFile);
      return;
    }

    const reader = new FileReader();
    reader.onload = function () {
      const result = reader.result;
      setRawSvg(result);
      const convertedPoints = svgToPoints(result);
      setPoints(convertedPoints);
      drawOnCanvas(convertedPoints);
      setUploadedFileName(file.name);
    };

    reader.readAsText(file);
  };

  const onParametersChange = () => drawOnCanvas(points);

  const svgToPoints = (svg: any): Point[] => {
    if (!svg) {
      if (!rawSvg) {
        return [];
      }

      svg = rawSvg;
    }

    const pathsOnly = pathologize(svg);
    let newDiv = document.createElement("div");
    newDiv.innerHTML = pathsOnly;

    let paths: any = newDiv?.getElementsByTagName("path");
    if (paths.length === 0) {
      showError(toastSubject.invalidFile);
      return [];
    }

    const coordinates = pathsToCoords(paths);
    return mapCoordinatesToXAndYPoint(coordinates);
  };

  const createPoint = (x: number, y: number, orderNr: number): Point => ({
    uuid: createGuid(),
    colorRgb: "#ffffff",
    connectedToPointOrderNr: null,
    orderNr: orderNr,
    x,
    y,
  });

  const mapCoordinatesToXAndYPoint = (coordinates: any): Point[] => {
    const length = coordinates.length;
    const mappedCoordinates = new Array<Point>(length);
    for (let i = 0; i < length; i++) {
      const x: number = coordinates[i][0];
      const y: number = coordinates[i][1];
      mappedCoordinates[i] = createPoint(x, y, i);
    }

    return mappedCoordinates;
  };

  const prepareCanvas = (
    canvas: HTMLCanvasElement
  ): CanvasRenderingContext2D | null => {
    canvas.width = 650;
    canvas.height = 650;
    canvas.style.width = "650";
    canvas.style.height = "650";
    const ctx = canvas.getContext("2d");
    if (ctx === null) {
      return null;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.moveTo(0, 300);
    ctx.lineTo(600, 300);

    ctx.strokeStyle = "#706f6f";
    ctx.lineWidth = 0.1;
    ctx.stroke();

    ctx.moveTo(300, 0);
    ctx.lineTo(300, 600);

    ctx.stroke();
    return ctx;
  };

  const applySettingsToPoints = (
    dotsToDrawLength: number,
    dotsToDraw: Point[],
    rotation: number,
    xOffset: number,
    yOffset: number,
    scale: number
  ) => {
    let updatedPoints: Point[] = [];
    for (let index = 0; index < dotsToDrawLength; index++) {
      let rotatedPoint: Point = rotatePoint(
        { ...dotsToDraw[index] },
        rotation,
        xOffset,
        yOffset
      );

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
    let updatedPoints: Point[] = applySettingsToPoints(
      dotsToDrawLength,
      dotsToDraw,
      rotation,
      xOffset,
      yOffset,
      scale
    );

    const screenScale = window.devicePixelRatio || 1;
    const canvas = document.getElementById("svg-canvas") as HTMLCanvasElement;
    const ctx = prepareCanvas(canvas);
    if (ctx === null) {
      return;
    }

    const dotThickness: number = 2;
    for (let index = 0; index < dotsToDrawLength; index++) {
      const rotatedPoint = updatedPoints[index];
      const pointIsHighlighted = selectedPointsUuid.some(
        (sp) => sp === rotatedPoint.uuid
      );

      let color: string = rotatedPoint.colorRgb
        ? rotatedPoint.colorRgb
        : "#ffffff";

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

        ctx.fillText(index.toString(), rotatedPoint.x, rotatedPoint.y);
      }

      connectDots
        ? drawDotsConnected(updatedPoints, index, dotsToDrawLength, ctx)
        : drawDots(ctx, rotatedPoint, screenScale, dotThickness);
    }
  };

  const pathologize = (original: string) => {
    //handles issues with pathologist not parsing text and style elements
    const reText = /<text[\s\S]*?<\/text>/g;
    const reStyle = /<style[\s\S]*?<\/style>/g;
    const removedText = original.replace(reText, "");
    const removedStyle = removedText.replace(reStyle, "");

    try {
      return flattenSVG(removedStyle);
    } catch (e) {
      return original;
    }
  };

  const pathsToCoords = (paths: any) => {
    const totalLengthAllPaths: any = getTotalLengthAllPaths(paths);

    let runningPointsTotal = 0;
    return Array.from(paths).reduce((prev: any, item: any, index) => {
      let pointsForPath;
      if (index + 1 === paths.length) {
        //ensures that the total number of points = the actual requested number (because using rounding)
        pointsForPath = numberOfPoints - runningPointsTotal;
      } else {
        pointsForPath = Math.round(
          (numberOfPoints * item.getTotalLength()) / totalLengthAllPaths
        );
        runningPointsTotal += pointsForPath;
      }
      return [...prev, ...polygonize(item, pointsForPath)];
    }, []);
  };

  function drawDots(
    ctx: CanvasRenderingContext2D,
    d: Point,
    screenScale: number,
    dotThickness: number
  ) {
    ctx.arc(
      d.x * screenScale,
      d.y * screenScale,
      dotThickness,
      0,
      2 * Math.PI,
      true
    );
    ctx.fill();
    ctx.closePath();
  }

  function drawDotsConnected(
    dotsToDraw: Point[],
    index: number,
    dotsToDrawLength: number,
    ctx: CanvasRenderingContext2D
  ) {
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
  }

  function polygonize(path: any, numPoints: any) {
    //Thank you Noah!! http://bl.ocks.org/veltman/fc96dddae1711b3d756e0a13e7f09f24

    const length = path.getTotalLength();

    return range(numPoints).map(function (i: any) {
      const point = path.getPointAtLength((length * i) / numPoints);
      return [point.x, point.y];
    });
  }

  const getTotalLengthAllPaths = (paths: HTMLCollection) => {
    return Array.from(paths).reduce((prev: any, curr: any) => {
      return prev + curr.getTotalLength();
    }, 0);
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
