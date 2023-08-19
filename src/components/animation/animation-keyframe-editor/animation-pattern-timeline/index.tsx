import { drawLine, drawRoundedRectangleWithText, writeText } from "components/shared/canvas-helper";
import {
  SelectedAnimationContext,
  SelectedAnimationContextType,
  SelectedAnimationPatternContext,
  SelectedAnimationPatternContextType,
} from "pages/animation";
import React, { useEffect, useState } from "react";
import { mapNumber, numberIsBetweenOrEqual } from "services/shared/math";
import {
  SelectableStepsContext,
  SelectableStepsIndexContext,
  SelectableStepsIndexContextType,
  StepsToDrawMaxRangeContext,
  TimeLineContextType,
  TimeLinePositionContext,
} from "..";

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

  const { selectedAnimationPattern, setSelectedAnimationPattern } = React.useContext(
    SelectedAnimationPatternContext
  ) as SelectedAnimationPatternContextType;

  const stepsToDrawMaxRange = React.useContext(StepsToDrawMaxRangeContext);

  const canvasHeight = 160;
  const canvasWidth = window.innerWidth - 60;
  const animationPatternHeightOnCanvas = 40;

  const getTimelineData = () => {
    const numberOfTimeLines = 3;
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
  const timelines = getTimelineData();

  useEffect(() => {
    const canvas = document.getElementById("animation-pattern-timeline-canvas") as HTMLCanvasElement;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    canvas.style.width = `${canvasWidth}px`;
    canvas.style.height = `${canvasHeight}px`;
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    draw(ctx);
  }, [screenWidthPx, timelinePositionMs, selectedAnimation, selectableStepsIndex]);

  const draw = (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, canvasWidth, ctx.canvas.height);
    drawTimeLines(ctx);
    drawAnimationPatternsOnTimelines();
  };

  const handleResize = () => {
    const canvas = document.getElementById("animation-pattern-timeline-canvas") as HTMLCanvasElement;
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

    const windowWidth = window.innerWidth;
    setScreenWidthPx(windowWidth);
  };

  window.addEventListener("resize", handleResize);

  const drawTimeLines = (ctx: CanvasRenderingContext2D) => {
    const numberOfTimeLines = timelines.length;
    for (let i = 0; i < numberOfTimeLines; i++) {
      const y = (canvasHeight - 10) / numberOfTimeLines + (i * (canvasHeight - 10)) / numberOfTimeLines;
      drawLine(0, y, screenWidthPx, y, ctx);
    }

    const selectedStep = selectableSteps[selectableStepsIndex];
    const distanceBetweenSteps = canvasWidth / 10 - 2;

    for (let i = 0; i < selectedStep + 1; i++) {
      const x = i * distanceBetweenSteps;
      writeText(x, canvasHeight - 1, (timelinePositionMs + i * selectedStep).toString(), "whitesmoke", ctx, 10);
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
    const timelineIdPressed = getTimelineIdPressed(numberOfTimeLines, canvasHeight, y, animationPatternHeightOnCanvas);
    if (timelineIdPressed === undefined) {
      return undefined;
    }

    const xMappedToTimelinePosition = mapNumber(x, 0, canvasWidth, timelinePositionMs, stepsToDrawMaxRange);
    return selectedAnimation?.animationPatterns.find(
      (ap) =>
        numberIsBetweenOrEqual(xMappedToTimelinePosition, ap.startTimeMs, ap.getDuration === 0 ? 4 : ap.getDuration) &&
        ap.timelineId === timelineIdPressed
    );
  };

  const onCanvasClick = (e: any) => {
    const canvas = document.getElementById("animation-pattern-timeline-canvas") as HTMLCanvasElement;
    const rect = canvas.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    onAnimationPatternClick(x, y);
  };

  const drawAnimationPatternsOnTimelines = () => {
    const canvas = document.getElementById("animation-pattern-timeline-canvas") as HTMLCanvasElement;
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

    let keyframeTimes: number[] = [];
    selectedAnimation?.animationPatterns.forEach(
      (ap) => (keyframeTimes = keyframeTimes.concat(ap.animationKeyFrames.map((ak) => ak.timeMs)))
    );
    const animationDuration = Math.max(...keyframeTimes);
    const animationPatternsInRange = selectedAnimation?.animationPatterns.filter((ap) =>
      numberIsBetweenOrEqual(ap.getDuration, timelinePositionMs, animationDuration)
    );

    const animationPatternsInRangeCount = animationPatternsInRange?.length ?? 0;
    const numberOfTimeLines = timelines.length;

    for (let i = 0; i < animationPatternsInRangeCount; i++) {
      const animationPattern = selectedAnimation?.animationPatterns[i];
      const y = ((canvasHeight - 10) / numberOfTimeLines) * (animationPattern?.timelineId ?? 0);
      let animationPatternDuration = animationPattern?.getDuration ?? 0;

      if (animationPatternDuration === 0) {
        animationPatternDuration = 4; // to prevent the pattern from being to small to click on
      }

      const xPosition = (animationPattern?.startTimeMs ?? 0) - timelinePositionMs * (canvasWidth / 100);
      const widthToDisplay = animationPatternDuration * (canvasWidth / 100);

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
        (canvasHeight - 10) / numberOfTimeLines + (i * (canvasHeight - 10)) / numberOfTimeLines;
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
    <div style={{ marginTop: "5px" }}>
      <canvas className="canvas" onClick={onCanvasClick} id="animation-pattern-timeline-canvas" />
    </div>
  );
}
