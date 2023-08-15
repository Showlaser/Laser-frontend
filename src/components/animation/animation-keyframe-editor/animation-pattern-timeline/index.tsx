import {
  drawLine,
  drawRectangleWithText,
  writeText,
} from "components/shared/canvas-helper";
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

  const { selectedAnimationPattern, setSelectedAnimationPattern } =
    React.useContext(
      SelectedAnimationPatternContext
    ) as SelectedAnimationPatternContextType;

  const stepsToDrawMaxRange = React.useContext(StepsToDrawMaxRangeContext);

  const canvasHeight = 150;
  const canvasWidth = window.innerWidth - 60;

  const getTimelineData = () => {
    const numberOfTimeLines = 3;
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
  const [timelines, setTimelines] = useState<any>(getTimelineData);

  useEffect(() => {
    const canvas = document.getElementById(
      "animation-pattern-timeline-canvas"
    ) as HTMLCanvasElement;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    canvas.style.width = `${canvasWidth}px`;
    canvas.style.height = `${canvasHeight}px`;
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawTimeLines(ctx);
    drawAnimationPatternsOnTimelines();
    drawTimelinePosition(ctx);
  }, [screenWidthPx, timelines, timelinePositionMs, selectedAnimation]);

  const handleResize = () => {
    const windowWidth = window.innerWidth - 60;
    setScreenWidthPx(windowWidth);
  };

  window.addEventListener("resize", handleResize);

  const drawTimelinePosition = (ctx: CanvasRenderingContext2D) => {
    drawLine(80, 0, 80, ctx.canvas.height, ctx);
  };

  const drawTimeLines = (ctx: CanvasRenderingContext2D) => {
    const numberOfTimeLines = timelines.length;
    for (let i = 0; i < numberOfTimeLines; i++) {
      const timeline = timelines[i];
      const y =
        canvasHeight / numberOfTimeLines +
        (i * canvasHeight) / numberOfTimeLines;
      drawLine(0, y, screenWidthPx, y, ctx);
      writeText(
        5,
        timeline.timelineCenterY,
        `${timeline.hidden ? "☐" : "☑"} ${i + 1}`,
        "whitesmoke",
        ctx,
        20
      );
    }
  };

  const onVisibilityCheckmarkClick = (x: number, y: number) => {
    const mouseClickIsNotInsideCheckboxMargin = !numberIsBetweenOrEqual(
      x,
      5,
      20
    );
    if (mouseClickIsNotInsideCheckboxMargin) {
      return;
    }

    const numberOfTimeLines = timelines.length;
    let updatedTimelines = [...timelines];

    for (let i = 0; i < numberOfTimeLines; i++) {
      const timeline = timelines[i];
      if (
        numberIsBetweenOrEqual(
          y,
          timeline.timelineCenterY - 15,
          timeline.timelineCenterY + 5
        )
      ) {
        updatedTimelines[i].hidden = !timeline.hidden;
        setTimelines(updatedTimelines);
        return;
      }
    }
  };

  const onAnimationPatternClick = (x: number, y: number) => {
    const minRange = timelinePositionMs;

    const animationPatternsInRange =
      selectedAnimation?.animationPatterns.filter((ap) =>
        numberIsBetweenOrEqual(ap.startTimeMs, minRange, stepsToDrawMaxRange)
      );
    const animationPatternsInRangeCount = animationPatternsInRange?.length ?? 0;
    const numberOfTimeLines = timelines.length;
  };

  const onCanvasClick = (e: any) => {
    const canvas = document.getElementById(
      "animation-pattern-timeline-canvas"
    ) as HTMLCanvasElement;
    const rect = canvas.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    onVisibilityCheckmarkClick(x, y);
  };

  const drawAnimationPatternsOnTimelines = () => {
    const canvas = document.getElementById(
      "animation-pattern-timeline-canvas"
    ) as HTMLCanvasElement;

    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    const animationPatternsInRange =
      selectedAnimation?.animationPatterns.filter((ap) =>
        numberIsBetweenOrEqual(
          ap.startTimeMs,
          timelinePositionMs,
          stepsToDrawMaxRange
        )
      );
    const animationPatternsInRangeCount = animationPatternsInRange?.length ?? 0;
    const numberOfTimeLines = timelines.length;

    for (let i = 0; i < animationPatternsInRangeCount; i++) {
      const animationPattern = selectedAnimation?.animationPatterns[i];
      const timelineYAxis =
        canvasHeight / numberOfTimeLines +
        (animationPattern?.timelineId ?? 0 * canvasHeight) / numberOfTimeLines -
        25;

      const duration = Math.max(
        ...(animationPattern?.animationKeyFrames?.map((ak) => ak?.timeMs) ?? [])
      );

      const textLength = animationPattern?.name?.length ?? 1;
      drawRectangleWithText(
        mapNumber(
          5 + (animationPattern?.startTimeMs ?? 0),
          timelinePositionMs,
          stepsToDrawMaxRange + 5,
          0,
          canvas.width
        ),
        timelineYAxis - 20,
        40 +
          textLength * 6 +
          mapNumber(
            duration + (animationPattern?.startTimeMs ?? 0),
            timelinePositionMs,
            mapNumber(
              duration + (animationPattern?.startTimeMs ?? 0),
              0,
              canvas.width,
              80,
              canvas.width
            ),
            0,
            canvas.width
          ),
        40,
        `${animationPattern?.name}`,
        "white",
        "#485cdb",
        ctx
      );
    }
  };

  return (
    <div style={{ marginTop: "5px" }}>
      <canvas
        className="canvas"
        onClick={onCanvasClick}
        id="animation-pattern-timeline-canvas"
      />
    </div>
  );
}
