import { Point } from "models/components/shared/point";
import { createGuid } from "services/shared/math";
import { showError, toastSubject } from "services/shared/toast-messages";
import { range } from "d3-array";
import { blue } from "@mui/material/colors";
import { WidthAndHeight } from "models/components/shared/pattern";
const flattenSVG = require("flatten-svg");

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

const createPoint = (x: number, y: number, orderNr: number): Point => ({
  uuid: createGuid(),
  colorRgb: "#ffffff",
  connectedToPointOrderNr: null,
  orderNr: orderNr,
  x,
  y,
});

export const svgToPoints = (svg: any, numberOfPoints: number): Point[] => {
  if (!svg) {
    return [];
  }

  const pathsOnly = pathologize(svg);
  let newDiv = document.createElement("div");
  newDiv.innerHTML = pathsOnly;

  const paths: any = newDiv?.getElementsByTagName("path");
  if (paths.length === 0) {
    showError(toastSubject.invalidFile);
    return [];
  }

  const coordinates = pathsToCoords(paths, numberOfPoints);
  return mapCoordinatesToXAndYPoint(coordinates);
};

const pathsToCoords = (paths: any, numberOfPoints: number) => {
  const totalLengthAllPaths: any = getTotalLengthAllPaths(paths);

  let runningPointsTotal = 0;
  return Array.from(paths).reduce((prev: any, item: any, index) => {
    let pointsForPath;
    if (index + 1 === paths.length) {
      //ensures that the total number of points = the actual requested number (because using rounding)
      pointsForPath = numberOfPoints - runningPointsTotal;
    } else {
      pointsForPath = Math.round((numberOfPoints * item.getTotalLength()) / totalLengthAllPaths);
      runningPointsTotal += pointsForPath;
    }
    return [...prev, ...polygonize(item, pointsForPath)];
  }, []);
};

const polygonize = (path: any, numPoints: any) => {
  //Thank you Noah!! http://bl.ocks.org/veltman/fc96dddae1711b3d756e0a13e7f09f24
  const length = path.getTotalLength();
  return range(numPoints).map(function (i: any) {
    const point = path.getPointAtLength((length * i) / numPoints);
    return [point.x, point.y];
  });
};

const getTotalLengthAllPaths = (paths: HTMLCollection) => {
  return Array.from(paths).reduce((prev: any, curr: any) => {
    return prev + curr.getTotalLength();
  }, 0);
};

export const prepareCanvas = (canvas: HTMLCanvasElement): CanvasRenderingContext2D | null => {
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

export const getHeightAnWidthOfPattern = (points: Point[]): WidthAndHeight => {
  const arrayLength = points.length;

  let lowestY = points[0].y;
  let highestY = points[arrayLength - 1].y;

  let lowestX = points[arrayLength - 1].x;
  let highestX = points[0].x;

  for (let i = 0; i < arrayLength; i++) {
    const point = points[i];
    if (point.y < lowestY) {
      lowestY = point.y;
    }
    if (point.y > highestY) {
      highestY = point.y;
    }
    if (point.x < lowestX) {
      lowestX = point.x;
    }
    if (point.x > highestX) {
      highestX = point.x;
    }
  }

  return {
    width: highestX - lowestX,
    height: highestY - lowestY,
  };
};
