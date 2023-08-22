import {
  drawLine,
  drawRoundedRectangleWithText,
  writeText,
} from "components/shared/canvas-helper";
import {
  SelectedAnimationContext,
  SelectedAnimationContextType,
  SelectedAnimationPatternContext,
  SelectedAnimationPatternContextType,
} from "pages/animation";
import React, { useEffect, useState } from "react";
import {
  mapNumber,
  normalize,
  numberIsBetweenOrEqual,
} from "services/shared/math";
import {
  PlayAnimationContext,
  PlayAnimationContextType,
  SelectableStepsContext,
  SelectableStepsIndexContext,
  SelectableStepsIndexContextType,
  StepsToDrawMaxRangeContext,
  TimeLineContextType,
  TimeLinePositionContext,
} from "..";
import {
  animationPatternTimeWidthWhenDurationIsZero,
  canvasPxSize,
} from "services/shared/config";
import {
  LinearProgress,
  Grid,
  InputLabel,
  Input,
  Select,
  MenuItem,
  Tooltip,
  IconButton,
  Paper,
  Divider,
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

export default function AnimationPatternTimeline() {
  const { timelinePositionMs, setTimelinePositionMs } = React.useContext(
    TimeLinePositionContext
  ) as TimeLineContextType;

  const selectableSteps = React.useContext(SelectableStepsContext);
  const { selectableStepsIndex, setSelectableStepsIndex } = React.useContext(
    SelectableStepsIndexContext
  ) as SelectableStepsIndexContextType;

  const { selectedAnimation, setSelectedAnimation } = React.useContext(
    SelectedAnimationContext
  ) as SelectedAnimationContextType;

  const { selectedAnimationPattern, setSelectedAnimationPattern } =
    React.useContext(
      SelectedAnimationPatternContext
    ) as SelectedAnimationPatternContextType;

  const { playAnimation, setPlayAnimation } = React.useContext(
    PlayAnimationContext
  ) as PlayAnimationContextType;

  const numberOfTimeLines = 3;
  const stepsToDrawMaxRange = React.useContext(StepsToDrawMaxRangeContext);

  const canvasHeight = window.innerHeight / 6;
  const canvasWidth = window.innerWidth - 60;
  const timelineNumbersHeight = 10;
  const animationPatternHeightOnCanvas =
    (canvasHeight - 40) / numberOfTimeLines;

  const getTimelineData = () => {
    let generatedTimeline = [];
    for (let i = 0; i < numberOfTimeLines; i++) {
      generatedTimeline[i] = {
        id: i,
        hidden: false,
        timelineCenterY:
          Math.floor(canvasHeight / numberOfTimeLines / 2) +
          (i * canvasHeight) / numberOfTimeLines +
          5,
      };
    }

    return generatedTimeline;
  };

  const [screenWidthPx, setScreenWidthPx] = useState<number>(window.innerWidth);
  const [screenHeightPx, setScreenHeightPx] = useState<number>(
    window.innerHeight
  );
  const timelines = getTimelineData();

  useEffect(() => {
    const canvas = document.getElementById(
      "animation-pattern-timeline-canvas"
    ) as HTMLCanvasElement;
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
    selectedAnimation,
    selectableStepsIndex,
  ]);

  const draw = (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, canvasWidth, ctx.canvas.height);
    drawTimeLines(ctx);
    drawAnimationPatternsOnTimelines();
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
      writeText(
        x,
        canvasHeight - 1,
        (timelinePositionMs + i * selectedStep).toString(),
        "whitesmoke",
        ctx,
        10
      );
    }
  };

  const onAnimationPatternClick = (x: number, y: number) => {
    const clickedAnimationPattern = getAnimationPatternFromMouseClick(x, y);
    if (clickedAnimationPattern !== undefined) {
      setSelectedAnimationPattern(clickedAnimationPattern);
    }
  };

  const getAnimationPatternFromMouseClick = (x: number, y: number) => {
    const numberOfTimeLines = timelines.length;
    const timelineIdPressed = getTimelineIdPressed(
      numberOfTimeLines,
      canvasHeight,
      y,
      animationPatternHeightOnCanvas
    );
    if (timelineIdPressed === undefined) {
      return undefined;
    }

    const xMappedToTimelinePosition = mapNumber(
      x,
      0,
      canvasWidth,
      timelinePositionMs,
      stepsToDrawMaxRange
    );
    return selectedAnimation?.animationPatterns.find(
      (ap) =>
        numberIsBetweenOrEqual(
          xMappedToTimelinePosition,
          ap.startTimeMs,
          ap.getDuration === 0
            ? animationPatternTimeWidthWhenDurationIsZero
            : ap.getDuration
        ) && ap.timelineId === timelineIdPressed
    );
  };

  const onCanvasClick = (e: any) => {
    const canvas = document.getElementById(
      "animation-pattern-timeline-canvas"
    ) as HTMLCanvasElement;
    const rect = canvas.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    onAnimationPatternClick(x, y);
  };

  const drawAnimationPatternsOnTimelines = () => {
    const canvas = document.getElementById(
      "animation-pattern-timeline-canvas"
    ) as HTMLCanvasElement;
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

    let keyframeTimes: number[] = [];
    selectedAnimation?.animationPatterns.forEach(
      (ap) =>
        (keyframeTimes = keyframeTimes.concat(
          ap.animationKeyFrames.map((ak) => ak.timeMs)
        ))
    );

    const animationPatternsInRange =
      selectedAnimation?.animationPatterns.filter((ap) =>
        numberIsBetweenOrEqual(
          timelinePositionMs,
          ap.startTimeMs,
          ap.getDuration + ap.startTimeMs
        )
      );
    if (animationPatternsInRange === undefined) {
      return;
    }

    const animationPatternsInRangeCount = animationPatternsInRange?.length ?? 0;
    const numberOfTimeLines = timelines.length;
    for (let i = 0; i < animationPatternsInRangeCount; i++) {
      const animationPattern = animationPatternsInRange[i];
      const y =
        ((canvasHeight - timelineNumbersHeight) / numberOfTimeLines) *
        (animationPattern?.timelineId ?? 0);
      let animationPatternDuration = animationPattern?.getDuration ?? 0;

      if (animationPatternDuration === 0) {
        animationPatternDuration =
          animationPatternTimeWidthWhenDurationIsZero /
          selectableSteps[selectableStepsIndex]; // to prevent the pattern from being to small to click on
      }

      const xPosition =
        (((animationPattern?.startTimeMs ?? 0) - timelinePositionMs) *
          (canvasWidth / selectableSteps[selectableStepsIndex])) /
        10;
      const widthToDisplay = animationPatternDuration * (canvasWidth / 10);

      drawRoundedRectangleWithText(
        xPosition,
        y + 5,
        widthToDisplay,
        animationPatternHeightOnCanvas,
        `${animationPattern?.name}`,
        "white",
        "#485cdb",
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

  const getAnimationDuration = () => {
    const times = selectedAnimation?.animationPatterns.map(
      (ap) => ap.startTimeMs + ap.getDuration
    );
    if (times === undefined) {
      return 0;
    }

    return Math.max(...times);
  };

  const animationDuration = getAnimationDuration();

  return (
    <Paper style={{ marginTop: "25px" }}>
      <Grid container direction="row" sx={{ padding: "10px" }}>
        <Grid item xs={1.2}>
          <InputLabel id="timeline-position-ms">
            Timeline position ms
          </InputLabel>
          <Input
            disabled={selectedAnimation === null}
            id="timeline-position-ms"
            value={timelinePositionMs}
            onKeyDown={(e) => e.preventDefault()}
            onChange={(e) => setTimelinePositionMs(Number(e.target.value))}
            type="number"
            inputProps={{
              min: 0,
              step: selectableSteps[selectableStepsIndex],
            }}
          />
        </Grid>
        <Grid item xs={1}>
          <InputLabel id="steps-select">Steps</InputLabel>
          <Select
            disabled={selectedAnimation === null}
            labelId="steps-select"
            value={selectableStepsIndex}
            onChange={(e) => setSelectableStepsIndex(Number(e.target.value))}
          >
            {selectableSteps.map((step, index) => (
              <MenuItem
                key={step}
                value={index}
                selected={index === selectableStepsIndex}
              >
                {step}
              </MenuItem>
            ))}
          </Select>
          <span style={{ marginLeft: "5px" }}>
            <Tooltip title="Reset timeline position to 0">
              <span>
                <IconButton
                  disabled={selectedAnimation === null}
                  onClick={() => setTimelinePositionMs(0)}
                >
                  <RestartAltIcon />
                </IconButton>
              </span>
            </Tooltip>
          </span>
          <span>
            {playAnimation ? (
              <Tooltip title="Pause animation">
                <span>
                  <IconButton
                    onClick={() => setPlayAnimation(false)}
                    disabled={selectedAnimation === null}
                  >
                    <PauseIcon />
                  </IconButton>
                </span>
              </Tooltip>
            ) : (
              <Tooltip title="Start animation">
                <span>
                  <IconButton
                    onClick={() => setPlayAnimation(true)}
                    disabled={selectedAnimation === null}
                  >
                    <PlayArrowIcon />
                  </IconButton>
                </span>
              </Tooltip>
            )}
          </span>
        </Grid>
      </Grid>
      <Divider style={{ marginBottom: "10px", marginTop: "-10px" }} />
      <canvas onClick={onCanvasClick} id="animation-pattern-timeline-canvas" />
      <LinearProgress
        sx={{
          transition: "none",
        }}
        variant="determinate"
        value={
          timelinePositionMs > animationDuration
            ? 100
            : normalize(timelinePositionMs, 0, animationDuration)
        }
      />
    </Paper>
  );
}
