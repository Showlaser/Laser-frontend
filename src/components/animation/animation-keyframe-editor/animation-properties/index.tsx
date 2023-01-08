import {
  Divider,
  Paper,
  Input,
  FormLabel,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  List,
  ListItemButton,
  ListItemText,
  IconButton,
  Tooltip,
} from "@mui/material";

import React from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Animation, AnimationPattern } from "models/components/shared/animation";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";

type Props = {
  selectedAnimation: Animation | null;
  selectedKeyFrameUuid: string;
  setSelectedKeyFrameUuid: (uuid: string) => void;
  setSelectedAnimation: (animation: Animation) => void;
  setTimelinePositionMs: any;
  xCorrection: number[];
  selectableStepsIndex: number;
  selectedAnimationPattern: AnimationPattern | null;
  setSelectedAnimationPattern: (animationPattern: AnimationPattern | null) => void;
};

export default function AnimationProperties({
  selectedAnimation,
  selectedKeyFrameUuid,
  setSelectedKeyFrameUuid,
  setSelectedAnimation,
  setTimelinePositionMs,
  xCorrection,
  selectableStepsIndex,
  selectedAnimationPattern,
  setSelectedAnimationPattern,
}: Props) {
  const selectedKeyFrame = selectedAnimationPattern?.animationKeyFrames?.find((kf) => kf.uuid === selectedKeyFrameUuid);

  const updateProperty = (value: string | number) => {
    const selectedKeyFrameIndex = selectedAnimationPattern?.animationKeyFrames.findIndex(
      (kf) => kf.uuid === selectedKeyFrameUuid
    );
    let updatedAnimation: any = { ...selectedAnimation };
    if (
      updatedAnimation === undefined ||
      selectedKeyFrameIndex === undefined ||
      updatedAnimation?.animationKeyFrames === undefined ||
      updatedAnimation.animationKeyFrames[selectedKeyFrameIndex] === undefined
    ) {
      return;
    }

    updatedAnimation.animationKeyFrames[selectedKeyFrameIndex].propertyValue = value;
    setSelectedAnimation(updatedAnimation);
  };

  const getPropertyValue = (property: string) => {
    const selectedKeyFrame = selectedAnimationPattern?.animationKeyFrames.find(
      (kf) => kf.uuid === selectedKeyFrameUuid && kf.propertyEdited === property
    );

    return selectedKeyFrame?.propertyValue;
  };

  const onRemove = () => {
    if (selectedKeyFrameUuid === "") {
      return;
    }

    setSelectedKeyFrameUuid("");
    let updatedAnimation: any = { ...selectedAnimation };
    const selectedKeyFrameIndex = selectedAnimationPattern?.animationKeyFrames.findIndex(
      (kf) => kf.uuid === selectedKeyFrameUuid
    );
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

  const getNextOrPreviousKeyframe = (getPrevious: boolean, property: string) => {
    const currentSelectedKeyFrame = selectedAnimationPattern?.animationKeyFrames.find(
      (ak) => ak.uuid === selectedKeyFrameUuid
    );
    if (currentSelectedKeyFrame === undefined) {
      onGetNextOrPreviousKeyframeError(property);
      return;
    }

    const keyFrames = selectedAnimationPattern?.animationKeyFrames
      .filter((ak) => {
        const propertyIsTheSame = ak.propertyEdited === property;
        const isBelowOrUnderCurrentSelectedKeyFrame = getPrevious
          ? ak.timeMs <= currentSelectedKeyFrame?.timeMs ?? 0
          : ak.timeMs >= currentSelectedKeyFrame?.timeMs ?? 0;

        return propertyIsTheSame && isBelowOrUnderCurrentSelectedKeyFrame;
      })
      .sort((a, b) => a.timeMs - b.timeMs);

    if (keyFrames === undefined) {
      return;
    }

    const currentPositionInArray = keyFrames?.findIndex((ak) => ak.uuid === currentSelectedKeyFrame.uuid);
    if (currentPositionInArray === -1) {
      onGetNextOrPreviousKeyframeError(property);
      return;
    }

    if (currentPositionInArray === 0 && getPrevious) {
      getLastKeyframe(property, currentSelectedKeyFrame.timeMs);
      return;
    }

    let keyFrame = keyFrames[0];
    if (keyFrame?.timeMs === undefined) {
      onGetNextOrPreviousKeyframeError(property);
      return;
    }

    keyFrame = getPrevious ? keyFrames[currentPositionInArray - 1] : keyFrames[currentPositionInArray + 1];
    if (keyFrame === undefined) {
      onGetNextOrPreviousKeyframeError(property);
      return;
    }

    setTimelinePositionMs(keyFrame?.timeMs - xCorrection[selectableStepsIndex]);
    setSelectedKeyFrameUuid(keyFrame.uuid);
  };

  const getLastKeyframe = (property: string, currentSelectedKeyFrameTimeMs: number) => {
    const keyFrames = selectedAnimationPattern?.animationKeyFrames
      .filter((ak) => {
        const propertyIsTheSame = ak.propertyEdited === property;
        const isOverCurrentSelectedKeyFrame = ak.timeMs >= currentSelectedKeyFrameTimeMs ?? 0;
        return propertyIsTheSame && isOverCurrentSelectedKeyFrame;
      })
      .sort((a, b) => a.timeMs - b.timeMs);

    if (keyFrames === undefined) {
      return;
    }

    if (keyFrames[keyFrames.length - 1] === undefined) {
      return;
    }

    const keyFrame = keyFrames[keyFrames.length - 1];
    setTimelinePositionMs(keyFrame?.timeMs - xCorrection[selectableStepsIndex]);
    setSelectedKeyFrameUuid(keyFrame.uuid);
  };

  const onGetNextOrPreviousKeyframeError = (property: string) => {
    const kf = selectedAnimationPattern?.animationKeyFrames
      .filter((ak) => ak.propertyEdited === property)
      .sort((a, b) => a.timeMs - b.timeMs)
      .at(0);
    if (kf === undefined) {
      return;
    }
    setTimelinePositionMs(kf?.timeMs - xCorrection[selectableStepsIndex]);
    setSelectedKeyFrameUuid(kf.uuid);
  };

  const nextKeyFrameButton = (property: string) => (
    <span style={{ marginLeft: "5px" }}>
      <Tooltip title={`Previous ${property} keyframe`}>
        <IconButton onClick={() => getNextOrPreviousKeyframe(true, property)}>
          <NavigateBeforeIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title={`Next ${property} keyframe`}>
        <IconButton onClick={() => getNextOrPreviousKeyframe(false, property)}>
          <NavigateNextIcon />
        </IconButton>
      </Tooltip>
    </span>
  );

  return (
    <>
      <Paper
        style={{ padding: "15px", paddingTop: "2px" }}
        key={`${selectedAnimationPattern?.pattern.scale}-${selectedAnimationPattern?.pattern.xOffset}-${selectedAnimationPattern?.pattern.yOffset}-${selectedAnimationPattern?.pattern.rotation}`}
      >
        <p>Animation properties</p>
        <Divider style={{ marginBottom: "10px" }} />
        <FormLabel htmlFor="animation-scale">Scale</FormLabel>
        <br />
        <Input
          id="animation-scale"
          type="number"
          inputProps={{ min: 0.1, max: 10, step: 0.1 }}
          defaultValue={getPropertyValue("scale")}
          onChange={(e) => updateProperty(Number(e.target.value))}
          disabled={selectedKeyFrame?.propertyEdited !== "scale"}
        />
        {nextKeyFrameButton("scale")}
        <br />
        <div style={{ marginTop: "60px" }}>
          <FormLabel htmlFor="animation-xoffset">X offset</FormLabel>
          <br />
          <Input
            id="animation-xoffset"
            type="number"
            inputProps={{ min: -4000, max: 4000 }}
            defaultValue={getPropertyValue("xOffset")}
            onChange={(e) => updateProperty(Number(e.target.value))}
            disabled={selectedKeyFrame?.propertyEdited !== "xOffset"}
          />
          {nextKeyFrameButton("xOffset")}
        </div>
        <br />
        <div style={{ marginTop: "60px" }}>
          <FormLabel htmlFor="animation-yoffset">Y offset</FormLabel>
          <br />
          <Input
            id="animation-yoffset"
            type="number"
            inputProps={{ min: -4000, max: 4000 }}
            defaultValue={getPropertyValue("yOffset")}
            onChange={(e) => updateProperty(Number(e.target.value))}
            disabled={selectedKeyFrame?.propertyEdited !== "yOffset"}
          />
          {nextKeyFrameButton("yOffset")}
        </div>
        <div style={{ marginTop: "70px" }}>
          <FormLabel htmlFor="animation-rotation">Rotation</FormLabel>
          <br />
          <Input
            id="animation-rotation"
            type="number"
            inputProps={{ min: -360, max: 360 }}
            defaultValue={getPropertyValue("rotation")}
            onChange={(e) => updateProperty(Number(e.target.value))}
            disabled={selectedKeyFrame?.propertyEdited !== "rotation"}
          />
          {nextKeyFrameButton("rotation")}
        </div>
        <br />
        <Divider />
        <Tooltip title="Remove keyframe" placement="right">
          <span>
            <IconButton
              disabled={selectedKeyFrameUuid === ""}
              style={{ marginLeft: "10px" }}
              onClick={() => (window.confirm("Are you sure you want to remove this keyframe?") ? onRemove() : null)}
            >
              <DeleteIcon />
            </IconButton>
          </span>
        </Tooltip>
      </Paper>
      <br />
      <Paper style={{ padding: "15px", paddingTop: "2px" }}>
        <p>Animation info</p>
        <Divider />
        <small>
          Animation duration:{" "}
          {Math.max(...(selectedAnimationPattern?.animationKeyFrames?.map((ak) => ak?.timeMs) ?? []))}
        </small>
        <br />
        <small>Total keyframes: {selectedAnimationPattern?.animationKeyFrames?.length}</small>
        <div style={{ maxHeight: "200px", overflowY: "auto" }}>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>All points</AccordionSummary>
            <AccordionDetails>
              <List>
                {selectedAnimationPattern?.animationKeyFrames?.map((keyFrame) => (
                  <ListItemButton
                    key={`${keyFrame.uuid}-points`}
                    onClick={() => {
                      setTimelinePositionMs(keyFrame.timeMs - xCorrection[selectableStepsIndex]);
                      setSelectedKeyFrameUuid(keyFrame.uuid);
                    }}
                  >
                    <ListItemText
                      primary={`Time ms: ${keyFrame.timeMs}`}
                      secondary={`${keyFrame.propertyEdited}: ${keyFrame.propertyValue}`}
                    />
                  </ListItemButton>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
        </div>
      </Paper>
    </>
  );
}
