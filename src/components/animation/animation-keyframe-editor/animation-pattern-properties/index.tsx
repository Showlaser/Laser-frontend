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
} from "@mui/material";

import React from "react";
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
import { numberIsBetweenOrEqual } from "services/shared/math";

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

  const updateKeyframeProperty = (value: string | number) => {
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
    setTimelinePositionMs(keyFrame?.timeMs);
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
    setTimelinePositionMs(kf?.timeMs);
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
    </span>
  );

  const updatePatternProperty = (propertyName: string, value: any) => {
    let updatedAnimation: any = { ...selectedAnimation };
    if (updatedAnimation?.animationPatterns === undefined) {
      return;
    }

    updatedAnimation.animationPatterns[selectedAnimationPatternIndex][
      propertyName
    ] = value;
    setSelectedAnimation(updatedAnimation);
  };

  const getTimelineMenuItems = () => {
    if (selectedAnimation === null) {
      return;
    }

    let availableTimelines: number[] = [];
    for (let i = 0; i < 3; i++) {
      const timelineSpotIsAvailable = !selectedAnimation.animationPatterns.some(
        (ap) =>
          ap.timelineId === i &&
          numberIsBetweenOrEqual(
            ap.startTimeMs,
            selectedAnimationPattern?.startTimeMs ?? 0,
            (selectedAnimationPattern?.startTimeMs ?? 0) +
              (selectedAnimationPattern?.getDuration ?? 0)
          )
      );

      if (timelineSpotIsAvailable) {
        availableTimelines.push(i);
      }
    }

    let elements = [];
    for (let i = 0; i < availableTimelines.length; i++) {
      elements.push(
        <MenuItem
          key={`${i}-menu-items`}
          selected={(selectedAnimationPattern?.timelineId ?? 0) == i}
          value={i}
        >
          {i + 1}
        </MenuItem>
      );
    }

    return elements;
  };

  const propertyStyle = { marginBottom: canvasPxSize / 4 - 150 };
  return (
    <div>
      <div style={{ marginBottom: "5px" }}>
        <FormLabel htmlFor="animation-name">Name</FormLabel>
        <br />
        <Input
          id="animation-name"
          inputProps={{ maxLength: 25 }}
          value={selectedAnimationPattern?.name}
          onChange={(e) => updatePatternProperty("name", e.target.value)}
        />
      </div>
      <div style={propertyStyle}>
        <FormLabel htmlFor="animation-scale">Scale</FormLabel>
        <br />
        <Input
          id="animation-scale"
          type="number"
          inputProps={{ min: 0.1, max: 10, step: 0.1 }}
          value={getPropertyValue("scale")}
          onChange={(e) => updateKeyframeProperty(Number(e.target.value))}
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
          value={getPropertyValue("xOffset")}
          onChange={(e) => updateKeyframeProperty(Number(e.target.value))}
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
          value={getPropertyValue("yOffset")}
          onChange={(e) => updateKeyframeProperty(Number(e.target.value))}
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
          value={getPropertyValue("rotation")}
          onChange={(e) => updateKeyframeProperty(Number(e.target.value))}
          disabled={
            selectedKeyFrame?.propertyEdited !== "rotation" ||
            uiComponentsAreDisabled
          }
        />
        {nextKeyFrameButton("rotation")}
      </div>
      <div style={{ marginBottom: "5px" }}>
        <FormLabel htmlFor="animation-starttime">Starttime in Ms</FormLabel>
        <br />
        <Input
          id="animation-starttime"
          type="number"
          inputProps={{ min: 0, max: 100000000 }}
          value={selectedAnimationPattern?.startTimeMs}
          onChange={(e) =>
            updatePatternProperty("startTimeMs", Number(e.target.value))
          }
        />
      </div>
      <div style={{ marginBottom: "5px" }}>
        <FormControl fullWidth>
          <FormLabel id="properties-timeline-id">Timeline id</FormLabel>
          <Select
            labelId="properties-timeline-id"
            value={selectedAnimationPattern?.timelineId}
            label="Timeline id"
            onChange={(e) =>
              updatePatternProperty("timelineId", Number(e.target.value))
            }
          >
            {getTimelineMenuItems()}
          </Select>
        </FormControl>
      </div>
      <small style={{ marginTop: "5px", marginBottom: "5px" }}>
        Animation pattern duration: {selectedAnimationPattern?.getDuration} ms
      </small>
      <div style={{ maxHeight: "150px", overflowY: "auto" }}>
        <Accordion disabled={uiComponentsAreDisabled}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <small>
              All keyframes (
              {selectedAnimationPattern?.animationKeyFrames?.length ?? 0})
            </small>
          </AccordionSummary>
          <AccordionDetails>
            <List dense={true}>
              {selectedAnimationPattern?.animationKeyFrames
                .sort((a, b) => a.timeMs - b.timeMs)
                ?.map(
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
                        primary={`${keyFrame.propertyEdited}: ${keyFrame.propertyValue}`}
                        secondary={`${keyFrame.timeMs} ms`}
                      />
                    </ListItemButton>
                  )
                )}
            </List>
          </AccordionDetails>
        </Accordion>
      </div>
    </div>
  );
}
