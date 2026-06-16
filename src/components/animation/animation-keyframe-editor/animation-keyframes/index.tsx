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
import React, { useCallback, useEffect, useState } from "react";
import {
  getAnimationPropertyColor,
  propertiesSettings,
} from "services/logic/animation-logic";
import { canvasPxSize, selectableSteps } from "services/shared/config";
import { createGuid, mapNumber } from "services/shared/math";
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

export type AnimationPatternKeyFramesProps = {
  deleteKeyframe: (property: string) => void;
};

const keyFramesPropertiesPosition = [
  { property: AnimationProperty.scale, yPosition: canvasPxSize * 0.2 },
  { property: AnimationProperty.xOffset, yPosition: canvasPxSize * 0.4 },
  { property: AnimationProperty.yOffset, yPosition: canvasPxSize * 0.6 },
  { property: AnimationProperty.rotation, yPosition: canvasPxSize * 0.8 },
];

// Vertical room (in px) the value curve uses around each property baseline.
const keyFrameBandAmplitude = canvasPxSize * 0.07;

export default function AnimationPatternKeyFrames({
  deleteKeyframe,
}: AnimationPatternKeyFramesProps) {
  const [mouseIsHoveringOver, setMouseIsHoveringOver] = useState<boolean>(false);

  const { selectedAnimation, setSelectedAnimation } = React.useContext(
    SelectedAnimationContext,
  ) as SelectedAnimationContextType;

  const { selectedAnimationPattern } = React.useContext(
    SelectedAnimationPatternContext,
  ) as SelectedAnimationPatternContextType;

  const { timelinePositionMs, setTimelinePositionMs } = React.useContext(
    AnimationTimeLinePositionContext,
  ) as AnimationTimeLineContextType;

  const { selectableStepsIndex } = React.useContext(
    AnimationSelectableStepsIndexContext,
  ) as AnimationSelectableStepsIndexContextType;

  const { selectedKeyFrameUuid, setSelectedKeyFrameUuid } = React.useContext(
    AnimationSelectedKeyFrameContext,
  ) as AnimationSelectedKeyFrameContextType;

  const { playAnimation } = React.useContext(
    AnimationPlayAnimationContext,
  ) as AnimationPlayAnimationContextType;
  const stepsToDrawMaxRange = React.useContext(AnimationStepsToDrawMaxRangeContext);

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
      (ap: { uuid: string | undefined }) => ap.uuid === selectedAnimationPattern?.uuid,
    ) ?? 0;

  const { palette } = useTheme();

  // Min/max of each property's keyframe values so the curve auto-fits the band.
  // Computed every render (not memoized) because keyframe values are mutated in
  // place, which would not change a memo dependency reference and would leave
  // the bounds stale while editing a value.
  const valueBounds: Record<string, { min: number; max: number }> = {};
  const patternKeyFrames = selectedAnimationPattern?.animationPatternKeyFrames ?? [];
  keyFramesPropertiesPosition.forEach(({ property }) => {
    const values = patternKeyFrames
      .filter((kf) => kf.propertyEdited === property)
      .map((kf) => kf.propertyValue);
    valueBounds[property] =
      values.length > 0
        ? { min: Math.min(...values), max: Math.max(...values) }
        : { min: 0, max: 0 };
  });

  const getKeyFrameCanvasPosition = (keyFrame: AnimationPatternKeyFrame) => {
    const baseline =
      keyFramesPropertiesPosition.find((p) => p.property === keyFrame.propertyEdited)?.yPosition ??
      0;
    const x = mapNumber(
      keyFrame.timeMs,
      correctedTimelinePosition,
      correctedStepsToDrawMaxRange,
      80,
      canvasPxSize,
    );
    const { min, max } = valueBounds[keyFrame.propertyEdited] ?? { min: 0, max: 0 };
    const rawNormalized = max === min ? 0 : mapNumber(keyFrame.propertyValue, min, max, -1, 1);
    // Clamp so a keyframe can never leave its band (and the canvas), even while
    // its value is being dragged past the current min/max.
    const normalized = Math.max(-1, Math.min(1, rawNormalized));
    const y = baseline - normalized * keyFrameBandAmplitude;
    return { x, y };
  };

  const getKeyFrameNearMouse = (mouseX: number, mouseY: number, radius = 9) => {
    const keyFrames = selectedAnimationPattern?.animationPatternKeyFrames ?? [];
    let nearest: AnimationPatternKeyFrame | undefined;
    let nearestDistance = radius;
    keyFrames.forEach((keyFrame) => {
      const { x, y } = getKeyFrameCanvasPosition(keyFrame);
      if (x < 80 || x > canvasPxSize) {
        return;
      }

      const distance = Math.hypot(mouseX - x, mouseY - y);
      if (distance <= nearestDistance) {
        nearestDistance = distance;
        nearest = keyFrame;
      }
    });
    return nearest;
  };

  const drawTimeSteps = (canvas: HTMLCanvasElement) => {
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
  };

  const drawProperties = (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

    drawLine(80, canvasPxSize, 80, 0, ctx);
    keyFramesPropertiesPosition.forEach((keyframe) => {
      drawLine(80, keyframe.yPosition, canvasPxSize, keyframe.yPosition, ctx);
      ctx.font = "16px sans-serif";
      ctx.fillStyle = getAnimationPropertyColor(keyframe.property);
      ctx.fillText(keyframe.property, 5, keyframe.yPosition);
    });
  };

  const drawPropertyCurves = (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    const keyFrames = selectedAnimationPattern?.animationPatternKeyFrames ?? [];

    ctx.save();
    ctx.beginPath();
    ctx.rect(80, 0, canvasPxSize - 80, canvasPxSize);
    ctx.clip();

    keyFramesPropertiesPosition.forEach(({ property }) => {
      const color = getAnimationPropertyColor(property);
      const propertyKeyFrames = keyFrames
        .filter((kf) => kf.propertyEdited === property)
        .sort((a, b) => a.timeMs - b.timeMs)
        .map((keyFrame) => ({ keyFrame, ...getKeyFrameCanvasPosition(keyFrame) }));

      if (propertyKeyFrames.length > 1) {
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        propertyKeyFrames.forEach((point, index) =>
          index === 0 ? ctx.moveTo(point.x, point.y) : ctx.lineTo(point.x, point.y),
        );
        ctx.stroke();
      }

      propertyKeyFrames.forEach(({ keyFrame, x, y }) => {
        if (x < 80 || x > canvasPxSize) {
          return;
        }

        const isSelected = keyFrame.uuid === selectedKeyFrameUuid;
        ctx.beginPath();
        ctx.arc(x, y, isSelected ? 8 : 6, 0, 2 * Math.PI);
        ctx.fillStyle = isSelected ? palette.primary.main : color;
        ctx.fill();
        if (isSelected) {
          ctx.lineWidth = 2;
          ctx.strokeStyle = "#ffffff";
          ctx.stroke();
        }
      });
    });

    ctx.restore();
  };

  const drawOutsideRange = (canvas: HTMLCanvasElement) => {
    if (selectedAnimationPattern !== null) {
      const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
      ctx.font = "20px sans-serif";
      ctx.fillStyle = "whitesmoke";

      ctx.fillText(
        `Out of ${selectedAnimationPattern.name} range (${
          selectedAnimationPattern?.startTimeMs
        }ms/${
          getAnimationPatternDuration(selectedAnimationPattern) +
          selectedAnimationPattern.startTimeMs
        }ms)`,
        canvasPxSize / 16,
        canvasPxSize / 2,
      );
    }
  };

  const timelineIsOutSelectedAnimationPatternRange =
    (selectedAnimationPattern?.startTimeMs ?? 0) > timelinePositionMs ||
    getAnimationPatternDuration(selectedAnimationPattern) +
      (selectedAnimationPattern?.startTimeMs ?? 0) <
      timelinePositionMs;

  const onMouseLeaving = () => {
    if (mouseIsHoveringOver) {
      setMouseIsHoveringOver(false);
    }
  };

  const drawOnCanvas = useCallback(() => {
    let canvas = document.getElementById("svg-keyframe-canvas") as HTMLCanvasElement;
    canvas = prepareCanvas(canvas);
    if (timelineIsOutSelectedAnimationPatternRange) {
      drawOutsideRange(canvas);
      return;
    } else if (selectedAnimationPattern === null) {
      return;
    }

    drawProperties(canvas);
    drawTimeSteps(canvas);
    drawPropertyCurves(canvas);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- captures the current draw helpers intentionally
  }, [
    selectedAnimation,
    selectedAnimationPattern,
    timelinePositionMs,
    playAnimation,
    selectableStepsIndex,
    selectedKeyFrameUuid,
  ]);

  useEffect(() => {
    drawOnCanvas();
  }, [
    drawOnCanvas,
    timelinePositionMs,
    playAnimation,
    selectableStepsIndex,
    selectedKeyFrameUuid,
    selectedAnimation,
    mouseIsHoveringOver,
  ]);

  const getPropertyFromYPosition = (y: number) =>
    keyFramesPropertiesPosition.find((prop) =>
      Math.abs(prop.yPosition - y) <= keyFrameBandAmplitude + 12,
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

  const onMiddleMouseClick = (e: React.MouseEvent) => {
    if (e.button !== 1) {
      return;
    }

    e.preventDefault();

    const canvas = document.getElementById("svg-keyframe-canvas") as HTMLCanvasElement;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const keyFrame = getKeyFrameNearMouse(mouseX, mouseY);
    if (keyFrame === undefined) {
      return;
    }

    deleteKeyframe(keyFrame.uuid);
  };

  const showMouseXAxis = (event: React.MouseEvent) => {
    if (!mouseIsHoveringOver) {
      setMouseIsHoveringOver(true);
    }

    drawOnCanvas();
    const canvas = document.getElementById("svg-keyframe-canvas") as HTMLCanvasElement;
    if (timelineIsOutSelectedAnimationPatternRange) {
      drawOutsideRange(canvas);
      return;
    }
    if (selectedAnimationPattern === null) {
      return;
    }

    const rect = canvas.getBoundingClientRect();
    const mouseXPosition = event.clientX - rect.left;
    const mouseYPosition = event.clientY - rect.top;
    if (mouseXPosition < 80 || mouseXPosition > canvasPxSize) {
      return;
    }

    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    ctx.beginPath();
    drawLine(mouseXPosition, 0, mouseXPosition, canvasPxSize, ctx);

    const hoveredKeyFrame = getKeyFrameNearMouse(mouseXPosition, mouseYPosition);
    if (hoveredKeyFrame === undefined) {
      const mappedX: number =
        mapNumber(
          mouseXPosition,
          80,
          canvasPxSize,
          correctedTimelinePosition,
          correctedStepsToDrawMaxRange,
        ) | 0;
      const mappedXToStep = mapXPositionToStepsXPosition(mappedX);
      writeText(mouseXPosition, mouseYPosition, `${mappedXToStep} ms`, "whitesmoke", ctx);
    } else {
      writeText(
        mouseXPosition,
        mouseYPosition,
        `${hoveredKeyFrame.propertyEdited}: ${hoveredKeyFrame.propertyValue}`,
        "whitesmoke",
        ctx,
      );
    }
  };

  const onCanvasClick = (event: React.MouseEvent) => {
    const canvas = document.getElementById("svg-keyframe-canvas") as HTMLCanvasElement;
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const clickedKeyFrame = getKeyFrameNearMouse(mouseX, mouseY);
    if (clickedKeyFrame !== undefined) {
      setTimelinePositionMs(clickedKeyFrame.timeMs + (selectedAnimationPattern?.startTimeMs ?? 0));
      setSelectedKeyFrameUuid(clickedKeyFrame.uuid);
      return;
    }

    let x = mouseX;
    if (x < 85) {
      x = 85;
    }

    const mappedX: number =
      mapNumber(x, 80, canvasPxSize, correctedTimelinePosition, correctedStepsToDrawMaxRange) | 0;
    const mappedXToStep = mapXPositionToStepsXPosition(mappedX);
    const propertyClicked = getPropertyFromYPosition(mouseY);
    if (propertyClicked === AnimationProperty.undefined) {
      return;
    }

    createNewKeyframe(mouseY, mappedXToStep);
    setTimelinePositionMs(mappedXToStep + (selectedAnimationPattern?.startTimeMs ?? 0));
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

    const updatedAnimation: Animation = { ...selectedAnimation };
    if (updatedAnimation?.animationPatterns === undefined) {
      return;
    }

    updatedAnimation.animationPatterns[
      selectedAnimationPatternIndex ?? 0
    ].animationPatternKeyFrames.push(keyFrame);
    setSelectedAnimation(updatedAnimation);
    setSelectedKeyFrameUuid(keyFrame.uuid);
  };

  return (
    <canvas
      tabIndex={0}
      className="canvas"
      id="svg-keyframe-canvas"
      onClick={onCanvasClick}
      onMouseMove={showMouseXAxis}
      onMouseLeave={() => onMouseLeaving()}
      onMouseDown={onMiddleMouseClick}
    />
  );
}
