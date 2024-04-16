import React, { useEffect, useState } from "react";
import {
  numberOfTimeLines,
  selectableSteps,
  timelineItemWidthWhenDurationIsZero,
  timelineNumbersHeight,
} from "services/shared/config";
import { drawLine, drawRoundedRectangleWithText, writeText } from "../canvas-helper";
import { Paper, Grid, InputLabel, Input, Select, MenuItem, Tooltip, IconButton, LinearProgress } from "@mui/material";
import { mapNumber, normalize, numberIsBetweenOrEqual } from "services/shared/math";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

export type SharedTimelineItem = {
  uuid: string;
  name: string;
  startTime: number;
  duration: number;
  timelineId: number;
};

export type SharedTimelineProps = {
  selectedItemUuid: string;
  onTimelineItemClick: (clickedUuid: string) => void;
  play: boolean;
  setPlay: (play: boolean) => void;
  timelinePositionMs: number;
  setTimelinePositionMs: (ms: number) => void;
  totalDuration: number;
  selectableStepsIndex: number;
  setSelectableStepsIndex: (steps: number) => void;
  timelineItems: SharedTimelineItem[];
};

export function SharedTimeline({
  selectedItemUuid,
  onTimelineItemClick,
  play,
  setPlay,
  timelinePositionMs,
  setTimelinePositionMs,
  totalDuration,
  selectableStepsIndex,
  setSelectableStepsIndex,
  timelineItems,
}: SharedTimelineProps) {
  const canvasHeight = window.innerHeight / 6;
  const canvasWidth = window.innerWidth - 60;
  const timelineItemHeightOnCanvas = (canvasHeight - 40) / numberOfTimeLines;
  const stepsToDrawMaxRange = (timelinePositionMs + selectableSteps[selectableStepsIndex] * 10) | 0;

  const getTimelineData = () => {
    let generatedTimeline = [];
    for (let i = 0; i < numberOfTimeLines; i++) {
      generatedTimeline[i] = {
        id: i,
        hidden: false,
        timelineCenterY: Math.floor(canvasHeight / numberOfTimeLines / 2) + (i * canvasHeight) / numberOfTimeLines + 5,
      };
    }

    return generatedTimeline;
  };

  const [screenWidthPx, setScreenWidthPx] = useState<number>(window.innerWidth);
  const [screenHeightPx, setScreenHeightPx] = useState<number>(window.innerHeight);
  const timelines = getTimelineData();

  useEffect(() => {
    const canvas = document.getElementById("timeline-canvas") as HTMLCanvasElement;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    canvas.style.width = `${canvasWidth}px`;
    canvas.style.height = `${canvasHeight}px`;
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    draw(ctx);
  }, [screenWidthPx, screenHeightPx, timelinePositionMs, selectedItemUuid, selectableStepsIndex, timelineItems]);

  const draw = (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, canvasWidth, ctx.canvas.height);
    drawTimeLines(ctx);
    drawTimelineItems();
  };

  const handleResize = () => {
    setScreenWidthPx(window.innerWidth);
    setScreenHeightPx(window.innerHeight);
  };

  window.addEventListener("resize", handleResize);

  const drawTimeLines = (ctx: CanvasRenderingContext2D) => {
    const numberOfTimeLines = timelines.length;
    for (let i = 0; i < numberOfTimeLines; i++) {
      const y =
        (canvasHeight - timelineNumbersHeight) / numberOfTimeLines +
        (i * (canvasHeight - timelineNumbersHeight)) / numberOfTimeLines;
      drawLine(0, y, screenWidthPx, y, ctx);
    }

    const selectedStep = selectableSteps[selectableStepsIndex];
    const distanceBetweenSteps = canvasWidth / timelineNumbersHeight - 2;

    for (let i = 0; i < selectedStep + 1; i++) {
      const x = i * distanceBetweenSteps;
      writeText(x, canvasHeight - 1, (timelinePositionMs + i * selectedStep).toString(), "whitesmoke", ctx, 10);
    }
  };

  const onItemClick = (x: number, y: number) => {
    const clickedTimelineItem = getTimelineItemFromMouseClick(x, y);
    if (clickedTimelineItem !== undefined) {
      onTimelineItemClick(clickedTimelineItem.uuid);
    }
  };

  const getTimelineItemFromMouseClick = (x: number, y: number): SharedTimelineItem | undefined => {
    const numberOfTimeLines = timelines.length;
    const timelineIdPressed = getTimelineIdPressed(numberOfTimeLines, canvasHeight, y, timelineItemHeightOnCanvas);
    if (timelineIdPressed === undefined) {
      return undefined;
    }

    const xMappedToTimelinePosition = mapNumber(x, 0, canvasWidth, timelinePositionMs, stepsToDrawMaxRange);
    return timelineItems.find((ti) => {
      return (
        numberIsBetweenOrEqual(
          xMappedToTimelinePosition,
          ti.startTime,
          ti.duration === 0 ? ti.startTime + timelineItemWidthWhenDurationIsZero : ti.duration
        ) && ti.timelineId === timelineIdPressed
      );
    });
  };

  const onCanvasClick = (e: any) => {
    const canvas = document.getElementById("timeline-canvas") as HTMLCanvasElement;
    const rect = canvas.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    onItemClick(x, y);
  };

  const getItemsToDrawInTimeline = (): SharedTimelineItem[] => {
    return timelineItems.filter((ti) => {
      const itemStartsBeforeTimeline = ti.startTime < timelinePositionMs;
      const itemEndsAfterStepsToDraw = ti.startTime + ti.duration > stepsToDrawMaxRange;
      const itemStartsInTimelineRange = numberIsBetweenOrEqual(ti.startTime, timelinePositionMs, stepsToDrawMaxRange);

      const patternEndsInTimelineRange = numberIsBetweenOrEqual(
        ti.startTime + ti.duration,
        timelinePositionMs,
        stepsToDrawMaxRange
      );

      return (
        (itemStartsBeforeTimeline && itemEndsAfterStepsToDraw) ||
        (itemStartsInTimelineRange && itemEndsAfterStepsToDraw) ||
        (itemStartsInTimelineRange && patternEndsInTimelineRange) ||
        (itemStartsBeforeTimeline && patternEndsInTimelineRange)
      );
    });
  };

  const drawTimelineItems = () => {
    const canvas = document.getElementById("timeline-canvas") as HTMLCanvasElement;
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

    const timelineItemsInRange = getItemsToDrawInTimeline();
    if (timelineItemsInRange === undefined || timelineItemsInRange.length === 0) {
      return;
    }

    const timelineItemsInRangeCount = timelineItemsInRange?.length ?? 0;
    const numberOfTimeLines = timelines.length;
    for (let i = 0; i < timelineItemsInRangeCount; i++) {
      const timelineItem = timelineItemsInRange[i];
      const y = ((canvasHeight - timelineNumbersHeight) / numberOfTimeLines) * (timelineItem?.timelineId ?? 0);

      if (timelineItem.duration === 0) {
        //to prevent the pattern from being to small to click on
        timelineItem.duration = timelineItemWidthWhenDurationIsZero;
      }

      const widthToDisplay = (canvasWidth / 10) * (timelineItem.duration / selectableSteps[selectableStepsIndex]);
      const xPosition =
        (canvasWidth / 10) * ((timelineItem.startTime - timelinePositionMs) / selectableSteps[selectableStepsIndex]);

      let rectangleColor = selectedItemUuid === timelineItem.uuid ? "#6370c2" : "#485cdb";
      drawRoundedRectangleWithText(
        xPosition,
        y + 5,
        widthToDisplay,
        timelineItemHeightOnCanvas,
        `${timelineItem?.name}`,
        "white",
        rectangleColor,
        ctx
      );
    }
  };

  const getTimelineIdPressed = (
    numberOfTimeLines: number,
    canvasHeight: number,
    y: number,
    animationPatternHeightOnCanvas: number
  ) => {
    for (let i = 0; i < numberOfTimeLines; i++) {
      const timelineCanvasYPosition =
        (canvasHeight - timelineNumbersHeight) / numberOfTimeLines +
        (i * (canvasHeight - timelineNumbersHeight)) / numberOfTimeLines;

      const yPositionIsInTimeline = numberIsBetweenOrEqual(
        y,
        timelineCanvasYPosition - animationPatternHeightOnCanvas - 5,
        timelineCanvasYPosition
      );
      if (yPositionIsInTimeline) {
        return i;
      }
    }
  };

  return (
    <Paper style={{ marginTop: "25px" }}>
      <Grid container direction="row" sx={{ padding: "10px" }}>
        <Grid item>
          <InputLabel id="timeline-position-ms">Timeline position ms</InputLabel>
          <Input
            id="timeline-position-ms"
            value={timelinePositionMs}
            onKeyDown={(e) => e.preventDefault()}
            onChange={(e) => setTimelinePositionMs(Number(e.target.value))}
            type="number"
            inputProps={{
              min: 0,
              step: selectableSteps[selectableStepsIndex],
              max: 1000000,
            }}
          />
        </Grid>
        <Grid item ml={1.5}>
          <InputLabel id="steps-select">Steps</InputLabel>
          <Select
            labelId="steps-select"
            value={selectableStepsIndex}
            onChange={(e) => setSelectableStepsIndex(Number(e.target.value))}
          >
            {selectableSteps.map((step, index) => (
              <MenuItem key={step} value={index} selected={index === selectableStepsIndex}>
                {step}
              </MenuItem>
            ))}
          </Select>
          <span style={{ marginLeft: "5px" }}>
            <Tooltip title="Reset timeline position to 0">
              <span>
                <IconButton onClick={() => setTimelinePositionMs(0)}>
                  <RestartAltIcon />
                </IconButton>
              </span>
            </Tooltip>
          </span>
          <span>
            {play ? (
              <Tooltip title="Pause animation">
                <span>
                  <IconButton onClick={() => setPlay(false)}>
                    <PauseIcon />
                  </IconButton>
                </span>
              </Tooltip>
            ) : (
              <Tooltip title="Start animation">
                <span>
                  <IconButton onClick={() => setPlay(true)}>
                    <PlayArrowIcon />
                  </IconButton>
                </span>
              </Tooltip>
            )}
          </span>
        </Grid>
      </Grid>
      <canvas onClick={onCanvasClick} id="timeline-canvas" />
      <LinearProgress
        sx={{
          transition: "none",
        }}
        variant="determinate"
        value={timelinePositionMs > totalDuration ? 100 : normalize(timelinePositionMs, 0, totalDuration)}
      />
    </Paper>
  );
}
