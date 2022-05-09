import * as React from "react";
import { showError, toastSubject } from "services/shared/toast-messages";
import { range } from "d3-array";
import "./index.css";
import { FormControl, FormLabel, Grid, Slider } from "@mui/material";
const flattenSVG = require("flatten-svg");

type Props = {
  uploadedFile: File;
};

export default function SvgToCoordinatesConverter({ uploadedFile }: Props) {
  const [rawSvg, setRawSvg] = React.useState<string | ArrayBuffer | null>();
  const [scale, setScale] = React.useState<number>(5);
  const [numberOfPoints, setNumberOfPoints] = React.useState<number>(100);
  const [xOffset, setXOffset] = React.useState<number>(0);
  const [yOffset, setYOffset] = React.useState<number>(0);

  React.useEffect(() => {
    if (uploadedFile !== undefined) {
      onFileUpload(uploadedFile);
    }
    setNewSvg(rawSvg);
  }, [scale, numberOfPoints, xOffset, yOffset, uploadedFile]);

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
    drawDotsOnCanvas(coordinates);
  };

  const drawDotsOnCanvas = (dotsToDraw: any) => {
    const screenScale = window.devicePixelRatio || 1;
    const canvas = document.getElementById("svg-canvas") as HTMLCanvasElement;
    canvas.width = 500;
    canvas.height = 500;
    canvas.style.width = "500";
    canvas.style.height = "500";
    const ctx = canvas.getContext("2d");
    if (ctx === null) {
      return;
    }

    const color: string = "#ffffff";
    const dotThickness: number = 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    dotsToDraw.forEach((d: number[]) => {
      ctx.fillStyle =
        color === "random"
          ? `rgb(${Math.round(Math.random() * 255)}, ${Math.round(
              Math.random() * 255
            )}, ${Math.round(Math.random() * 255)})`
          : color;
      ctx.strokeStyle = "transparent";
      ctx.beginPath();
      ctx.arc(
        d[0] * screenScale,
        d[1] * screenScale,
        dotThickness,
        0,
        2 * Math.PI,
        true
      );
      ctx.fill();
      ctx.closePath();
    });
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
      return [...prev, ...polygonize(item, pointsForPath, xOffset, yOffset)];
    }, []);
  };

  function polygonize(
    path: any,
    numPoints: any,
    translateX: number,
    translateY: number
  ) {
    //Thank you Noah!! http://bl.ocks.org/veltman/fc96dddae1711b3d756e0a13e7f09f24

    const length = path.getTotalLength();

    return range(numPoints).map(function (i: any) {
      const point = path.getPointAtLength((length * i) / numPoints);
      return [point.x * scale + translateX, point.y * scale + translateY];
    });
  }

  const getTotalLengthAllPaths = (paths: HTMLCollection) => {
    return Array.from(paths).reduce((prev: any, curr: any) => {
      return prev + curr.getTotalLength();
    }, 0);
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <FormControl fullWidth>
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
        <FormControl fullWidth>
          <FormLabel htmlFor="svg-points">Number of points</FormLabel>
          <Slider
            id="svg-points"
            size="small"
            value={numberOfPoints}
            onChange={(e, value) => setNumberOfPoints(Number(value))}
            min={1}
            max={600}
            aria-label="Small"
            valueLabelDisplay="auto"
          />
        </FormControl>
        <FormControl fullWidth>
          <FormLabel htmlFor="svg-points">X offset</FormLabel>
          <Slider
            id="svg-points"
            size="small"
            value={xOffset}
            onChange={(e, value) => setXOffset(Number(value))}
            min={-60}
            max={500}
            aria-label="Small"
            valueLabelDisplay="auto"
          />
        </FormControl>
        <FormControl fullWidth>
          <FormLabel htmlFor="svg-points">Y offset</FormLabel>
          <Slider
            id="svg-points"
            size="small"
            value={yOffset}
            onChange={(e, value) => setYOffset(Number(value))}
            min={-60}
            max={500}
            aria-label="Small"
            valueLabelDisplay="auto"
          />
        </FormControl>
      </Grid>
      <br />
      <div id="svg-canvas-container">
        <canvas id="svg-canvas" />
      </div>
    </Grid>
  );
}
