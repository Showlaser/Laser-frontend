import { useTheme } from "@mui/material";
import { AnimationPatternKeyFrame } from "models/components/shared/animation";
import React, { useEffect } from "react";
import { createGuid, mapNumber, numberIsBetweenOrEqual } from "services/shared/math";
import { propertiesSettings } from "services/logic/animation-logic";
import { canvasPxSize } from "services/shared/config";
import { drawLine, writeText } from "components/shared/canvas-helper";
import animation, {
  SelectedAnimationContext,
  SelectedAnimationContextType,
  SelectedAnimationPatternContext,
  SelectedAnimationPatternContextType,
} from "pages/animation";
import {
  XCorrectionContext,
  TimeLinePositionContext,
  SelectableStepsIndexContext,
  PlayAnimationContext,
  SelectableStepsContext,
  TimeLineContextType,
  SelectableStepsIndexContextType,
  SelectedKeyFrameContextType,
  PlayAnimationContextType,
  SelectedKeyFrameContext,
  StepsToDrawMaxRangeContext,
} from "..";

export default function AnimationPatternKeyFrames() {
  const { selectedAnimation, setSelectedAnimation } = React.useContext(
    SelectedAnimationContext
  ) as SelectedAnimationContextType;

  const { selectedAnimationPattern, setSelectedAnimationPattern } = React.useContext(
    SelectedAnimationPatternContext
  ) as SelectedAnimationPatternContextType;

  const xCorrection = React.useContext(XCorrectionContext);
  const { timelinePositionMs, setTimelinePositionMs } = React.useContext(
    TimeLinePositionContext
  ) as TimeLineContextType;

  const selectableSteps = React.useContext(SelectableStepsContext);
  const { selectableStepsIndex, setSelectableStepsIndex } = React.useContext(
    SelectableStepsIndexContext
  ) as SelectableStepsIndexContextType;

  const { selectedKeyFrameUuid, setSelectedKeyFrameUuid } = React.useContext(
    SelectedKeyFrameContext
  ) as SelectedKeyFrameContextType;

  const { playAnimation, setPlayAnimation } = React.useContext(PlayAnimationContext) as PlayAnimationContextType;

  const stepsToDrawMaxRange = React.useContext(StepsToDrawMaxRangeContext);

  const keyFramesPropertiesPosition = [
    { property: "scale", yPosition: canvasPxSize * 0.2 },
    { property: "xOffset", yPosition: canvasPxSize * 0.4 },
    { property: "yOffset", yPosition: canvasPxSize * 0.6 },
    { property: "rotation", yPosition: canvasPxSize * 0.8 },
  ];

  const selectedAnimationPatternIndex =
    selectedAnimation?.animationPatterns?.findIndex(
      (ap: { uuid: string | undefined }) => ap.uuid === selectedAnimationPattern?.uuid
    ) ?? 0;

  const { palette } = useTheme();

  useEffect(() => {
    drawTimelineOnCanvas();
  }, [
    animation,
    timelinePositionMs,
    playAnimation,
    selectableSteps,
    selectableStepsIndex,
    selectedKeyFrameUuid,
    xCorrection,
  ]);

  const getPropertyFromYPosition = (y: number) =>
    keyFramesPropertiesPosition.find((prop) => numberIsBetweenOrEqual(prop.yPosition, y - 20, y + 20))?.property;

  const prepareCanvas = (canvas: HTMLCanvasElement): HTMLCanvasElement => {
    canvas.width = canvasPxSize;
    canvas.height = canvasPxSize;
    canvas.style.width = canvasPxSize.toString();
    canvas.style.height = canvasPxSize.toString();
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    return canvas;
  };

  const drawTimeStepsAndKeyframes = (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    ctx.beginPath();
    ctx.font = "12px sans-serif";
    ctx.fillStyle = "whitesmoke";

    let xPos = canvasPxSize / 10 + 35;
    for (let i = timelinePositionMs; i < stepsToDrawMaxRange + 1; i += selectableSteps[selectableStepsIndex]) {
      ctx.fillText(i.toString(), xPos, canvasPxSize - 3);
      xPos += canvasPxSize / 13;
    }

    const keyFramesInRange = selectedAnimationPattern?.animationKeyFrames.filter((keyframe) =>
      numberIsBetweenOrEqual(keyframe.timeMs, timelinePositionMs, stepsToDrawMaxRange)
    );

    if (keyFramesInRange === undefined) {
      return;
    }

    drawKeyFrames(keyFramesInRange, canvas);
  };

  const drawProperties = (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    ctx.fillStyle = "whitesmoke";

    drawLine(80, canvasPxSize, 80, 0, ctx);
    keyFramesPropertiesPosition.forEach((keyframe) => {
      drawLine(80, keyframe.yPosition, canvasPxSize, keyframe.yPosition, ctx);
      ctx.font = "16px sans-serif";
      ctx.fillText(keyframe.property, 5, keyframe.yPosition);
    });
  };

  const drawTimelineOnCanvas = () => {
    let canvas = document.getElementById("svg-keyframe-canvas") as HTMLCanvasElement;
    canvas = prepareCanvas(canvas);
    drawProperties(canvas);
    drawTimeStepsAndKeyframes(canvas);
  };

  const drawKeyFrames = (keyFrames: AnimationPatternKeyFrame[], canvas: HTMLCanvasElement) => {
    if (keyFrames.length === 0) {
      return;
    }

    const stepsCorrection = [-2, 1, 1, 1, 1];
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    keyFrames.forEach((keyFrame) => {
      const keyFrameProperty = keyFramesPropertiesPosition.find((p) => p.property === keyFrame.propertyEdited);
      if (keyFrameProperty === undefined) {
        return;
      }

      const y = keyFrameProperty.yPosition;
      const x = mapNumber(keyFrame.timeMs, timelinePositionMs, stepsToDrawMaxRange, 80, canvasPxSize);

      const isSelected = keyFrame.uuid === selectedKeyFrameUuid;
      ctx.beginPath();
      ctx.arc(x + stepsCorrection[selectableStepsIndex], y, isSelected ? 8 : 6, 0, 2 * Math.PI);
      ctx.fillStyle = isSelected ? palette.primary.main : "white";
      ctx.fill();
    });
  };

  const onMiddleMouseClick = (e: any) => {
    if (e.button !== 1) {
      return;
    }

    e.preventDefault();

    const canvas = document.getElementById("svg-keyframe-canvas") as HTMLCanvasElement;
    const rect = canvas.getBoundingClientRect();
    const mouseXPosition = e.clientX - rect.left;
    const mouseYPosition = e.clientY - rect.top;
    const mappedX: number = mapNumber(mouseXPosition, 80, canvasPxSize, timelinePositionMs, stepsToDrawMaxRange) | 0;
    const mappedXToStep = mapXPositionToStepsXPosition(mappedX);

    const keyFrame = getKeyFrameFromMousePosition(mappedXToStep, mouseYPosition);
    let updatedAnimation: any = { ...selectedAnimation };

    if (animation === undefined || keyFrame === undefined) {
      return;
    }

    if (!window.confirm("Are you sure you want to remove this keyframe")) {
      return;
    }

    const indexToRemove = updatedAnimation.animationPatterns[
      selectedAnimationPatternIndex
    ].animationKeyFrames.findIndex((kf: AnimationPatternKeyFrame) => kf.uuid === keyFrame.uuid);
    updatedAnimation.animationPatterns[selectedAnimationPatternIndex].animationKeyFrames.splice(indexToRemove, 1);
    setSelectedAnimation(updatedAnimation);
  };

  const showMouseXAxis = (event: any) => {
    drawTimelineOnCanvas();
    const canvas = document.getElementById("svg-keyframe-canvas") as HTMLCanvasElement;
    const rect = canvas.getBoundingClientRect();
    const mouseXPosition = event.clientX - rect.left;
    const mouseYPosition = event.clientY - rect.top;
    if (mouseXPosition < 80 || mouseXPosition > canvasPxSize) {
      return;
    }

    const mappedX: number = mapNumber(mouseXPosition, 80, canvasPxSize, timelinePositionMs, stepsToDrawMaxRange) | 0;
    const mappedXToStep = mapXPositionToStepsXPosition(mappedX);
    const hoveredKeyFrame = getKeyFrameFromMousePosition(mappedXToStep, mouseYPosition);

    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    drawLine(mouseXPosition, 0, mouseXPosition, canvasPxSize, ctx);
    if (hoveredKeyFrame === undefined) {
      writeText(mouseXPosition, mouseYPosition, mappedXToStep.toString() + " x", "whitesmoke", ctx);
    } else {
      writeText(
        mouseXPosition,
        mouseYPosition,
        `${hoveredKeyFrame.propertyEdited}: ${hoveredKeyFrame.propertyValue}`,
        "whitesmoke",
        ctx
      );
    }
  };

  const onCanvasClick = (event: any) => {
    const canvas = document.getElementById("svg-keyframe-canvas") as HTMLCanvasElement;
    const rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    if (x < 85) {
      x = 85;
    }

    const mappedX: number = mapNumber(x, 80, canvasPxSize, timelinePositionMs, stepsToDrawMaxRange) | 0;
    const mappedXToStep = mapXPositionToStepsXPosition(mappedX);

    const y = event.clientY - rect.top;
    const propertyClicked = getPropertyFromYPosition(y);

    if (propertyClicked === undefined) {
      return;
    }

    const selectedKeyFrame = getKeyFrameFromMousePosition(mappedXToStep, y);
    if (selectedKeyFrame === undefined) {
      createNewKeyframe(y, mappedXToStep);
      setTimelinePositionMs(mappedXToStep);
      return;
    }

    setTimelinePositionMs(selectedKeyFrame.timeMs);
    setSelectedKeyFrameUuid(selectedKeyFrame.uuid);
  };

  const getKeyFrameFromMousePosition = (x: number, y: number) => {
    const propertyClicked = getPropertyFromYPosition(y);

    const selectedKeyFrame = selectedAnimationPattern?.animationKeyFrames.find((keyFrame) => {
      const min = (x - selectableSteps[selectableStepsIndex] / 5 - 1) | 0;
      const thisKeyFrameIsClicked =
        keyFrame.timeMs >= min && keyFrame.timeMs === x && keyFrame.propertyEdited === propertyClicked;
      return thisKeyFrameIsClicked;
    });

    return selectedKeyFrame;
  };

  const mapXPositionToStepsXPosition = (x: number) => {
    const step = selectableSteps[selectableStepsIndex];
    return Math.round(x / step) * step;
  };

  const createNewKeyframe = (y: number, timeMs: number) => {
    const propertyEdited = getPropertyFromYPosition(y) ?? "";
    const keyFrame = {
      uuid: createGuid(),
      timeMs,
      propertyEdited,
      propertyValue: propertiesSettings.find((ps) => ps.property === propertyEdited)?.defaultValue ?? 0,
    };

    let updatedAnimation: any = { ...selectedAnimation };
    if (updatedAnimation?.animationPatterns === undefined) {
      return;
    }

    updatedAnimation.animationPatterns[selectedAnimationPatternIndex ?? 0].animationKeyFrames.push(keyFrame);
    setSelectedAnimation(updatedAnimation);
    setSelectedKeyFrameUuid(keyFrame.uuid);
  };

  return (
    <canvas
      className="canvas"
      id="svg-keyframe-canvas"
      onClick={onCanvasClick}
      onMouseMove={showMouseXAxis}
      onMouseLeave={drawTimelineOnCanvas}
      onMouseDown={onMiddleMouseClick}
    />
  );
}
