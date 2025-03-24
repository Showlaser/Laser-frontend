import { useTheme } from "@mui/material";
import { drawLine, writeText } from "components/shared/canvas-helper";
import {
  Animation,
  AnimationPatternKeyFrame,
  AnimationProperty,
  getAnimationPatternDuration,
} from "models/components/shared/animation";
import {
  SelectedAnimationContext,
  SelectedAnimationContextType,
  SelectedAnimationPatternContext,
  SelectedAnimationPatternContextType,
} from "pages/animation-editor";
import React, { useCallback, useEffect, useRef } from "react";
import { propertiesSettings } from "services/logic/animation-logic";
import { canvasPxSize, selectableSteps } from "services/shared/config";
import { createGuid, mapNumber, numberIsBetweenOrEqual } from "services/shared/math";
import {
  AnimationPlayAnimationContext,
  AnimationPlayAnimationContextType,
  AnimationSelectableStepsIndexContext,
  AnimationSelectableStepsIndexContextType,
  AnimationSelectedKeyFrameContext,
  AnimationSelectedKeyFrameContextType,
  AnimationStepsToDrawMaxRangeContext,
  AnimationTimeLineContextType,
  AnimationTimeLinePositionContext,
} from "..";

export default function AnimationPatternKeyFrames() {
  const { selectedAnimation, setSelectedAnimation } = React.useContext(
    SelectedAnimationContext
  ) as SelectedAnimationContextType;

  const { selectedAnimationPattern } = React.useContext(
    SelectedAnimationPatternContext
  ) as SelectedAnimationPatternContextType;

  const { timelinePositionMs, setTimelinePositionMs } = React.useContext(
    AnimationTimeLinePositionContext
  ) as AnimationTimeLineContextType;

  const { selectableStepsIndex } = React.useContext(
    AnimationSelectableStepsIndexContext
  ) as AnimationSelectableStepsIndexContextType;

  const { selectedKeyFrameUuid, setSelectedKeyFrameUuid } = React.useContext(
    AnimationSelectedKeyFrameContext
  ) as AnimationSelectedKeyFrameContextType;

  const { playAnimation } = React.useContext(
    AnimationPlayAnimationContext
  ) as AnimationPlayAnimationContextType;
  const stepsToDrawMaxRange = React.useContext(AnimationStepsToDrawMaxRangeContext);

  const keyFramesPropertiesPosition = [
    { property: AnimationProperty.scale, yPosition: canvasPxSize * 0.2 },
    { property: AnimationProperty.xOffset, yPosition: canvasPxSize * 0.4 },
    { property: AnimationProperty.yOffset, yPosition: canvasPxSize * 0.6 },
    { property: AnimationProperty.rotation, yPosition: canvasPxSize * 0.8 },
  ];

  const getCorrectedTimelinePosition = () => {
    const correctedPosition = timelinePositionMs - (selectedAnimationPattern?.startTimeMs ?? 0);
    if (correctedPosition < 0) {
      return 0;
    }

    return correctedPosition;
  };

  const correctedTimelinePosition = getCorrectedTimelinePosition();
  const correctedStepsToDrawMaxRange =
    stepsToDrawMaxRange - (selectedAnimationPattern?.startTimeMs ?? 0);

  const selectedAnimationPatternIndex =
    selectedAnimation?.animationPatterns?.findIndex(
      (ap: { uuid: string | undefined }) => ap.uuid === selectedAnimationPattern?.uuid
    ) ?? 0;

  const { palette } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawTimeStepsAndKeyframes = (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    ctx.beginPath();
    ctx.font = "12px sans-serif";
    ctx.fillStyle = "whitesmoke";

    let xPos = canvasPxSize / 10 + 35;
    for (
      let i = correctedTimelinePosition;
      i < correctedStepsToDrawMaxRange + 1;
      i += selectableSteps[selectableStepsIndex]
    ) {
      ctx.fillText(i.toString(), xPos, canvasPxSize - 3);
      xPos += canvasPxSize / 13;
    }

    const keyFramesInRange = selectedAnimationPattern?.animationPatternKeyFrames.filter(
      (keyframe) => {
        const istrue = numberIsBetweenOrEqual(
          keyframe.timeMs,
          correctedTimelinePosition,
          correctedStepsToDrawMaxRange
        );
        return istrue;
      }
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

  const drawOutsideRange = (canvas: HTMLCanvasElement) => {
    if (selectedAnimationPattern !== null) {
      const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
      ctx.font = "20px sans-serif";
      ctx.fillStyle = "whitesmoke";

      ctx.fillText(
        `Out of animation pattern range (${selectedAnimationPattern?.startTimeMs}ms/${
          getAnimationPatternDuration(selectedAnimationPattern) +
          selectedAnimationPattern.startTimeMs
        }ms)`,
        canvasPxSize / 16,
        canvasPxSize / 2
      );
    }
  };

  const drawOnCanvas = useCallback(() => {
    let canvas = document.getElementById("svg-keyframe-canvas") as HTMLCanvasElement;
    canvas = prepareCanvas(canvas);
    if ((selectedAnimationPattern?.startTimeMs ?? 0) > timelinePositionMs) {
      drawOutsideRange(canvas);
      return;
    } else if (selectedAnimationPattern === null) {
      return;
    }

    drawProperties(canvas);
    drawTimeStepsAndKeyframes(canvas);
  }, [
    selectedAnimationPattern,
    timelinePositionMs,
    playAnimation,
    selectableStepsIndex,
    drawProperties,
    drawTimeStepsAndKeyframes,
    selectedKeyFrameUuid,
  ]);

  useEffect(() => {
    canvasRef.current?.focus();
    drawOnCanvas();
  }, [
    drawOnCanvas,
    timelinePositionMs,
    playAnimation,
    selectableStepsIndex,
    selectedKeyFrameUuid,
    selectedAnimation,
  ]);

  const getPropertyFromYPosition = (y: number) =>
    keyFramesPropertiesPosition.find((prop) =>
      numberIsBetweenOrEqual(prop.yPosition, y - 20, y + 20)
    )?.property ?? AnimationProperty.undefined;

  const prepareCanvas = (canvas: HTMLCanvasElement): HTMLCanvasElement => {
    canvas.width = canvasPxSize;
    canvas.height = canvasPxSize;
    canvas.style.width = canvasPxSize.toString();
    canvas.style.height = canvasPxSize.toString();
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    return canvas;
  };

  const drawKeyFrames = (keyFrames: AnimationPatternKeyFrame[], canvas: HTMLCanvasElement) => {
    if (keyFrames.length === 0) {
      return;
    }

    const stepsCorrection = [-2, 1, 1, 1, 1];
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    keyFrames.forEach((keyFrame) => {
      const keyFrameProperty = keyFramesPropertiesPosition.find(
        (p) => p.property === keyFrame.propertyEdited
      );
      if (keyFrameProperty === undefined) {
        return;
      }

      const y = keyFrameProperty.yPosition;
      const x = mapNumber(
        keyFrame.timeMs,
        correctedTimelinePosition,
        correctedStepsToDrawMaxRange,
        80,
        canvasPxSize
      );

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
    const mappedX: number =
      mapNumber(
        mouseXPosition,
        80,
        canvasPxSize,
        correctedTimelinePosition,
        correctedStepsToDrawMaxRange
      ) | 0;
    const mappedXToStep = mapXPositionToStepsXPosition(mappedX);

    const keyFrame = getKeyFrameFromMousePosition(mappedXToStep, mouseYPosition);
    if (keyFrame === undefined) {
      return;
    }

    deleteKeyframe(keyFrame.uuid);
  };

  const deleteKeyframe = (keyFrameUuid: string) => {
    if (selectedAnimation === null || keyFrameUuid.length < 5) {
      return;
    }

    let updatedAnimation: Animation = { ...selectedAnimation };

    if (!window.confirm("Are you sure you want to remove this keyframe")) {
      return;
    }

    const indexToRemove = updatedAnimation.animationPatterns[
      selectedAnimationPatternIndex
    ].animationPatternKeyFrames.findIndex(
      (kf: AnimationPatternKeyFrame) => kf.uuid === keyFrameUuid
    );
    updatedAnimation.animationPatterns[
      selectedAnimationPatternIndex
    ].animationPatternKeyFrames.splice(indexToRemove, 1);
    setSelectedAnimation(updatedAnimation);
  };

  const showMouseXAxis = (event: any) => {
    drawOnCanvas();
    const canvas = document.getElementById("svg-keyframe-canvas") as HTMLCanvasElement;
    const rect = canvas.getBoundingClientRect();
    const mouseXPosition = event.clientX - rect.left;
    const mouseYPosition = event.clientY - rect.top;
    if (mouseXPosition < 80 || mouseXPosition > canvasPxSize) {
      return;
    }

    const mappedX: number =
      mapNumber(
        mouseXPosition,
        80,
        canvasPxSize,
        correctedTimelinePosition,
        correctedStepsToDrawMaxRange
      ) | 0;
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

    const mappedX: number =
      mapNumber(x, 80, canvasPxSize, correctedTimelinePosition, correctedStepsToDrawMaxRange) | 0;
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

    setTimelinePositionMs(selectedKeyFrame.timeMs + (selectedAnimationPattern?.startTimeMs ?? 0));
    setSelectedKeyFrameUuid(selectedKeyFrame.uuid);
  };

  const getKeyFrameFromMousePosition = (x: number, y: number) => {
    const propertyClicked = getPropertyFromYPosition(y);

    const selectedKeyFrame = selectedAnimationPattern?.animationPatternKeyFrames.find(
      (keyFrame) => {
        const min = (x - selectableSteps[selectableStepsIndex] / 5 - 1) | 0;
        const thisKeyFrameIsClicked =
          keyFrame.timeMs >= min &&
          keyFrame.timeMs === x &&
          keyFrame.propertyEdited === propertyClicked;
        return thisKeyFrameIsClicked;
      }
    );

    return selectedKeyFrame;
  };

  const mapXPositionToStepsXPosition = (x: number) => {
    const step = selectableSteps[selectableStepsIndex];
    return Math.round(x / step) * step;
  };

  const createNewKeyframe = (y: number, timeMs: number) => {
    if (selectedAnimationPattern?.uuid === undefined) {
      return;
    }

    const propertyEdited = getPropertyFromYPosition(y);
    const keyFrame: AnimationPatternKeyFrame = {
      uuid: createGuid(),
      animationPatternUuid: selectedAnimationPattern.uuid,
      timeMs,
      propertyEdited,
      propertyValue:
        propertiesSettings.find((ps) => ps.property === propertyEdited)?.defaultValue ?? 0,
    };

    if (selectedAnimation === null) {
      return;
    }

    let updatedAnimation: Animation = { ...selectedAnimation };
    if (updatedAnimation?.animationPatterns === undefined) {
      return;
    }

    updatedAnimation.animationPatterns[
      selectedAnimationPatternIndex ?? 0
    ].animationPatternKeyFrames.push(keyFrame);
    setSelectedAnimation(updatedAnimation);
    setSelectedKeyFrameUuid(keyFrame.uuid);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Delete") {
      e.preventDefault();
      deleteKeyframe(selectedKeyFrameUuid);
    }
  };

  return (
    <canvas
      ref={canvasRef}
      onKeyDown={onKeyDown}
      tabIndex={0}
      className="canvas"
      id="svg-keyframe-canvas"
      onClick={onCanvasClick}
      onMouseMove={showMouseXAxis}
      onMouseLeave={drawOnCanvas}
      onMouseDown={onMiddleMouseClick}
    />
  );
}
