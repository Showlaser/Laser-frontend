import {
  Divider,
  FormLabel,
  Grid,
  IconButton,
  Input,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Tooltip,
} from "@mui/material";
import PointsDrawer from "components/shared/points-drawer";
import { Animation, AnimationKeyFrame } from "models/components/shared/animation";
import React, { useEffect, useState } from "react";
import { createGuid, mapNumber, numberIsBetweenOrEqual } from "services/shared/math";
import DeleteIcon from "@mui/icons-material/Delete";
type Props = {
  animation: Animation | null;
  setSelectedAnimation: (animation: Animation | null) => void;
};

export default function AnimationKeyFrameEditor({ animation, setSelectedAnimation }: Props) {
  const [timelinePositionMs, setTimelinePositionMs] = useState<number>(0);
  const [selectableStepsIndex, setSelectableStepsIndex] = useState<number>(0);
  let maxRange = 0;
  const [selectedKeyFrameUuid, setSelectedKeyFrameUuid] = useState<string>("");
  const selectableSteps = [1, 10, 100, 1000];
  const keyFramesPropertiesPosition = [
    { property: "scale", yPosition: 80 },
    { property: "xOffset", yPosition: 220 },
    { property: "yOffset", yPosition: 360 },
    { property: "rotation", yPosition: 500 },
  ];

  useEffect(() => {
    drawTimelineOnCanvas();
  }, [selectableStepsIndex, timelinePositionMs, selectedKeyFrameUuid, animation]);

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
    maxRange = (timelinePositionMs + selectableSteps[selectableStepsIndex] * 10) | 0;

    const stepsCorrection = [0, -25, -25, -25];
    let xPos = 100;
    for (let i = minRange; i < maxRange + 1; i += selectableSteps[selectableStepsIndex]) {
      ctx.fillText(i.toString(), xPos + stepsCorrection[selectableStepsIndex], 645);
      xPos += 55;
    }

    const keyFramesInRange = animation?.animationKeyFrames.filter((keyframe) =>
      numberIsBetweenOrEqual(keyframe.timeMs, minRange, maxRange)
    );

    if (keyFramesInRange === undefined) {
      return;
    }

    drawKeyFrames(keyFramesInRange, maxRange, canvas);
  };

  const drawProperties = (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    ctx.fillStyle = "whitesmoke";

    drawLine(80, 650, 80, 0, ctx);
    keyFramesPropertiesPosition.forEach((keyframe) => {
      drawLine(80, keyframe.yPosition, 650, keyframe.yPosition, ctx);
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

  const drawKeyFrames = (keyFrames: AnimationKeyFrame[], maxRange: number, canvas: HTMLCanvasElement) => {
    if (keyFrames.length === 0) {
      return;
    }

    const stepsCorrection = [20, 1, 1, 1];
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    keyFrames.forEach((keyFrame) => {
      const keyFrameProperty = keyFramesPropertiesPosition.find((p) => p.property === keyFrame.propertyEdited);
      if (keyFrameProperty === undefined) {
        return;
      }

      const y = keyFrameProperty.yPosition;
      const x = mapNumber(keyFrame.timeMs, timelinePositionMs, maxRange, 80, 650);

      const isSelected = keyFrame.uuid === selectedKeyFrameUuid;
      ctx.beginPath();
      ctx.arc(x + stepsCorrection[selectableStepsIndex], y, isSelected ? 6 : 4, 0, 2 * Math.PI);
      ctx.fillStyle = isSelected ? "#4287f5" : "white";
      ctx.fill();
    });
  };

  const createNewKeyframe = (y: number, timeMs: number) => {
    const propertyEdited = getPropertyFromYPosition(y) ?? "";
    const keyFrame = {
      uuid: createGuid(),
      timeMs,
      propertyEdited,
      propertyValue: 0,
    };

    let updatedAnimation: any = { ...animation };
    if (updatedAnimation?.animationKeyFrames === undefined) {
      return;
    }

    updatedAnimation.animationKeyFrames.push(keyFrame);
    setSelectedAnimation(updatedAnimation);
    setSelectedKeyFrameUuid(keyFrame.uuid);
  };

  const getKeyFrameFromMousePosition = (x: number, y: number) => {
    const propertyClicked = getPropertyFromYPosition(y);

    const selectedKeyFrame = animation?.animationKeyFrames.find((keyFrame) => {
      const min = (x - selectableSteps[selectableStepsIndex] / 5 - 1) | 0;
      const thisKeyFrameIsClicked =
        keyFrame.timeMs >= min && keyFrame.timeMs === x && keyFrame.propertyEdited === propertyClicked;
      return thisKeyFrameIsClicked;
    });

    return selectedKeyFrame;
  };

  const onCanvasClick = (event: any) => {
    const canvas = document.getElementById("svg-keyframe-canvas") as HTMLCanvasElement;
    const rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    if (x < 85) {
      x = 85;
    }

    const mappedX: number = mapNumber(x, 80, 650, timelinePositionMs, maxRange) | 0;
    const y = event.clientY - rect.top;
    const propertyClicked = getPropertyFromYPosition(y);

    if (propertyClicked === undefined) {
      return;
    }

    const selectedKeyFrame = getKeyFrameFromMousePosition(mappedX, y);
    if (selectedKeyFrame === undefined) {
      createNewKeyframe(y, mappedX);
      return;
    }

    setSelectedKeyFrameUuid(selectedKeyFrame.uuid);
  };

  const getPropertyFromYPosition = (y: number) =>
    keyFramesPropertiesPosition.find((prop) => numberIsBetweenOrEqual(prop.yPosition, y - 20, y + 20))?.property;

  const showMouseXAxis = (event: any) => {
    drawTimelineOnCanvas();
    const canvas = document.getElementById("svg-keyframe-canvas") as HTMLCanvasElement;
    const rect = canvas.getBoundingClientRect();
    const mouseXPosition = event.clientX - rect.left;
    const mouseYPosition = event.clientY - rect.top;
    if (mouseXPosition < 80 || mouseXPosition > 650) {
      return;
    }

    const mappedX: number = mapNumber(mouseXPosition, 80, 650, timelinePositionMs, maxRange) | 0;
    const hoveredKeyFrame = getKeyFrameFromMousePosition(mappedX, mouseYPosition);

    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    drawLine(mouseXPosition, 0, mouseXPosition, 650, ctx);
    if (hoveredKeyFrame === undefined) {
      writeText(mouseXPosition, mouseYPosition, mappedX.toString() + " x", ctx);
    } else {
      writeText(
        mouseXPosition,
        mouseYPosition,
        `${hoveredKeyFrame.propertyEdited}: ${hoveredKeyFrame.propertyValue}`,
        ctx
      );
    }
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

    const xCorrection = [3, 40, 350, 3000];
    let timelinePosition: number =
      (mapNumber(mouseXPosition, 80, 650, timelinePositionMs, maxRange) - xCorrection[newSelectableStepsIndex]) | 0;
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
    const mappedX: number = mapNumber(mouseXPosition, 80, 650, timelinePositionMs, maxRange) | 0;

    const keyFrame = getKeyFrameFromMousePosition(mappedX, mouseYPosition);
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

  const updateProperty = (value: string | number) => {
    const selectedKeyFrameIndex = animation?.animationKeyFrames.findIndex((kf) => kf.uuid === selectedKeyFrameUuid);
    let updatedAnimation: any = { ...animation };
    if (
      updatedAnimation === undefined ||
      selectedKeyFrameIndex === undefined ||
      updatedAnimation?.animationKeyFrames === undefined
    ) {
      return;
    }

    updatedAnimation.animationKeyFrames[selectedKeyFrameIndex].propertyValue = value;
    setSelectedAnimation(updatedAnimation);
  };

  const getPropertyValue = (property: String) => {
    const selectedKeyFrame = animation?.animationKeyFrames.find((kf) => {
      const value = kf.uuid === selectedKeyFrameUuid && kf.propertyEdited === property;
      return value;
    });

    return selectedKeyFrame?.propertyValue;
  };

  const onRemove = () => {
    if (selectedKeyFrameUuid === "") {
      return;
    }

    setSelectedKeyFrameUuid("");
    let updatedAnimation: any = { ...animation };
    const selectedKeyFrameIndex = animation?.animationKeyFrames.findIndex((kf) => kf.uuid === selectedKeyFrameUuid);
    if (
      updatedAnimation === undefined ||
      selectedKeyFrameIndex === undefined ||
      updatedAnimation?.animationKeyFrames === undefined
    ) {
      return;
    }

    updatedAnimation.animationKeyFrames.splice(selectedKeyFrameIndex, 1);
    setSelectedAnimation(updatedAnimation);
  };

  return (
    <Grid container direction="row" spacing={2} key={selectedKeyFrameUuid}>
      <Grid item xs={2}>
        <Paper style={{ padding: "15px", paddingTop: "2px" }}>
          <p>Animation properties</p>
          <Divider style={{ marginBottom: "10px" }} />
          <FormLabel htmlFor="animation-scale">Scale</FormLabel>
          <br />
          <Input
            id="animation-scale"
            type="number"
            inputProps={{ min: 0.1, max: 10, step: 0.1 }}
            value={getPropertyValue("scale")}
            onChange={(e) => updateProperty(Number(e.target.value))}
          />
          <br />
          <div style={{ marginTop: "60px" }}>
            <FormLabel htmlFor="animation-xoffset">X offset</FormLabel>
            <br />
            <Input
              id="animation-xoffset"
              type="number"
              inputProps={{ min: -200, max: 200 }}
              value={getPropertyValue("xOffset")}
              onChange={(e) => updateProperty(Number(e.target.value))}
            />
          </div>
          <br />
          <div style={{ marginTop: "60px" }}>
            <FormLabel htmlFor="animation-yoffset">Y offset</FormLabel>
            <br />
            <Input
              id="animation-yoffset"
              type="number"
              inputProps={{ min: -200, max: 200 }}
              value={getPropertyValue("yOffset")}
              onChange={(e) => updateProperty(Number(e.target.value))}
            />
          </div>
          <div style={{ marginTop: "70px" }}>
            <FormLabel htmlFor="animation-rotation">Rotation</FormLabel>
            <br />
            <Input
              id="animation-rotation"
              type="number"
              inputProps={{ min: -360, max: 360 }}
              value={getPropertyValue("rotation")}
              onChange={(e) => updateProperty(Number(e.target.value))}
            />
          </div>
          <br />
          <Divider />
          <Tooltip title="Remove keyframe" placement="right">
            <IconButton
              disabled={selectedKeyFrameUuid === ""}
              style={{ marginLeft: "10px" }}
              onClick={() => (window.confirm("Are you sure you want to remove this keyframe?") ? onRemove() : null)}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Paper>
        <br />
        <Paper style={{ padding: "15px", paddingTop: "2px" }}>
          <p>Animation info</p>
          <Divider />
          <small>
            Animation duration: {Math.max(...(animation?.animationKeyFrames?.map((ak) => ak?.timeMs) ?? []))}
          </small>
          <br />
          <small>Total keyframes: {animation?.animationKeyFrames?.length}</small>
        </Paper>
      </Grid>
      <Grid item xs>
        <canvas
          className="canvas"
          id="svg-keyframe-canvas"
          onClick={onCanvasClick}
          onMouseMove={showMouseXAxis}
          onMouseLeave={drawTimelineOnCanvas}
          onWheel={onMouseScroll}
          onMouseDown={onMiddleMouseClick}
        />
        <Grid container direction="row" spacing={2}>
          <Grid item xs={2.6}>
            <InputLabel id="timeline-position-ms">Timeline position ms</InputLabel>
            <Input
              id="timeline-position-ms"
              value={timelinePositionMs}
              onChange={(e) => setTimelinePositionMs(Number(e.target.value))}
              type="number"
              inputProps={{ min: 0, step: selectableSteps[selectableStepsIndex] }}
            />
          </Grid>
          <Grid item xs={3}>
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
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs>
        <PointsDrawer pointsToDraw={[]} />
      </Grid>
    </Grid>
  );
}
