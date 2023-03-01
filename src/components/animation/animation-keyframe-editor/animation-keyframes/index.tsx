import {
  Grid,
  InputLabel,
  Input,
  Select,
  MenuItem,
  Tooltip,
  IconButton,
  useTheme,
  LinearProgress,
} from "@mui/material";
import { Animation, AnimationKeyFrame, AnimationPattern } from "models/components/shared/animation";
import React, { useEffect } from "react";
import { createGuid, mapNumber, normalize as normalize, numberIsBetweenOrEqual } from "services/shared/math";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { propertiesSettings } from "services/logic/animation-logic";
import { canvasPxSize } from "services/shared/config";

type Props = {
  timelinePositionMs: number;
  playAnimation: boolean;
  setTimelinePositionMs: (value: number) => void;
  setSelectableStepsIndex: (value: number) => void;
  selectableSteps: number[];
  selectableStepsIndex: number;
  xCorrection: number[];
  selectedAnimation: Animation | null;
  setSelectedAnimation: (animation: Animation) => void;
  selectedKeyFrameUuid: string;
  setSelectedKeyFrameUuid: (uuid: string) => void;
  setPlayAnimation: (play: boolean) => void;
  selectedAnimationPattern: AnimationPattern | null;
  setSelectedAnimationPattern: (animationPattern: AnimationPattern | null) => void;
};

export default function AnimationKeyFrames({
  selectedAnimation: animation,
  timelinePositionMs,
  playAnimation,
  setTimelinePositionMs,
  setSelectableStepsIndex,
  selectableSteps,
  selectableStepsIndex,
  selectedKeyFrameUuid,
  xCorrection,
  setSelectedAnimation,
  setSelectedKeyFrameUuid,
  setPlayAnimation,
  setSelectedAnimationPattern,
  selectedAnimationPattern,
}: Props) {
  const uiComponentsAreDisabled = selectedAnimationPattern === null;
  let stepsToDrawMaxRange = 0;
  const keyFramesPropertiesPosition = [
    { property: "scale", yPosition: canvasPxSize * 0.2 },
    { property: "xOffset", yPosition: canvasPxSize * 0.4 },
    { property: "yOffset", yPosition: canvasPxSize * 0.6 },
    { property: "rotation", yPosition: canvasPxSize * 0.8 },
  ];

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

  const drawLine = (fromX: number, fromY: number, toX: number, toY: number, ctx: CanvasRenderingContext2D) => {
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.strokeStyle = "rgb(90, 90, 90, 0.7)";
    ctx.stroke();
  };

  const writeText = (x: number, y: number, text: string, ctx: CanvasRenderingContext2D) => {
    ctx.beginPath();
    ctx.font = "12px sans-serif";
    ctx.fillStyle = "whitesmoke";
    ctx.fillText(text, x, y);
  };

  const drawTimeStepsAndKeyframes = (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    ctx.beginPath();
    ctx.font = "12px sans-serif";
    ctx.fillStyle = "whitesmoke";

    const minRange = timelinePositionMs;
    stepsToDrawMaxRange = (timelinePositionMs + selectableSteps[selectableStepsIndex] * 10) | 0;

    let xPos = canvasPxSize / 10 + 35;
    for (let i = minRange; i < stepsToDrawMaxRange + 1; i += selectableSteps[selectableStepsIndex]) {
      ctx.fillText(i.toString(), xPos, canvasPxSize);
      xPos += canvasPxSize / 13;
    }

    const keyFramesInRange = selectedAnimationPattern?.animationKeyFrames.filter((keyframe) =>
      numberIsBetweenOrEqual(keyframe.timeMs, minRange, stepsToDrawMaxRange)
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

  const drawKeyFrames = (keyFrames: AnimationKeyFrame[], canvas: HTMLCanvasElement) => {
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

  const onMouseScroll = (e: any) => {
    const canvas = document.getElementById("svg-keyframe-canvas") as HTMLCanvasElement;
    const rect = canvas.getBoundingClientRect();
    const mouseXPosition = e.clientX - rect.left;

    const scrollDown = e.deltaY > 0;
    let newSelectableStepsIndex = selectableStepsIndex;
    if (scrollDown && selectableStepsIndex < selectableSteps.length - 1) {
      newSelectableStepsIndex += 1;
    } else if (!scrollDown && selectableStepsIndex > 0) {
      newSelectableStepsIndex -= 1;
    }

    if (mouseXPosition < 80 || selectableStepsIndex === newSelectableStepsIndex) {
      return;
    }

    let timelinePosition: number =
      (mapNumber(mouseXPosition, 80, canvasPxSize, timelinePositionMs, stepsToDrawMaxRange) -
        xCorrection[newSelectableStepsIndex]) |
      0;
    if (timelinePosition < 0) {
      timelinePosition = 0;
    }

    setTimelinePositionMs(timelinePosition);
    setSelectableStepsIndex(newSelectableStepsIndex);
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
    let updatedAnimation: any = { ...animation };

    if (animation === undefined || keyFrame === undefined) {
      return;
    }

    if (!window.confirm("Are you sure you want to remove this keyframe")) {
      return;
    }

    const indexToRemove = updatedAnimation.animationKeyFrames.findIndex(
      (kf: AnimationKeyFrame) => kf.uuid === keyFrame.uuid
    );
    updatedAnimation.animationKeyFrames.splice(indexToRemove, 1);
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
      writeText(mouseXPosition, mouseYPosition, mappedXToStep.toString() + " x", ctx);
    } else {
      writeText(
        mouseXPosition,
        mouseYPosition,
        `${hoveredKeyFrame.propertyEdited}: ${hoveredKeyFrame.propertyValue}`,
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
      return;
    }

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
      propertyValue: propertiesSettings.find((ps) => ps.property === propertyEdited)?.default ?? 0,
    };

    let updatedAnimation: any = { ...animation };
    if (updatedAnimation?.animationKeyFrames === undefined) {
      return;
    }

    updatedAnimation.animationKeyFrames.push(keyFrame);
    setSelectedAnimation(updatedAnimation);
    setSelectedKeyFrameUuid(keyFrame.uuid);
  };

  const duration = Math.max(...(selectedAnimationPattern?.animationKeyFrames?.map((ak) => ak?.timeMs) ?? []));
  return (
    <>
      <canvas
        className="canvas"
        id="svg-keyframe-canvas"
        onClick={onCanvasClick}
        onMouseMove={showMouseXAxis}
        onMouseLeave={drawTimelineOnCanvas}
        onWheel={onMouseScroll}
        onMouseDown={onMiddleMouseClick}
      />
      <LinearProgress
        sx={{ width: `${canvasPxSize - 80}px`, marginLeft: "80px", transition: "none" }}
        variant="determinate"
        value={timelinePositionMs <= duration ? normalize(timelinePositionMs, 0, duration) : 100}
      />
      <Grid container direction="row" spacing={2}>
        <Grid item xs={2.6}>
          <InputLabel id="timeline-position-ms">Timeline position ms</InputLabel>
          <Input
            disabled={uiComponentsAreDisabled}
            id="timeline-position-ms"
            value={timelinePositionMs}
            onKeyDown={(e) => e.preventDefault()}
            onChange={(e) => setTimelinePositionMs(Number(e.target.value))}
            type="number"
            inputProps={{ min: 0, step: selectableSteps[selectableStepsIndex] }}
          />
        </Grid>
        <span style={{ marginLeft: "10px", marginTop: "40px" }}>
          <Tooltip title="Reset timeline position to 0">
            <span>
              <IconButton disabled={uiComponentsAreDisabled} onClick={() => setTimelinePositionMs(0)}>
                <RestartAltIcon />
              </IconButton>
            </span>
          </Tooltip>
        </span>
        <Grid item xs={3}>
          <InputLabel id="steps-select">Steps</InputLabel>
          <Select
            disabled={uiComponentsAreDisabled}
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
          <span style={{ marginLeft: "10px" }}>
            {playAnimation ? (
              <Tooltip title="Pause animation">
                <span>
                  <IconButton onClick={() => setPlayAnimation(false)} disabled={uiComponentsAreDisabled}>
                    <PauseIcon />
                  </IconButton>
                </span>
              </Tooltip>
            ) : (
              <Tooltip title="Start animation">
                <span>
                  <IconButton onClick={() => setPlayAnimation(true)} disabled={uiComponentsAreDisabled}>
                    <PlayArrowIcon />
                  </IconButton>
                </span>
              </Tooltip>
            )}
          </span>
        </Grid>
      </Grid>
    </>
  );
}
