import { Point } from "models/components/shared/point";
import React, { useEffect, useState } from "react";
import { prepareCanvas } from "services/logic/svg-to-coordinates-converter";
import { calculateCenterOfPoints, mapNumber } from "services/shared/math";
import { generatePointsTestSet } from "tests/helper";

export default function CanvasTest() {
  const [angle, setAngle] = useState<number>(-360);
  const xOffset = 0;
  const yOffset = 1500;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    interval = setInterval(() => drawPoints(angle), 10);
    return () => clearInterval(interval);
  }, [angle]);

  const points = generatePointsTestSet([
    {
      x: -200,
      y: 0,
    },
    {
      x: 0,
      y: 2000,
    },
    {
      x: 2000,
      y: 0,
    },
  ]);

  const convertPointsToCanvasSize = (points: Point[]) => {
    let mappedPoints: Point[] = [];
    const pointsLength = points.length;

    for (let i = 0; i < pointsLength; i++) {
      let point = { ...points[i] };
      point.x = mapNumber(point.x, -4000, 4000, 0, 650);
      point.y = mapNumber(point.y, -4000, 4000, 0, 650);
      mappedPoints.push(point);
    }

    return mappedPoints;
  };

  const drawPoints = (rotation: number) => {
    const canvas = document.getElementById("test-canvas") as HTMLCanvasElement;
    let pointsWithOffsetApplied = [];
    for (let i = 0; i < points.length; i++) {
      let point = { ...points[i] };
      point.x += xOffset;
      point.y -= yOffset;
      pointsWithOffsetApplied.push(point);
    }

    const centerOfPattern = calculateCenterOfPoints(pointsWithOffsetApplied);
    const centerX = centerOfPattern.x;
    const centerY = centerOfPattern.y;

    let rotatedPoints = rotatePoints(pointsWithOffsetApplied, rotation, centerX, centerY);
    rotatedPoints.push(
      generatePointsTestSet([
        {
          x: centerX,
          y: centerY,
        },
      ])[0]
    );

    const convertedPoints = convertPointsToCanvasSize(rotatedPoints);
    const ctx = prepareCanvas(canvas);
    const screenScale = window.devicePixelRatio || 1;

    if (ctx === null) {
      return;
    }

    for (let i = 0; i < convertedPoints.length; i++) {
      const point = convertedPoints[i];
      const color: string = i === convertedPoints.length - 1 ? "red" : "white";
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(point.x * screenScale, point.y * screenScale, 3, 0, 2 * Math.PI, true);
      ctx.fill();
      ctx.closePath();
    }
    setAngle(angle + 1);
  };

  const rotatePoints = (points: Point[], rotation: number, centerX: number, centerY: number) => {
    const radians = (Math.PI / 180) * rotation,
      cos = Math.cos(radians),
      sin = Math.sin(radians);

    let rotatedPoints: Point[] = [];
    for (const point of points) {
      const nx = cos * (point.x - centerX) + sin * (point.y - centerY) + centerX;
      const ny = cos * (point.y - centerY) - sin * (point.x - centerX) + centerY;
      rotatedPoints.push(generatePointsTestSet([{ x: nx, y: ny }])[0]);
    }

    return rotatedPoints;
  };

  return (
    <>
      <h5>{angle}</h5>
      <canvas id="test-canvas" />
    </>
  );
}
