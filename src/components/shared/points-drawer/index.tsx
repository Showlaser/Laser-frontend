import { Point } from "models/components/shared/point";
import React, { useEffect } from "react";
import { prepareCanvas } from "services/logic/svg-to-coordinates-converter";
import { convertPointsToCanvasSize, rgbColorStringFromPoint } from "services/shared/converters";

type Props = {
  selectedPointsUuid?: string[];
  showPointNumber?: boolean;
  pointsToDraw: Point[] | null;
};

export default function PointsDrawer({ selectedPointsUuid, showPointNumber, pointsToDraw }: Props) {
  useEffect(() => {
    drawOnCanvas(pointsToDraw);
  }, [pointsToDraw]);

  const drawOnCanvas = (dotsToDraw: Point[] | null) => {
    if (dotsToDraw === null) {
      return;
    }

    const points = convertPointsToCanvasSize(dotsToDraw);
    const dotsToDrawLength = points.length;
    const screenScale = window.devicePixelRatio || 1;
    const canvas = document.getElementById("svg-canvas") as HTMLCanvasElement;
    const ctx = prepareCanvas(canvas);
    if (ctx === null) {
      return;
    }

    for (let index = 0; index < dotsToDrawLength; index++) {
      const point = points[index];
      const pointIsHighlighted = selectedPointsUuid?.some((sp) => sp === point.uuid) ?? false;
      drawPoint(ctx, point, pointIsHighlighted, index, points, screenScale);
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
    let color: string = rgbColorStringFromPoint(point);
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

  return <canvas className="canvas" id="svg-canvas" />;
}
