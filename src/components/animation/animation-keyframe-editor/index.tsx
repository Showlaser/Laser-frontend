import { ButtonGroup, Grid, Input, InputLabel, MenuItem, Select } from "@mui/material";
import PointsDrawer from "components/shared/points-drawer";
import { Animation } from "models/components/shared/animation";
import React, { useEffect, useState } from "react";
import { mapNumber } from "services/shared/math";
import "./index.css";

type Props = {
  animation: Animation | null;
};

export default function AnimationKeyFrameEditor({ animation }: Props) {
  const [timelinePositionMs, setTimelinePositionMs] = useState<number>(0);
  const [timelinePositionSteps, setTimelinePositionSteps] = useState<number>(1);

  useEffect(() => {
    drawTimelineOnCanvas();
  });

  const prepareCanvas = (canvas: HTMLCanvasElement): HTMLCanvasElement => {
    canvas.width = 650;
    canvas.height = 650;
    canvas.style.width = "650";
    canvas.style.height = "650";
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    return canvas;
  };

  const drawLine = (fromX: number, fromY: number, toX: number, toY: number, ctx: CanvasRenderingContext2D) => {
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.strokeStyle = "grey";
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  const drawTimeSteps = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = "grey";
    ctx.beginPath();

    ctx.font = "12px sans-serif";
    ctx.fillStyle = "grey";

    const minRange = timelinePositionMs;
    const maxRange = timelinePositionMs + 650 * timelinePositionSteps;

    let xPos = 85;
    for (let i = minRange; i < maxRange; i += timelinePositionSteps) {
      ctx.fillText(i.toString(), xPos, 645);
      xPos += 50;
    }
  };

  const drawProperties = (ctx: CanvasRenderingContext2D) => {
    drawLine(80, 650, 80, 0, ctx);
    const properties = ["Scale", "xOffset", "yOffset", "Rotation"];
    let propertyIndex = 0;
    for (let i = 80; i < 600; i += 140) {
      drawLine(80, i, 650, i, ctx);
      ctx.font = "16px sans-serif";
      ctx.fillText(properties[propertyIndex], 5, i);
      propertyIndex++;
    }
  };

  const drawTimelineOnCanvas = () => {
    let canvas = document.getElementById("svg-keyframe-canvas") as HTMLCanvasElement;
    canvas = prepareCanvas(canvas);
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

    drawTimeSteps(ctx);
    drawProperties(ctx);
  };

  const getClickPosition = (event: any) => {
    const canvas = document.getElementById("svg-keyframe-canvas") as HTMLCanvasElement;
    const rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    if (x < 85) {
      x = 85;
    }

    const mappedX: number =
      mapNumber(x, 85, 650, timelinePositionMs, 12 * timelinePositionSteps + timelinePositionMs) | 0;
    console.log("x: " + mappedX);
  };

  const showMouseXAxis = (event: any) => {
    drawTimelineOnCanvas();
    const canvas = document.getElementById("svg-keyframe-canvas") as HTMLCanvasElement;
    const rect = canvas.getBoundingClientRect();
    const mouseXPosition = event.clientX - rect.left;
    if (mouseXPosition < 80) {
      return;
    }

    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    drawLine(mouseXPosition, 0, mouseXPosition, 650, ctx);
  };

  return (
    <Grid container direction="row" spacing={2}>
      <Grid item xs={2}></Grid>
      <Grid item xs>
        <canvas
          id="svg-keyframe-canvas"
          onClick={(e) => getClickPosition(e)}
          onMouseMove={showMouseXAxis}
          onMouseLeave={drawTimelineOnCanvas}
        />
        <Grid container direction="row" spacing={2}>
          <Grid item xs={2.6}>
            <InputLabel id="timeline-position-ms">Timeline position ms</InputLabel>
            <Input
              id="timeline-position-ms"
              value={timelinePositionMs}
              onChange={(e) => setTimelinePositionMs(Number(e.target.value))}
              type="number"
              inputProps={{ min: "0", step: timelinePositionSteps }}
            />
          </Grid>
          <Grid item xs={3}>
            <InputLabel id="steps-select">Steps</InputLabel>
            <Select
              labelId="steps-select"
              value={timelinePositionSteps}
              onChange={(e) => setTimelinePositionSteps(Number(e.target.value))}
            >
              <MenuItem selected value={1}>
                1
              </MenuItem>
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={100}>100</MenuItem>
              <MenuItem value={1000}>1000</MenuItem>
            </Select>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs>
        <PointsDrawer pointsToDraw={[]} />
      </Grid>
    </Grid>
  );
}
