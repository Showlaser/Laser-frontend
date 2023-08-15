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

import React, { ChangeEvent } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import { canvasPxSize } from "services/shared/config";
import {
  PlayAnimationContext,
  PlayAnimationContextType,
  SelectableStepsIndexContext,
  SelectableStepsIndexContextType,
  SelectedKeyFrameContext,
  SelectedKeyFrameContextType,
  TimeLineContextType,
  TimeLinePositionContext,
  XCorrectionContext,
} from "..";
import {
  SelectedAnimationContext,
  SelectedAnimationContextType,
  SelectedAnimationPatternContext,
  SelectedAnimationPatternContextType,
  SelectedAnimationPatternIndexContext,
} from "pages/animation";

export default function AnimationPatternProperties() {
  const { selectedAnimation, setSelectedAnimation } = React.useContext(
    SelectedAnimationContext
  ) as SelectedAnimationContextType;
  const { selectedAnimationPattern, setSelectedAnimationPattern } =
    React.useContext(
      SelectedAnimationPatternContext
    ) as SelectedAnimationPatternContextType;
  const xCorrection = React.useContext(XCorrectionContext);
  const { timelinePositionMs, setTimelinePositionMs } = React.useContext(
    TimeLinePositionContext
  ) as TimeLineContextType;
  const { selectableStepsIndex, setSelectableStepsIndex } = React.useContext(
    SelectableStepsIndexContext
  ) as SelectableStepsIndexContextType;
  const { selectedKeyFrameUuid, setSelectedKeyFrameUuid } = React.useContext(
    SelectedKeyFrameContext
  ) as SelectedKeyFrameContextType;
  const { playAnimation, setPlayAnimation } = React.useContext(
    PlayAnimationContext
  ) as PlayAnimationContextType;

  const selectedAnimationPatternIndex = React.useContext(
    SelectedAnimationPatternIndexContext
  );

  const selectedKeyFrame = selectedAnimationPattern?.animationKeyFrames?.find(
    (kf: { uuid: any }) => kf.uuid === selectedKeyFrameUuid
  );
  const uiComponentsAreDisabled = selectedAnimationPattern === null;

  const updateProperty = (value: string | number) => {
    const selectedKeyFrameIndex =
      selectedAnimationPattern?.animationKeyFrames.findIndex(
        (kf: { uuid: any }) => kf.uuid === selectedKeyFrameUuid
      );
    let updatedAnimation: any = { ...selectedAnimation };
    if (
      updatedAnimation === undefined ||
      selectedKeyFrameIndex === undefined ||
      updatedAnimation?.animationPatterns === undefined ||
      selectedAnimationPattern?.animationKeyFrames[selectedKeyFrameIndex] ===
        undefined
    ) {
      return;
    }

    updatedAnimation.animationPatterns[
      selectedAnimationPatternIndex
    ].animationKeyFrames[selectedKeyFrameIndex].propertyValue = value;
    setSelectedAnimation(updatedAnimation);
  };

  const getPropertyValue = (property: string) => {
    const selectedKeyFrame = selectedAnimationPattern?.animationKeyFrames.find(
      (kf: { uuid: any; propertyEdited: string }) =>
        kf.uuid === selectedKeyFrameUuid && kf.propertyEdited === property
    );

    return selectedKeyFrame?.propertyValue;
  };

  const getNextOrPreviousKeyframe = (
    getPrevious: boolean,
    property: string
  ) => {
    const currentSelectedKeyFrame =
      selectedAnimationPattern?.animationKeyFrames.find(
        (ak: { uuid: any }) => ak.uuid === selectedKeyFrameUuid
      );
    if (currentSelectedKeyFrame === undefined) {
      onGetNextOrPreviousKeyframeError(property);
      return;
    }

    const keyFrames = selectedAnimationPattern?.animationKeyFrames
      .filter((ak: { propertyEdited: string; timeMs: number }) => {
        const propertyIsTheSame = ak.propertyEdited === property;
        const isBelowOrUnderCurrentSelectedKeyFrame = getPrevious
          ? ak.timeMs <= currentSelectedKeyFrame?.timeMs ?? 0
          : ak.timeMs >= currentSelectedKeyFrame?.timeMs ?? 0;

        return propertyIsTheSame && isBelowOrUnderCurrentSelectedKeyFrame;
      })
      .sort(
        (a: { timeMs: number }, b: { timeMs: number }) => a.timeMs - b.timeMs
      );

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

    keyFrame = getPrevious
      ? keyFrames[currentPositionInArray - 1]
      : keyFrames[currentPositionInArray + 1];
    if (keyFrame === undefined) {
      onGetNextOrPreviousKeyframeError(property);
      return;
    }

    setTimelinePositionMs(keyFrame?.timeMs);
    setSelectedKeyFrameUuid(keyFrame.uuid);
  };

  const getLastKeyframe = (
    property: string,
    currentSelectedKeyFrameTimeMs: number
  ) => {
    const keyFrames = selectedAnimationPattern?.animationKeyFrames
      .filter((ak: { propertyEdited: string; timeMs: number }) => {
        const propertyIsTheSame = ak.propertyEdited === property;
        const isOverCurrentSelectedKeyFrame =
          ak.timeMs >= currentSelectedKeyFrameTimeMs ?? 0;
        return propertyIsTheSame && isOverCurrentSelectedKeyFrame;
      })
      .sort(
        (a: { timeMs: number }, b: { timeMs: number }) => a.timeMs - b.timeMs
      );

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
      .filter(
        (ak: { propertyEdited: string }) => ak.propertyEdited === property
      )
      .sort(
        (a: { timeMs: number }, b: { timeMs: number }) => a.timeMs - b.timeMs
      )
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
        <span>
          <IconButton
            disabled={uiComponentsAreDisabled}
            onClick={() => getNextOrPreviousKeyframe(true, property)}
          >
            <NavigateBeforeIcon />
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip title={`Next ${property} keyframe`}>
        <span>
          <IconButton
            disabled={uiComponentsAreDisabled}
            onClick={() => getNextOrPreviousKeyframe(false, property)}
          >
            <NavigateNextIcon />
          </IconButton>
        </span>
      </Tooltip>
    </span>
  );

  const updatePatternName = (e: any) => {
    let updatedAnimation: any = { ...selectedAnimation };
    if (updatedAnimation?.animationPatterns === undefined) {
      return;
    }

    updatedAnimation.animationPatterns[selectedAnimationPatternIndex].name =
      e.target.value;
    setSelectedAnimation(updatedAnimation);
  };

  const propertyStyle = { marginBottom: canvasPxSize / 4 - 120 };
  return (
    <Paper
      style={{
        padding: "15px",
        paddingTop: "2px",
        maxHeight: `${canvasPxSize + 70}px`,
      }}
      key={`${selectedAnimationPattern?.pattern.scale}-${selectedAnimationPattern?.pattern.xOffset}-${selectedAnimationPattern?.pattern.yOffset}-${selectedAnimationPattern?.pattern.rotation}`}
    >
      <p>Animation pattern properties</p>
      <Divider />
      <div style={{ marginBottom: "5px" }}>
        <FormLabel htmlFor="animation-name">Name</FormLabel>
        <br />
        <Input
          id="animation-name"
          inputProps={{ min: 2, max: 15 }}
          defaultValue={selectedAnimationPattern?.name}
          onChange={updatePatternName}
        />
      </div>
      <div style={propertyStyle}>
        <FormLabel htmlFor="animation-scale">Scale</FormLabel>
        <br />
        <Input
          id="animation-scale"
          type="number"
          inputProps={{ min: 0.1, max: 10, step: 0.1 }}
          defaultValue={getPropertyValue("scale")}
          onChange={(e) => updateProperty(Number(e.target.value))}
          disabled={
            selectedKeyFrame?.propertyEdited !== "scale" ||
            uiComponentsAreDisabled
          }
        />
        {nextKeyFrameButton("scale")}
      </div>
      <div style={propertyStyle}>
        <FormLabel htmlFor="animation-xoffset">X offset</FormLabel>
        <br />
        <Input
          id="animation-xoffset"
          type="number"
          inputProps={{ min: -4000, max: 4000 }}
          defaultValue={getPropertyValue("xOffset")}
          onChange={(e) => updateProperty(Number(e.target.value))}
          disabled={
            selectedKeyFrame?.propertyEdited !== "xOffset" ||
            uiComponentsAreDisabled
          }
        />
        {nextKeyFrameButton("xOffset")}
      </div>
      <div style={propertyStyle}>
        <FormLabel htmlFor="animation-yoffset">Y offset</FormLabel>
        <br />
        <Input
          id="animation-yoffset"
          type="number"
          inputProps={{ min: -4000, max: 4000 }}
          defaultValue={getPropertyValue("yOffset")}
          onChange={(e) => updateProperty(Number(e.target.value))}
          disabled={
            selectedKeyFrame?.propertyEdited !== "yOffset" ||
            uiComponentsAreDisabled
          }
        />
        {nextKeyFrameButton("yOffset")}
      </div>
      <div style={propertyStyle}>
        <FormLabel htmlFor="animation-rotation">Rotation</FormLabel>
        <br />
        <Input
          id="animation-rotation"
          type="number"
          inputProps={{ min: -360, max: 360 }}
          defaultValue={getPropertyValue("rotation")}
          onChange={(e) => updateProperty(Number(e.target.value))}
          disabled={
            selectedKeyFrame?.propertyEdited !== "rotation" ||
            uiComponentsAreDisabled
          }
        />
        {nextKeyFrameButton("rotation")}
      </div>
      <small>
        Animation duration:{" "}
        {Math.max(
          ...(selectedAnimationPattern?.animationKeyFrames?.map(
            (ak: { timeMs: any }) => ak?.timeMs
          ) ?? [0])
        )}{" "}
        ms
      </small>
      <div style={{ maxHeight: "200px", overflowY: "auto" }}>
        <Accordion disabled={uiComponentsAreDisabled}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <small>
              All keyframes (
              {selectedAnimationPattern?.animationKeyFrames?.length ?? 0})
            </small>
          </AccordionSummary>
          <AccordionDetails>
            <List>
              {selectedAnimationPattern?.animationKeyFrames?.map(
                (keyFrame: {
                  uuid: any;
                  timeMs: number;
                  propertyEdited: any;
                  propertyValue: any;
                }) => (
                  <ListItemButton
                    key={`${keyFrame.uuid}-points`}
                    onClick={() => {
                      setTimelinePositionMs(
                        keyFrame.timeMs - xCorrection[selectableStepsIndex]
                      );
                      setSelectedKeyFrameUuid(keyFrame.uuid);
                    }}
                  >
                    <ListItemText
                      primary={`Time ms: ${keyFrame.timeMs}`}
                      secondary={`${keyFrame.propertyEdited}: ${keyFrame.propertyValue}`}
                    />
                  </ListItemButton>
                )
              )}
            </List>
          </AccordionDetails>
        </Accordion>
      </div>
    </Paper>
  );
}
