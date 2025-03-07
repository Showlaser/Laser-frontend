import { Point } from "models/components/shared/point";
import { createGuid, emptyGuid } from "services/shared/math";
import { showError, toastSubject } from "services/shared/toast-messages";
import { range } from "d3-array";
import { canvasPxSize } from "services/shared/config";
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

const mapCoordinatesToXAndYPoint = (
  coordinates: any,
  patternUuid: string
): Point[] => {
  const length = coordinates.length;
  const mappedCoordinates = new Array<Point>(length);
  for (let i = 0; i < length; i++) {
    const x: number = Math.round(coordinates[i][0]);
    const y: number = Math.round(coordinates[i][1]);
    mappedCoordinates[i] = createPoint(x, y, i, patternUuid);
  }

  return mappedCoordinates;
};

const createPoint = (
  x: number,
  y: number,
  orderNr: number,
  patternUuid: string
): Point => ({
  uuid: createGuid(),
  patternUuid,
  redLaserPowerPwm: 255,
  greenLaserPowerPwm: 255,
  blueLaserPowerPwm: 255,
  connectedToPointUuid: emptyGuid,
  orderNr: orderNr,
  x,
  y,
});

export const svgToPoints = (
  svg: any,
  numberOfPoints: number,
  patternUuid: string
): Point[] => {
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
  return mapCoordinatesToXAndYPoint(coordinates, patternUuid);
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
      pointsForPath = Math.round(
        (numberOfPoints * item.getTotalLength()) / totalLengthAllPaths
      );
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

export const prepareCanvas = (
  canvas: HTMLCanvasElement
): CanvasRenderingContext2D | null => {
  canvas.width = canvasPxSize;
  canvas.height = canvasPxSize;
  canvas.style.width = canvasPxSize.toString();
  canvas.style.height = canvasPxSize.toString();
  const ctx = canvas.getContext("2d");
  if (ctx === null) {
    return null;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.moveTo(0, canvasPxSize / 2);
  ctx.lineTo(canvasPxSize, canvasPxSize / 2);

  ctx.strokeStyle = "#706f6f";
  ctx.lineWidth = 0.1;
  ctx.stroke();

  ctx.moveTo(canvasPxSize / 2, 0);
  ctx.lineTo(canvasPxSize / 2, canvasPxSize);

  ctx.stroke();
  return ctx;
};
