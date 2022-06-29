import * as React from "react";
import { showError, toastSubject } from "services/shared/toast-messages";
import { range } from "d3-array";
import "./index.css";
import {
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  Input,
  Slider,
} from "@mui/material";
import { Point } from "models/components/shared/svg-to-coordinates-converter";
import { rotatePoint } from "services/shared/math";
const flattenSVG = require("flatten-svg");

type Props = {
  uploadedFile: File;
};

export default function SvgToCoordinatesConverter({ uploadedFile }: Props) {
  const [rawSvg, setRawSvg] = React.useState<string | ArrayBuffer | null>();
  const [scale, setScale] = React.useState<number>(3);
  const [numberOfPoints, setNumberOfPoints] = React.useState<number>(30);
  const [xOffset, setXOffset] = React.useState<number>(0);
  const [yOffset, setYOffset] = React.useState<number>(0);
  const [connectDots, setConnectDots] = React.useState<boolean>(true);
  const [rotation, setRotation] = React.useState<number>(0);

  React.useEffect(() => {
    if (uploadedFile !== undefined) {
      onFileUpload(uploadedFile);
    }
    setNewSvg(rawSvg);
  }, [
    scale,
    numberOfPoints,
    xOffset,
    yOffset,
    uploadedFile,
    connectDots,
    rotation,
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
      setNewSvg(result);
    };

    reader.readAsText(file);
  };

  const setNewSvg = (svg: any) => {
    if (!svg) {
      if (!rawSvg) {
        return;
      }

      svg = rawSvg;
    }

    const pathsOnly = pathologize(svg);

    let newDiv = document.createElement("div");
    newDiv.innerHTML = pathsOnly;

    let paths: any = newDiv?.getElementsByTagName("path");
    if (paths.length === 0) {
      showError(toastSubject.invalidFile);
      return;
    }

    const coordinates = pathsToCoords(paths);
    const points = mapCoordinatesToXAndYPoint(coordinates);

    drawDotsOnCanvas(points);
  };

  const mapCoordinatesToXAndYPoint = (coordinates: any): Point[] => {
    const length = coordinates.length;
    const mappedCoordinates = new Array<Point>(length);
    for (let i = 0; i < length; i++) {
      const x: number = coordinates[i][0] - 140;
      const y: number = coordinates[i][1] - 150;
      let rotatedPoint: Point = rotatePoint({ x, y }, rotation);
      rotatedPoint.x += xOffset;
      rotatedPoint.y += yOffset;
      mappedCoordinates[i] = rotatedPoint;
    }

    return mappedCoordinates;
  };

  const drawDotsOnCanvas = (dotsToDraw: Point[]) => {
    const screenScale = window.devicePixelRatio || 1;
    const canvas = document.getElementById("svg-canvas") as HTMLCanvasElement;
    canvas.width = 650;
    canvas.height = 650;
    canvas.style.width = "650";
    canvas.style.height = "650";
    const ctx = canvas.getContext("2d");
    if (ctx === null) {
      return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const color: string = "#ffffff";
    const dotThickness: number = 2;

    ctx.moveTo(0, 300);
    ctx.lineTo(600, 300);

    ctx.strokeStyle = "#706f6f";
    ctx.lineWidth = 0.1;
    ctx.stroke();

    ctx.moveTo(300, 0);
    ctx.lineTo(300, 600);

    ctx.stroke();

    const dotsToDrawLength = dotsToDraw.length;
    for (let index = 0; index < dotsToDrawLength; index++) {
      const d: Point = dotsToDraw[index];
      ctx.fillStyle =
        color === "random"
          ? `rgb(${Math.round(Math.random() * 255)}, ${Math.round(
              Math.random() * 255
            )}, ${Math.round(Math.random() * 255)})`
          : color;
      ctx.beginPath();
      if (connectDots) {
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
      } else if (!connectDots) {
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

  function polygonize(path: any, numPoints: any) {
    //Thank you Noah!! http://bl.ocks.org/veltman/fc96dddae1711b3d756e0a13e7f09f24

    const length = path.getTotalLength();

    return range(numPoints).map(function (i: any) {
      const point = path.getPointAtLength((length * i) / numPoints);
      return [point.x * scale, point.y * scale];
    });
  }

  const getTotalLengthAllPaths = (paths: HTMLCollection) => {
    return Array.from(paths).reduce((prev: any, curr: any) => {
      return prev + curr.getTotalLength();
    }, 0);
  };

  return (
    <Grid container spacing={3} style={{ width: "50%" }}>
      <Grid item style={{ width: "100%" }}>
        <FormControl style={{ width: "100%" }}>
          <FormLabel htmlFor="svg-scale">Scale</FormLabel>
          <Slider
            id="svg-scale"
            size="small"
            value={scale}
            onChange={(e, value) => setScale(Number(value))}
            min={1}
            max={10}
            aria-label="Small"
            valueLabelDisplay="auto"
          />
        </FormControl>
        <br />
        <FormLabel htmlFor="svg-points">Number of points</FormLabel>
        <br />
        <Input
          type="number"
          value={numberOfPoints}
          onChange={(e) => setNumberOfPoints(Number(e.target.value))}
        />
        <br />
        <FormControl style={{ width: "100%" }}>
          <Slider
            id="svg-points"
            size="small"
            value={numberOfPoints}
            onChange={(e, value) => setNumberOfPoints(Number(value))}
            min={1}
            max={300}
            aria-label="Small"
            valueLabelDisplay="auto"
          />
        </FormControl>
        <FormLabel htmlFor="svg-points">X offset</FormLabel>
        <br />
        <Input
          type="number"
          value={xOffset}
          onChange={(e) => setXOffset(Number(e.target.value))}
        />
        <br />
        <FormControl style={{ width: "100%" }}>
          <Slider
            id="svg-points"
            size="small"
            value={xOffset}
            onChange={(e, value) => setXOffset(Number(value))}
            min={-500}
            max={500}
            aria-label="Small"
            valueLabelDisplay="auto"
          />
        </FormControl>
        <FormLabel htmlFor="svg-points">Y offset</FormLabel>
        <br />
        <Input
          type="number"
          value={yOffset}
          onChange={(e) => setYOffset(Number(e.target.value))}
        />
        <br />
        <FormControl style={{ width: "100%" }}>
          <Slider
            id="svg-points"
            size="small"
            value={yOffset}
            onChange={(e, value) => setYOffset(Number(value))}
            min={-500}
            max={500}
            aria-label="Small"
            valueLabelDisplay="auto"
            marks={[{ value: 0, label: "0" }]}
          />
        </FormControl>
        <FormLabel htmlFor="svg-points">Rotation</FormLabel>
        <br />
        <Input
          type="number"
          value={rotation}
          onChange={(e) => setRotation(Number(e.target.value))}
        />
        <br />
        <FormControl style={{ width: "100%" }}>
          <Slider
            id="svg-points"
            size="small"
            value={rotation}
            onChange={(e, value) => setRotation(Number(value))}
            min={-360}
            max={360}
            aria-label="Small"
            valueLabelDisplay="auto"
          />
        </FormControl>
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={connectDots}
                onChange={(e) => setConnectDots(e.target.checked)}
              />
            }
            label="Connect dots"
          />
        </FormGroup>
      </Grid>
      <br />
      <div id="svg-canvas-container">
        <canvas id="svg-canvas" />
      </div>
    </Grid>
  );
}
