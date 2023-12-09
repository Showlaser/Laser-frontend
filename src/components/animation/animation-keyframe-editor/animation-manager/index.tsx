import {
  AvailablePatternsContext,
  AvailablePatternsContextType,
  SelectedAnimationContext,
  SelectedAnimationContextType,
} from "pages/animation-editor";
import React, { useEffect } from "react";
import {
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { convertPatternToAnimationPattern } from "services/shared/converters";
import { Animation, AnimationPattern } from "models/components/shared/animation";
import { animationPatternTimeWidthWhenDurationIsZero } from "services/shared/config";
import { OnTrue } from "components/shared/on-true";
import DeleteModal, { ModalOptions } from "components/shared/delete-modal";

export default function AnimationManager() {
  const { availablePatterns, setAvailablePatterns } = React.useContext(
    AvailablePatternsContext
  ) as AvailablePatternsContextType;

  const { selectedAnimation, setSelectedAnimation } = React.useContext(
    SelectedAnimationContext
  ) as SelectedAnimationContextType;

  const [checkedUuidsToRemove, setCheckedUuidsToRemove] = React.useState<string[]>([]);
  const [checkedUuidsToAdd, setCheckedUuidsToAdd] = React.useState<string[]>([]);

  const deleteSelectedAnimationPatterns = () => {
    if (selectedAnimation === undefined) {
      return;
    }

    let updatedAnimation: any = { ...selectedAnimation };
    const animationPatternsToKeep = updatedAnimation.animationPatterns?.filter(
      (ap: { uuid: string }) => !checkedUuidsToRemove.some((uuid) => uuid === ap.uuid)
    );
    updatedAnimation.animationPatterns = animationPatternsToKeep;
    setSelectedAnimation(updatedAnimation);
    setCheckedUuidsToRemove([]);
  };

  const [modalOptions, setModalOptions] = React.useState<ModalOptions>({
    show: false,
    onDelete: () => {},
    title: "Are you sure you want to remove the selected animation pattern(s)?",
  });

  useEffect(() => {}, [availablePatterns, checkedUuidsToRemove]);

  const handleToggle = (uuid: string | undefined, arrayToUpdate: string[], updateArray: (array: string[]) => void) => {
    if (uuid === undefined) {
      return;
    }

    const uuidIndex = arrayToUpdate.findIndex((u) => u === uuid);
    const newChecked = [...arrayToUpdate];

    uuidIndex === -1 ? newChecked.push(uuid) : newChecked.splice(uuidIndex, 1);
    updateArray(newChecked);
  };

  const getAvailableTimelinePositionSpot = (animation: Animation) => {
    for (let i = 0; i < 3; i++) {
      const animationPatternWithSameTimelineId = animation.animationPatterns.filter((ap) => ap.timelineId === i);
      if (animationPatternWithSameTimelineId.length === 0) {
        return { timelineId: i, timeMs: 0 };
      }
    }

    let lastAnimationPatternsOnTimelines: AnimationPattern[] = [];
    for (let i = 0; i < 3; i++) {
      const lastAnimationPatternOnTimeline = animation.animationPatterns.filter((ap) => ap.timelineId === i)?.at(-1);
      if (lastAnimationPatternOnTimeline !== undefined) {
        lastAnimationPatternsOnTimelines.push(lastAnimationPatternOnTimeline);
      }
    }

    lastAnimationPatternsOnTimelines.sort((a, b) => a.getDuration + a.startTimeMs - b.getDuration + b.startTimeMs);
    const firstAnimationPattern = lastAnimationPatternsOnTimelines.at(-1);
    if (firstAnimationPattern === undefined) {
      return { timelineId: null, timeMs: null };
    }

    const startTimeMs =
      (firstAnimationPattern.getDuration === 0
        ? animationPatternTimeWidthWhenDurationIsZero * 4
        : firstAnimationPattern.getDuration) + firstAnimationPattern.startTimeMs;

    return {
      timelineId: firstAnimationPattern.timelineId,
      timeMs: startTimeMs,
    };
  };

  const addAnimationPatternsToAnimation = () => {
    if (selectedAnimation === null) {
      return;
    }

    let updatedAnimation: Animation = { ...selectedAnimation };
    const patternsToAdd = availablePatterns?.filter((ap) => checkedUuidsToAdd.some((cu) => cu === ap.uuid));
    if (patternsToAdd === undefined) {
      return;
    }

    patternsToAdd.forEach((pta) => {
      let convertedPattern = convertPatternToAnimationPattern(pta);
      const { timelineId, timeMs } = getAvailableTimelinePositionSpot(updatedAnimation);
      if (timelineId === null || timeMs === null || convertedPattern === undefined) {
        return;
      }

      convertedPattern.timelineId = timelineId;
      convertedPattern.startTimeMs = timeMs;
      updatedAnimation.animationPatterns?.push(convertedPattern);
    });

    setSelectedAnimation(updatedAnimation);
    setCheckedUuidsToAdd([]);
  };

  return (
    <div>
      <DeleteModal modalOptions={modalOptions} setModalOptions={setModalOptions} />
      <FormControl fullWidth>
        <FormLabel>Add animation patterns</FormLabel>
        <List style={{ maxHeight: "200px", overflowY: "auto" }}>
          {availablePatterns?.map((ap) => (
            <ListItem key={`ap-am-${ap.uuid}`} disablePadding>
              <ListItemButton
                role={undefined}
                onClick={() => handleToggle(ap.uuid, checkedUuidsToAdd, setCheckedUuidsToAdd)}
                dense
              >
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={checkedUuidsToAdd.some((u) => u === ap.uuid)}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{ "aria-labelledby": `ap-am-ip-${ap.uuid}` }}
                  />
                </ListItemIcon>
                <ListItemText id={`ap-am-ip-${ap.uuid}`} primary={ap.name} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <OnTrue onTrue={checkedUuidsToAdd.length > 0}>
          <Button variant="contained" style={{ marginTop: "10px" }} onClick={addAnimationPatternsToAnimation}>
            Add
          </Button>
        </OnTrue>
      </FormControl>
      <FormControl fullWidth style={{ marginTop: "20px" }}>
        <FormLabel>Remove animation patterns</FormLabel>
        <List style={{ maxHeight: "200px", overflowY: "auto" }}>
          {selectedAnimation?.animationPatterns.map((ap) => (
            <ListItem key={`ap-am-${ap.uuid}`} disablePadding>
              <ListItemButton
                role={undefined}
                onClick={() => handleToggle(ap.uuid, checkedUuidsToRemove, setCheckedUuidsToRemove)}
                dense
              >
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={checkedUuidsToRemove.some((u) => u === ap.uuid)}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{ "aria-labelledby": `ap-am-ip-${ap.uuid}` }}
                  />
                </ListItemIcon>
                <ListItemText id={`ap-am-ip-${ap.uuid}`} primary={ap.name} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <OnTrue onTrue={checkedUuidsToRemove.length > 0}>
          <Button
            variant="contained"
            color="error"
            style={{ marginTop: "10px" }}
            onClick={() => {
              let updateModalOptions = { ...modalOptions };
              updateModalOptions.show = true;
              updateModalOptions.onDelete = deleteSelectedAnimationPatterns;
              setModalOptions(updateModalOptions);
            }}
          >
            Delete
          </Button>
        </OnTrue>
      </FormControl>
    </div>
  );
}
