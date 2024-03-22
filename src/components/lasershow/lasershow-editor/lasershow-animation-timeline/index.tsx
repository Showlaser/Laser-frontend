import React, { useEffect, useState } from "react";
import {
  LasershowDurationContext,
  LasershowDurationContextType,
  LasershowSelectableStepsIndexContext,
  LasershowSelectableStepsIndexContextType,
  LasershowStepsToDrawMaxRangeContext,
  LasershowTimeLineContextType,
  LasershowTimeLinePositionContext,
  PlayLasershowContext,
  PlayLasershowContextType,
  SelectedLasershowAnimationContext,
  SelectedLasershowAnimationContextType,
} from "..";
import { SelectedLasershowContext, SelectedLasershowContextType } from "pages/lasershow-editor";
import {
  timelineItemWidthWhenDurationIsZero,
  canvasHeight,
  canvasWidth,
  numberOfTimeLines,
  selectableSteps,
  timelineNumbersHeight,
  timelineItemHeightOnCanvas,
} from "services/shared/config";
import { drawLine, drawRoundedRectangleWithText, writeText } from "components/shared/canvas-helper";
import { mapNumber, normalize, numberIsBetweenOrEqual } from "services/shared/math";
import { getAnimationDuration, playAnimation } from "services/logic/animation-logic";
import { Grid, IconButton, Input, InputLabel, LinearProgress, MenuItem, Paper, Select, Tooltip } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { getLasershowAnimationsToDrawInTimeline } from "services/logic/lasershow-logic";

export default function LasershowAnimationTimeline() {
  const { timelinePositionMs, setTimelinePositionMs } = React.useContext(
    LasershowTimeLinePositionContext
  ) as LasershowTimeLineContextType;

  const { selectableStepsIndex, setSelectableStepsIndex } = React.useContext(
    LasershowSelectableStepsIndexContext
  ) as LasershowSelectableStepsIndexContextType;

  const { selectedLasershow, setSelectedLasershow } = React.useContext(
    SelectedLasershowContext
  ) as SelectedLasershowContextType;

  const { selectedLasershowAnimation, setSelectedLasershowAnimation } = React.useContext(
    SelectedLasershowAnimationContext
  ) as SelectedLasershowAnimationContextType;

  const { playLasershow, setPlayLasershow } = React.useContext(PlayLasershowContext) as PlayLasershowContextType;
  const stepsToDrawMaxRange = React.useContext(LasershowStepsToDrawMaxRangeContext);
  const { getLasershowDuration } = React.useContext(LasershowDurationContext) as LasershowDurationContextType;

  const [screenWidthPx, setScreenWidthPx] = useState<number>(window.innerWidth);
  const [screenHeightPx, setScreenHeightPx] = useState<number>(window.innerHeight);

  const lasershowDuration = getLasershowDuration();

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

  const timelines = getTimelineData();

  useEffect(() => {
    const canvas = document.getElementById("lasershow-timeline-canvas") as HTMLCanvasElement;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    canvas.style.width = `${canvasWidth}px`;
    canvas.style.height = `${canvasHeight}px`;
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    draw(ctx);
  }, [
    screenWidthPx,
    screenHeightPx,
    timelinePositionMs,
    selectedLasershow,
    selectableStepsIndex,
    selectedLasershowAnimation,
  ]);

  const draw = (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, canvasWidth, ctx.canvas.height);
    drawTimeLines(ctx);
    drawLasershowAnimationsOnTimelines();
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

  const onLasershowAnimationClick = (x: number, y: number) => {
    const clickedAnimationPattern = getLasershowAnimationFromMouseClick(x, y);
    if (clickedAnimationPattern !== undefined) {
      setSelectedLasershowAnimation(clickedAnimationPattern);
    }
  };

  const getLasershowAnimationFromMouseClick = (x: number, y: number) => {
    const numberOfTimeLines = timelines.length;
    const timelineIdPressed = getTimelineIdPressed(numberOfTimeLines, canvasHeight, y, timelineItemHeightOnCanvas);
    if (timelineIdPressed === undefined) {
      return undefined;
    }

    const xMappedToTimelinePosition = mapNumber(x, 0, canvasWidth, timelinePositionMs, stepsToDrawMaxRange);
    return selectedLasershow?.lasershowAnimations.find(
      (la) =>
        numberIsBetweenOrEqual(
          xMappedToTimelinePosition,
          la.startTimeMs,
          getAnimationDuration(la.animation) === 0
            ? la.startTimeMs + timelineItemWidthWhenDurationIsZero
            : getAnimationDuration(la.animation)
        ) && la.timeLineId === timelineIdPressed
    );
  };

  const onCanvasClick = (e: any) => {
    const canvas = document.getElementById("lasershow-animation-timeline-canvas") as HTMLCanvasElement;
    const rect = canvas.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    onLasershowAnimationClick(x, y);
  };

  const drawLasershowAnimationsOnTimelines = () => {
    const canvas = document.getElementById("lasershow-animation-timeline-canvas") as HTMLCanvasElement;
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

    const lasershowAnimationsInRange = getLasershowAnimationsToDrawInTimeline(
      selectedLasershow,
      timelinePositionMs,
      stepsToDrawMaxRange
    );
    if (lasershowAnimationsInRange === undefined) {
      return;
    }

    const lasershowAnimationsInRangeCount = lasershowAnimationsInRange?.length ?? 0;
    const numberOfTimeLines = timelines.length;
    for (let i = 0; i < lasershowAnimationsInRangeCount; i++) {
      const lasershowAnimation = lasershowAnimationsInRange[i];
      const y = ((canvasHeight - timelineNumbersHeight) / numberOfTimeLines) * (lasershowAnimation?.timeLineId ?? 0);
      let lasershowAnimationDuration = getAnimationDuration(lasershowAnimation.animation) ?? 0;

      if (lasershowAnimationDuration === 0) {
        //to prevent the animation from being to small to click on
        lasershowAnimationDuration = timelineItemWidthWhenDurationIsZero;
      }

      const widthToDisplay = (canvasWidth / 10) * (lasershowAnimationDuration / selectableSteps[selectableStepsIndex]);
      const xPosition =
        (canvasWidth / 10) *
        ((lasershowAnimation.startTimeMs - timelinePositionMs) / selectableSteps[selectableStepsIndex]);

      let rectangleColor = selectedLasershowAnimation?.uuid === lasershowAnimation.uuid ? "#6370c2" : "#485cdb";
      drawRoundedRectangleWithText(
        xPosition,
        y + 5,
        widthToDisplay,
        timelineItemHeightOnCanvas,
        `${lasershowAnimation?.name}`,
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
    lasershowAnimationHeightOnCanvas: number
  ) => {
    for (let i = 0; i < numberOfTimeLines; i++) {
      const timelineCanvasYPosition =
        (canvasHeight - timelineNumbersHeight) / numberOfTimeLines +
        (i * (canvasHeight - timelineNumbersHeight)) / numberOfTimeLines;

      const yPositionIsInTimeline = numberIsBetweenOrEqual(
        y,
        timelineCanvasYPosition - lasershowAnimationHeightOnCanvas - 5,
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
          <InputLabel id="lasershow-timeline-position-ms">Timeline position ms</InputLabel>
          <Input
            disabled={selectedLasershow === null}
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
            disabled={selectedLasershow === null}
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
                <IconButton disabled={selectedLasershow === null} onClick={() => setTimelinePositionMs(0)}>
                  <RestartAltIcon />
                </IconButton>
              </span>
            </Tooltip>
          </span>
          <span>
            {playLasershow ? (
              <Tooltip title="Pause animation">
                <span>
                  <IconButton onClick={() => setPlayLasershow(false)} disabled={selectedLasershow === null}>
                    <PauseIcon />
                  </IconButton>
                </span>
              </Tooltip>
            ) : (
              <Tooltip title="Start lasershow">
                <span>
                  <IconButton onClick={() => setPlayLasershow(true)} disabled={selectedLasershow === null}>
                    <PlayArrowIcon />
                  </IconButton>
                </span>
              </Tooltip>
            )}
          </span>
        </Grid>
      </Grid>
      <canvas onClick={onCanvasClick} id="lasershow-animation-timeline-canvas" />
      <LinearProgress
        sx={{
          transition: "none",
        }}
        variant="determinate"
        value={timelinePositionMs > lasershowDuration ? 100 : normalize(timelinePositionMs, 0, lasershowDuration)}
      />
    </Paper>
  );
}
