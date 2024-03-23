import {
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
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";

import React from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import { numberOfTimeLines, xCorrection } from "services/shared/config";
import {
  AnimationSelectableStepsIndexContext,
  AnimationSelectableStepsIndexContextType,
  AnimationSelectedKeyFrameContext,
  AnimationSelectedKeyFrameContextType,
  AnimationTimeLineContextType,
  AnimationTimeLinePositionContext,
} from "..";
import {
  SelectedAnimationContext,
  SelectedAnimationContextType,
  SelectedAnimationPatternContext,
  SelectedAnimationPatternContextType,
  SelectedAnimationPatternIndexContext,
} from "pages/animation-editor";
import { Animation } from "models/components/shared/animation";

export default function AnimationPatternProperties() {
  const { selectedAnimation, setSelectedAnimation } = React.useContext(
    SelectedAnimationContext
  ) as SelectedAnimationContextType;
  const { selectedAnimationPattern, setSelectedAnimationPattern } = React.useContext(
    SelectedAnimationPatternContext
  ) as SelectedAnimationPatternContextType;
  const { timelinePositionMs, setTimelinePositionMs } = React.useContext(
    AnimationTimeLinePositionContext
  ) as AnimationTimeLineContextType;
  const { selectableStepsIndex, setSelectableStepsIndex } = React.useContext(
    AnimationSelectableStepsIndexContext
  ) as AnimationSelectableStepsIndexContextType;
  const { selectedKeyFrameUuid, setSelectedKeyFrameUuid } = React.useContext(
    AnimationSelectedKeyFrameContext
  ) as AnimationSelectedKeyFrameContextType;

  const selectedAnimationPatternIndex = React.useContext(SelectedAnimationPatternIndexContext);

  const selectedKeyFrame = selectedAnimationPattern?.animationPatternKeyFrames?.find(
    (kf: { uuid: any }) => kf.uuid === selectedKeyFrameUuid
  );
  const uiComponentsAreDisabled = selectedAnimationPattern === null;

  const updateKeyframeProperty = (value: number) => {
    const selectedKeyFrameIndex = selectedAnimationPattern?.animationPatternKeyFrames.findIndex(
      (kf: { uuid: any }) => kf.uuid === selectedKeyFrameUuid
    );
    if (selectedAnimation === null) {
      return;
    }

    let updatedAnimation: Animation = { ...selectedAnimation };
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
      (kf: { uuid: any; propertyEdited: string }) =>
        kf.uuid === selectedKeyFrameUuid && kf.propertyEdited.toLocaleLowerCase() === property.toLocaleLowerCase()
    );

    return selectedKeyFrame?.propertyValue;
  };

  const getNextOrPreviousKeyframe = (getPrevious: boolean, property: string) => {
    const currentSelectedKeyFrame = selectedAnimationPattern?.animationPatternKeyFrames.find(
      (ak: { uuid: any }) => ak.uuid === selectedKeyFrameUuid
    );
    if (currentSelectedKeyFrame === undefined) {
      onGetNextOrPreviousKeyframeError(property);
      return;
    }

    const keyFrames = selectedAnimationPattern?.animationPatternKeyFrames
      .filter((ak: { propertyEdited: string; timeMs: number }) => {
        const propertyIsTheSame = ak.propertyEdited.toLocaleLowerCase() === property.toLocaleLowerCase();
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
      (ak: { uuid: any }) => ak.uuid === currentSelectedKeyFrame.uuid
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

    keyFrame = getPrevious ? keyFrames[currentPositionInArray - 1] : keyFrames[currentPositionInArray + 1];
    if (keyFrame === undefined) {
      onGetNextOrPreviousKeyframeError(property);
      return;
    }

    setTimelinePositionMs(keyFrame?.timeMs);
    setSelectedKeyFrameUuid(keyFrame.uuid);
  };

  const getLastKeyframe = (property: string, currentSelectedKeyFrameTimeMs: number) => {
    const keyFrames = selectedAnimationPattern?.animationPatternKeyFrames
      .filter((ak: { propertyEdited: string; timeMs: number }) => {
        const propertyIsTheSame = ak.propertyEdited.toLocaleLowerCase() === property.toLocaleLowerCase();
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
    setTimelinePositionMs(keyFrame?.timeMs);
    setSelectedKeyFrameUuid(keyFrame.uuid);
  };

  const onGetNextOrPreviousKeyframeError = (property: string) => {
    const kf = selectedAnimationPattern?.animationPatternKeyFrames
      .filter(
        (ak: { propertyEdited: string }) => ak.propertyEdited.toLocaleLowerCase() === property.toLocaleLowerCase()
      )
      .sort((a: { timeMs: number }, b: { timeMs: number }) => a.timeMs - b.timeMs)
      .at(0);
    if (kf === undefined) {
      return;
    }
    setTimelinePositionMs(kf?.timeMs);
    setSelectedKeyFrameUuid(kf.uuid);
  };

  const nextKeyFrameButton = (property: string) => (
    <span style={{ marginLeft: "2px" }}>
      <Tooltip title={`Previous ${property} keyframe`}>
        <span>
          <IconButton disabled={uiComponentsAreDisabled} onClick={() => getNextOrPreviousKeyframe(true, property)}>
            <NavigateBeforeIcon fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip title={`Next ${property} keyframe`}>
        <span>
          <IconButton disabled={uiComponentsAreDisabled} onClick={() => getNextOrPreviousKeyframe(false, property)}>
            <NavigateNextIcon fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>
    </span>
  );

  const updatePatternProperty = (propertyName: string, value: any) => {
    if (selectedAnimation?.animationPatterns === undefined) {
      return;
    }

    let updatedAnimation: any = { ...selectedAnimation };
    updatedAnimation.animationPatterns[selectedAnimationPatternIndex][propertyName] = value;
    setSelectedAnimation(updatedAnimation);
  };

  const getTimelineMenuItems = () => {
    let items = [];
    for (let i = 0; i < numberOfTimeLines; i++) {
      items.push(
        <MenuItem key={`${i}-menu-items`} selected={(selectedAnimationPattern?.timelineId ?? 0) === i} value={i}>
          {i + 1}
        </MenuItem>
      );
    }

    return items;
  };

  const labelStyle = { marginBottom: "-11px", marginTop: "2.5px" };
  return (
    <>
      <InputLabel shrink style={{ marginBottom: labelStyle.marginBottom }} size="small" htmlFor="animation-name">
        Name
      </InputLabel>
      <Input
        size="small"
        id="animation-name"
        inputProps={{ maxLength: 25 }}
        value={selectedAnimationPattern?.name}
        onChange={(e) => updatePatternProperty("name", e.target.value)}
      />

      <InputLabel shrink style={labelStyle} size="small" htmlFor="animation-scale">
        Scale
      </InputLabel>
      <Input
        size="small"
        id="animation-scale"
        type="number"
        inputProps={{ min: 0.1, max: 10, step: 0.1 }}
        value={getPropertyValue("scale")}
        onChange={(e) => updateKeyframeProperty(Number(e.target.value))}
        disabled={selectedKeyFrame?.propertyEdited.toLocaleLowerCase() !== "scale" || uiComponentsAreDisabled}
      />
      {nextKeyFrameButton("scale")}

      <InputLabel shrink style={labelStyle} size="small" htmlFor="animation-xoffset">
        X offset
      </InputLabel>
      <Input
        size="small"
        id="animation-xoffset"
        type="number"
        inputProps={{ min: -4000, max: 4000 }}
        value={getPropertyValue("xOffset")}
        onChange={(e) => updateKeyframeProperty(Number(e.target.value))}
        disabled={selectedKeyFrame?.propertyEdited.toLocaleLowerCase() !== "xOffset" || uiComponentsAreDisabled}
      />
      {nextKeyFrameButton("xOffset")}

      <InputLabel shrink style={labelStyle} size="small" htmlFor="animation-yoffset">
        Y offset
      </InputLabel>
      <Input
        size="small"
        id="animation-yoffset"
        type="number"
        inputProps={{ min: -4000, max: 4000 }}
        value={getPropertyValue("yOffset")}
        onChange={(e) => updateKeyframeProperty(Number(e.target.value))}
        disabled={selectedKeyFrame?.propertyEdited.toLocaleLowerCase() !== "yOffset" || uiComponentsAreDisabled}
      />
      {nextKeyFrameButton("yOffset")}

      <InputLabel shrink style={labelStyle} size="small" htmlFor="animation-rotation">
        Rotation
      </InputLabel>
      <Input
        size="small"
        id="animation-rotation"
        type="number"
        inputProps={{ min: -360, max: 360 }}
        value={getPropertyValue("rotation")}
        onChange={(e) => updateKeyframeProperty(Number(e.target.value))}
        disabled={selectedKeyFrame?.propertyEdited.toLocaleLowerCase() !== "rotation" || uiComponentsAreDisabled}
      />
      {nextKeyFrameButton("rotation")}

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
            <small>All keyframes ({selectedAnimationPattern?.animationPatternKeyFrames?.length ?? 0})</small>
          </AccordionSummary>
          <AccordionDetails>
            <List dense={true}>
              {selectedAnimationPattern?.animationPatternKeyFrames
                .sort((a, b) => a.timeMs - b.timeMs)
                ?.map((keyFrame: { uuid: any; timeMs: number; propertyEdited: any; propertyValue: any }) => (
                  <ListItemButton
                    key={`${keyFrame.uuid}-points`}
                    onClick={() => {
                      setTimelinePositionMs(keyFrame.timeMs - xCorrection[selectableStepsIndex]);
                      setSelectedKeyFrameUuid(keyFrame.uuid);
                    }}
                  >
                    <ListItemText
                      primary={`${keyFrame.propertyEdited.toLocaleLowerCase()}: ${keyFrame.propertyValue}`}
                      secondary={`${keyFrame.timeMs} ms`}
                    />
                  </ListItemButton>
                ))}
            </List>
          </AccordionDetails>
        </Accordion>
      </div>
    </>
  );
}
