import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  IconButton,
  Input,
  InputLabel,
  List,
  ListItemButton,
  ListItemText,
  MenuItem,
  Select,
  Tooltip,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { Animation, AnimationProperty } from "models/components/shared/animation";
import {
  SelectedAnimationContext,
  SelectedAnimationContextType,
  SelectedAnimationPatternContext,
  SelectedAnimationPatternContextType,
  SelectedAnimationPatternIndexContext,
} from "pages/animation-editor";
import React from "react";
import { numberOfTimeLines } from "services/shared/config";
import PropertyControl from "components/shared/property-control";
import { getAnimationPropertyColor } from "services/logic/animation-logic";
import {
  AnimationSelectedKeyFrameContext,
  AnimationSelectedKeyFrameContextType,
  AnimationTimeLineContextType,
  AnimationTimeLinePositionContext,
} from "..";

export type AnimationPatternProps = {
  updatePatternProperty: (propertyName: string, value: unknown) => void;
  deleteKeyframe: (property: string) => void;
};

export default function AnimationPatternProperties({
  updatePatternProperty,
  deleteKeyframe,
}: AnimationPatternProps) {
  const { selectedAnimation, setSelectedAnimation } = React.useContext(
    SelectedAnimationContext,
  ) as SelectedAnimationContextType;
  const { selectedAnimationPattern } = React.useContext(
    SelectedAnimationPatternContext,
  ) as SelectedAnimationPatternContextType;
  const { setTimelinePositionMs } = React.useContext(
    AnimationTimeLinePositionContext,
  ) as AnimationTimeLineContextType;
  const { selectedKeyFrameUuid, setSelectedKeyFrameUuid } = React.useContext(
    AnimationSelectedKeyFrameContext,
  ) as AnimationSelectedKeyFrameContextType;

  const selectedAnimationPatternIndex = React.useContext(SelectedAnimationPatternIndexContext);

  const selectedKeyFrame = selectedAnimationPattern?.animationPatternKeyFrames?.find(
    (kf) => kf.uuid === selectedKeyFrameUuid,
  );
  const uiComponentsAreDisabled = selectedAnimationPattern === null;

  const updateKeyframeProperty = (value: number) => {
    const selectedKeyFrameIndex = selectedAnimationPattern?.animationPatternKeyFrames.findIndex(
      (kf) => kf.uuid === selectedKeyFrameUuid,
    );
    if (selectedAnimation === null) {
      return;
    }

    const updatedAnimation: Animation = { ...selectedAnimation };
    if (
      updatedAnimation === undefined ||
      selectedKeyFrameIndex === undefined ||
      updatedAnimation?.animationPatterns === undefined ||
      selectedAnimationPattern?.animationPatternKeyFrames[selectedKeyFrameIndex] === undefined
    ) {
      return;
    }

    updatedAnimation.animationPatterns[selectedAnimationPatternIndex].animationPatternKeyFrames[
      selectedKeyFrameIndex
    ].propertyValue = value;
    setSelectedAnimation(updatedAnimation);
  };

  const getPropertyValue = (property: string) => {
    const selectedKeyFrame = selectedAnimationPattern?.animationPatternKeyFrames.find(
      (kf) => kf.uuid === selectedKeyFrameUuid && kf.propertyEdited === property,
    );

    return selectedKeyFrame?.propertyValue;
  };

  const getNextOrPreviousKeyframe = (getPrevious: boolean, property: string) => {
    const currentSelectedKeyFrame = selectedAnimationPattern?.animationPatternKeyFrames.find(
      (ak) => ak.uuid === selectedKeyFrameUuid,
    );
    if (currentSelectedKeyFrame === undefined) {
      onGetNextOrPreviousKeyframeError(property);
      return;
    }

    const keyFrames = selectedAnimationPattern?.animationPatternKeyFrames
      .filter((ak: { propertyEdited: string; timeMs: number }) => {
        const propertyIsTheSame = ak.propertyEdited === property;
        const isBelowOrUnderCurrentSelectedKeyFrame = getPrevious
          ? ak.timeMs <= currentSelectedKeyFrame?.timeMs
          : ak.timeMs >= currentSelectedKeyFrame?.timeMs;

        return propertyIsTheSame && isBelowOrUnderCurrentSelectedKeyFrame;
      })
      .sort((a: { timeMs: number }, b: { timeMs: number }) => a.timeMs - b.timeMs);

    if (keyFrames === undefined) {
      return;
    }

    const currentPositionInArray = keyFrames?.findIndex(
      (ak) => ak.uuid === currentSelectedKeyFrame.uuid,
    );
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

    keyFrame = getPrevious
      ? keyFrames[currentPositionInArray - 1]
      : keyFrames[currentPositionInArray + 1];
    if (keyFrame === undefined) {
      onGetNextOrPreviousKeyframeError(property);
      return;
    }

    setTimelinePositionMs(keyFrame?.timeMs + (selectedAnimationPattern?.startTimeMs ?? 0));
    setSelectedKeyFrameUuid(keyFrame.uuid);
  };

  const getLastKeyframe = (property: string, currentSelectedKeyFrameTimeMs: number) => {
    const keyFrames = selectedAnimationPattern?.animationPatternKeyFrames
      .filter((ak: { propertyEdited: string; timeMs: number }) => {
        const propertyIsTheSame = ak.propertyEdited === property;
        const isOverCurrentSelectedKeyFrame = ak.timeMs >= currentSelectedKeyFrameTimeMs;
        return propertyIsTheSame && isOverCurrentSelectedKeyFrame;
      })
      .sort((a: { timeMs: number }, b: { timeMs: number }) => a.timeMs - b.timeMs);

    if (keyFrames === undefined) {
      return;
    }

    if (keyFrames[keyFrames.length - 1] === undefined) {
      return;
    }

    const keyFrame = keyFrames[keyFrames.length - 1];
    setTimelinePositionMs(keyFrame?.timeMs + (selectedAnimationPattern?.startTimeMs ?? 0));
    setSelectedKeyFrameUuid(keyFrame.uuid);
  };

  const onGetNextOrPreviousKeyframeError = (property: string) => {
    const kf = selectedAnimationPattern?.animationPatternKeyFrames
      .filter((ak: { propertyEdited: string }) => ak.propertyEdited === property)
      .sort((a: { timeMs: number }, b: { timeMs: number }) => a.timeMs - b.timeMs)
      .at(0);
    if (kf === undefined) {
      return;
    }

    setTimelinePositionMs(kf?.timeMs + (selectedAnimationPattern?.startTimeMs ?? 0));
    setSelectedKeyFrameUuid(kf.uuid);
  };

  const nextKeyFrameButton = (property: string) => (
    <span style={{ marginLeft: "2px" }}>
      <Tooltip title={`Previous ${property} keyframe`}>
        <span>
          <IconButton
            disabled={uiComponentsAreDisabled}
            onClick={() => getNextOrPreviousKeyframe(true, property)}
          >
            <NavigateBeforeIcon fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip title={`Next ${property} keyframe`}>
        <span>
          <IconButton
            disabled={uiComponentsAreDisabled}
            onClick={() => getNextOrPreviousKeyframe(false, property)}
          >
            <NavigateNextIcon fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip title={`Delete ${property} keyframe`}>
        <span>
          <IconButton
            disabled={uiComponentsAreDisabled || selectedKeyFrame?.propertyEdited !== property}
            onClick={() => deleteKeyframe(property)}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>
    </span>
  );

  const getTimelineMenuItems = () => {
    const items = [];
    for (let i = 0; i < numberOfTimeLines; i++) {
      items.push(
        <MenuItem
          key={`${i}-menu-items`}
          selected={(selectedAnimationPattern?.timelineId ?? 0) === i}
          value={i}
        >
          {i + 1}
        </MenuItem>,
      );
    }

    return items;
  };

  const labelStyle = { marginBottom: "-11px", marginTop: "2.5px" };
  return selectedAnimationPattern !== null ? (
    <>
      <InputLabel
        shrink
        style={{ marginBottom: labelStyle.marginBottom }}
        size="small"
        htmlFor="animation-name"
      >
        Name
      </InputLabel>
      <Input
        size="small"
        id="animation-name"
        inputProps={{ maxLength: 25 }}
        value={selectedAnimationPattern?.name}
        onChange={(e) => updatePatternProperty("name", e.target.value)}
      />

      <PropertyControl
        label="Scale"
        id="animation-scale"
        dense
        value={getPropertyValue(AnimationProperty.scale)}
        onChange={(value) => updateKeyframeProperty(value)}
        min={0.1}
        max={10}
        step={0.1}
        showSlider
        disabled={
          selectedKeyFrame?.propertyEdited !== AnimationProperty.scale || uiComponentsAreDisabled
        }
        endAdornment={nextKeyFrameButton(AnimationProperty.scale)}
      />

      <PropertyControl
        label="X offset"
        id="animation-xoffset"
        dense
        value={getPropertyValue(AnimationProperty.xOffset)}
        onChange={(value) => updateKeyframeProperty(value)}
        min={-4000}
        max={4000}
        showSlider
        disabled={
          selectedKeyFrame?.propertyEdited !== AnimationProperty.xOffset || uiComponentsAreDisabled
        }
        endAdornment={nextKeyFrameButton(AnimationProperty.xOffset)}
      />

      <PropertyControl
        label="Y offset"
        id="animation-yoffset"
        dense
        value={getPropertyValue(AnimationProperty.yOffset)}
        onChange={(value) => updateKeyframeProperty(value)}
        min={-4000}
        max={4000}
        showSlider
        disabled={
          selectedKeyFrame?.propertyEdited !== AnimationProperty.yOffset || uiComponentsAreDisabled
        }
        endAdornment={nextKeyFrameButton(AnimationProperty.yOffset)}
      />

      <PropertyControl
        label="Rotation"
        id="animation-rotation"
        dense
        value={getPropertyValue(AnimationProperty.rotation)}
        onChange={(value) => updateKeyframeProperty(value)}
        min={-360}
        max={360}
        showSlider
        disabled={
          selectedKeyFrame?.propertyEdited !== AnimationProperty.rotation || uiComponentsAreDisabled
        }
        endAdornment={nextKeyFrameButton(AnimationProperty.rotation)}
      />

      <InputLabel shrink style={labelStyle} size="small" htmlFor="animation-starttime">
        Starttime in Ms
      </InputLabel>
      <Input
        size="small"
        id="animation-starttime"
        type="number"
        inputProps={{ min: 0, max: 100000000, step: "10" }}
        value={selectedAnimationPattern?.startTimeMs}
        onChange={(e) => updatePatternProperty("startTimeMs", Number(e.target.value))}
      />
      <InputLabel shrink style={labelStyle} id="properties-timeline-id">
        Timeline id
      </InputLabel>
      <Select
        size="small"
        labelId="properties-timeline-id"
        value={selectedAnimationPattern?.timelineId}
        label="Timeline id"
        onChange={(e) => updatePatternProperty("timelineId", Number(e.target.value))}
      >
        {getTimelineMenuItems()}
      </Select>
      <div style={{ maxHeight: "150px", overflowY: "auto" }}>
        <Accordion disabled={uiComponentsAreDisabled}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <small>
              All keyframes ({selectedAnimationPattern?.animationPatternKeyFrames?.length ?? 0})
            </small>
          </AccordionSummary>
          <AccordionDetails>
            <List dense={true}>
              {selectedAnimationPattern?.animationPatternKeyFrames
                .sort((a, b) => a.timeMs - b.timeMs)
                ?.map((keyFrame) => (
                  <ListItemButton
                    key={`${keyFrame.uuid}-points`}
                    onClick={() => {
                      setTimelinePositionMs(keyFrame.timeMs + selectedAnimationPattern.startTimeMs);
                      setSelectedKeyFrameUuid(keyFrame.uuid);
                    }}
                  >
                    <span
                      style={{
                        width: "10px",
                        height: "10px",
                        borderRadius: "50%",
                        marginRight: "8px",
                        flexShrink: 0,
                        backgroundColor: getAnimationPropertyColor(keyFrame.propertyEdited),
                      }}
                    />
                    <ListItemText
                      primary={`${keyFrame.propertyEdited}: ${keyFrame.propertyValue}`}
                      secondary={`${keyFrame.timeMs} ms`}
                    />
                  </ListItemButton>
                ))}
            </List>
          </AccordionDetails>
        </Accordion>
      </div>
    </>
  ) : (
    <Alert severity="info">Select an animation pattern by clicking it in the timeline</Alert>
  );
}
