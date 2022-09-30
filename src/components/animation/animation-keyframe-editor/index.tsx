import { Button, FormLabel, Grid, Input, InputLabel, MenuItem, Select } from "@mui/material";
import PointsDrawer from "components/shared/points-drawer";
import { Animation, AnimationKeyFrame } from "models/components/shared/animation";
import React, { useEffect, useState } from "react";
import { createGuid, mapNumber, numberIsBetweenOrEqual } from "services/shared/math";
import "./index.css";

type Props = {
  animation: Animation | null;
};

export default function AnimationKeyFrameEditor({ animation }: Props) {
  const [timelinePositionMs, setTimelinePositionMs] = useState<number>(0);
  const [selectableStepsIndex, setSelectableStepsIndex] = useState<number>(0);
  let maxRange = 0;
  const [selectedKeyFrameUuid, setSelectedKeyFrameUuid] = useState<string>("");
  const [scale, setScale] = useState<number>(0);
  const [xOffset, setXOffset] = useState<number>(0);
  const [yOffset, setYOffset] = useState<number>(0);
  const [rotation, setRotation] = useState<number>(0);
  const selectableSteps = [1, 10, 100, 1000];
  const keyFramesPropertiesPosition = [
    { property: "scale", yPosition: 80 },
    { property: "xOffset", yPosition: 220 },
    { property: "yOffset", yPosition: 360 },
    { property: "rotation", yPosition: 500 },
  ];

  // TODO remove test code
  if (animation !== null) {
    animation.animationKeyFrames = [
      { uuid: "f38dbe41-8e97-4150-ae7c-3a57f17e36ef", timeMs: 500, propertyEdited: "scale", propertyValue: 0.8 },
      { uuid: "4c299c26-1398-4b82-a709-74a56a9dffa3", timeMs: 499, propertyEdited: "scale", propertyValue: 0.6 },
      { uuid: "1a672ae3-68eb-492b-8481-4649d37c885b", timeMs: 499, propertyEdited: "xOffset", propertyValue: 0 },
      { uuid: "a0f9a978-a4ed-401a-9f10-fd5568c8e128", timeMs: 500, propertyEdited: "xOffset", propertyValue: 20 },
      { uuid: "81ab7872-b421-470e-a95f-49c72400824f", timeMs: 499, propertyEdited: "yOffset", propertyValue: 20 },
      { uuid: "cd356410-79df-4910-bf3f-d1d4afab8843", timeMs: 500, propertyEdited: "yOffset", propertyValue: 50 },
      { uuid: "63121cac-ccaa-4757-a07d-7f6222048173", timeMs: 499, propertyEdited: "rotation", propertyValue: 20 },
      { uuid: "e4ba69b6-bdd8-4a2d-8c33-601de0ca50a2", timeMs: 500, propertyEdited: "rotation", propertyValue: 50 },
    ];
  }
  // end of test code

  useEffect(() => {
    drawTimelineOnCanvas();
  }, [selectableStepsIndex, timelinePositionMs]);

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

  const getClickPosition = (event: any) => {
    const canvas = document.getElementById("svg-keyframe-canvas") as HTMLCanvasElement;
    const rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    if (x < 85) {
      x = 85;
    }

    const mappedX: number = mapNumber(x, 80, 650, timelinePositionMs, maxRange) | 0;
    const y = event.clientY - rect.top;
    const propertyClicked = keyFramesPropertiesPosition.find((p) =>
      numberIsBetweenOrEqual(y, p.yPosition - 20, p.yPosition + 20)
    );

    if (propertyClicked === undefined) {
      return;
    }

    const selectedKeyFrame = animation?.animationKeyFrames.find((keyFrame) => {
      const min = (mappedX - selectableSteps[selectableStepsIndex] / 5 - 1) | 0;
      const thisKeyFrameIsClicked =
        keyFrame.timeMs >= min && keyFrame.timeMs === mappedX && keyFrame.propertyEdited === propertyClicked.property;
      return thisKeyFrameIsClicked;
    });

    if (selectedKeyFrame === undefined) {
      return;
    }

    setSelectedKeyFrameUuid(selectedKeyFrame.uuid);

    switch (selectedKeyFrame?.propertyEdited) {
      case "scale":
        setScale(Number(selectedKeyFrame.propertyValue));
        break;
      case "xOffset":
        setXOffset(Number(selectedKeyFrame.propertyValue));
        break;
      case "yOffset":
        setYOffset(Number(selectedKeyFrame.propertyValue));
        break;
      case "rotation":
        setRotation(Number(selectedKeyFrame.propertyValue));
        break;
    }
  };

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
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    drawLine(mouseXPosition, 0, mouseXPosition, 650, ctx);
    ctx.beginPath();
    ctx.font = "12px sans-serif";
    ctx.fillStyle = "whitesmoke";
    ctx.fillText(mappedX.toString() + " x", mouseXPosition, mouseYPosition);
  };

  const onMouseScroll = (e: any) => {
    const scrollDown = e.deltaY > 0;
    if (scrollDown && selectableStepsIndex < selectableSteps.length - 1) {
      setSelectableStepsIndex(selectableStepsIndex + 1);
    } else if (!scrollDown && selectableStepsIndex > 0) {
      setSelectableStepsIndex(selectableStepsIndex - 1);
    }

    const canvas = document.getElementById("svg-keyframe-canvas") as HTMLCanvasElement;
    const rect = canvas.getBoundingClientRect();
    const mouseXPosition = e.clientX - rect.left;
    if (mouseXPosition < 80 || selectableStepsIndex === 0 || selectableStepsIndex === selectableSteps.length - 1) {
      return;
    }

    const mappedX: number =
      mapNumber(mouseXPosition, 80, 650, timelinePositionMs / selectableSteps[selectableStepsIndex], maxRange) | 0;
    setTimelinePositionMs(mappedX);
  };

  return (
    <Grid container direction="row" spacing={2}>
      <Grid item xs={2}>
        <FormLabel htmlFor="animation-scale">
          Scale
          <Button
            style={{ marginLeft: "10px" }}
            onClick={() => (window.confirm("Are you sure you want to remove this keyframe?") ? null : null)}
          >
            Remove
          </Button>
        </FormLabel>
        <br />
        <Input
          id="animation-scale"
          type="number"
          inputProps={{ min: 0.1, max: 10, step: 0.1 }}
          value={scale}
          onChange={(e) => setScale(Number(e.target.value))}
        />
        <br />
        <div style={{ marginTop: "90px" }}>
          <FormLabel htmlFor="animation-xoffset">
            X offset
            <Button
              style={{ marginLeft: "10px" }}
              onClick={() => (window.confirm("Are you sure you want to remove this keyframe?") ? null : null)}
            >
              Remove
            </Button>
          </FormLabel>
          <br />
          <Input
            id="animation-xoffset"
            type="number"
            inputProps={{ min: -200, max: 200 }}
            value={xOffset}
            onChange={(e) => setXOffset(Number(e.target.value))}
          />
        </div>
        <br />
        <div style={{ marginTop: "50px" }}>
          <FormLabel htmlFor="animation-yoffset">
            Y offset
            <Button
              style={{ marginLeft: "10px" }}
              onClick={() => (window.confirm("Are you sure you want to remove this keyframe?") ? null : null)}
            >
              Remove
            </Button>
          </FormLabel>
          <br />
          <Input
            id="animation-yoffset"
            type="number"
            inputProps={{ min: -200, max: 200 }}
            value={yOffset}
            onChange={(e) => setYOffset(Number(e.target.value))}
          />
        </div>
        <div style={{ marginTop: "70px" }}>
          <FormLabel htmlFor="animation-rotation">
            Rotation
            <Button
              style={{ marginLeft: "10px" }}
              onClick={() => (window.confirm("Are you sure you want to remove this keyframe?") ? null : null)}
            >
              Remove
            </Button>
          </FormLabel>
          <br />
          <Input
            id="animation-rotation"
            type="number"
            inputProps={{ min: -360, max: 360 }}
            value={rotation}
            onChange={(e) => setRotation(Number(e.target.value))}
          />
        </div>
      </Grid>
      <Grid item xs>
        <canvas
          id="svg-keyframe-canvas"
          onClick={(e) => getClickPosition(e)}
          onMouseMove={showMouseXAxis}
          onMouseLeave={() => drawTimelineOnCanvas()}
          onWheel={onMouseScroll}
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
