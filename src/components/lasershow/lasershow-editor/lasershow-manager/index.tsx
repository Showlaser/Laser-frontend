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
  TextField,
} from "@mui/material";
import DeleteModal, { ModalOptions } from "components/shared/delete-modal";
import { OnTrue } from "components/shared/on-true";
import { Lasershow, LasershowAnimation } from "models/components/shared/lasershow";
import { AvailableAnimationsContext, AvailableAnimationsContextType } from "pages/lasershow-editor";
import { SelectedLasershowContext, SelectedLasershowContextType } from "pages/lasershow-editor";
import React, { useEffect } from "react";
import { getAnimationDuration } from "services/logic/animation-logic";
import { canvasPxSize, timelineItemWidthWhenDurationIsZero } from "services/shared/config";
import { convertAnimationToLasershowAnimation } from "services/shared/converters";

export default function LasershowManager() {
  const { availableAnimations, setAvailableAnimations } = React.useContext(
    AvailableAnimationsContext
  ) as AvailableAnimationsContextType;

  const { selectedLasershow, setSelectedLasershow } = React.useContext(
    SelectedLasershowContext
  ) as SelectedLasershowContextType;

  const [checkedUuidsToRemove, setCheckedUuidsToRemove] = React.useState<string[]>([]);
  const [checkedUuidsToAdd, setCheckedUuidsToAdd] = React.useState<string[]>([]);

  const deleteSelectedLasershowAnimations = () => {
    if (selectedLasershow === undefined) {
      return;
    }

    let updatedLasershow = { ...selectedLasershow } as Lasershow;
    const animationsToKeep = updatedLasershow.lasershowAnimations?.filter(
      (a) => !checkedUuidsToRemove.some((uuid) => uuid === a.uuid)
    );

    updatedLasershow.lasershowAnimations = animationsToKeep;
    setSelectedLasershow(updatedLasershow);
    setCheckedUuidsToRemove([]);
  };

  const [modalOptions, setModalOptions] = React.useState<ModalOptions>({
    show: false,
    onDelete: () => {},
    title: "Are you sure you want to remove the selected animation(s)?",
  });

  useEffect(() => {}, [availableAnimations, checkedUuidsToRemove]);

  const handleToggle = (uuid: string | undefined, arrayToUpdate: string[], updateArray: (array: string[]) => void) => {
    if (uuid === undefined) {
      return;
    }

    const uuidIndex = arrayToUpdate.findIndex((u) => u === uuid);
    const newChecked = [...arrayToUpdate];

    uuidIndex === -1 ? newChecked.push(uuid) : newChecked.splice(uuidIndex, 1);
    updateArray(newChecked);
  };

  const addAnimationToLasershow = () => {
    if (selectedLasershow === null) {
      return;
    }

    let updatedLasershow: Lasershow = { ...selectedLasershow };
    const animationsToAdd = availableAnimations?.filter((aa) => checkedUuidsToAdd.some((cu) => cu === aa.uuid));
    if (animationsToAdd === undefined) {
      return;
    }

    animationsToAdd.forEach((ata) => {
      const convertedAnimation = convertAnimationToLasershowAnimation(ata, selectedLasershow.uuid);
      const { timelineId, timeMs } = getAvailableTimelinePositionSpot(convertedAnimation);
      if (timelineId === null || timeMs === null || convertedAnimation === undefined) {
        return;
      }

      convertedAnimation.timelineId = timelineId;
      convertedAnimation.startTimeMs = timeMs;
      updatedLasershow.lasershowAnimations.push(convertedAnimation);
    });

    setSelectedLasershow(updatedLasershow);
  };

  const getAvailableTimelinePositionSpot = (lasershowAnimation: LasershowAnimation) => {
    if (selectedLasershow === null) {
      return { timelineId: 0, timeMs: 0 };
    }

    for (let i = 0; i < 3; i++) {
      const lasershowAnimationsWithSameTimelineId = selectedLasershow.lasershowAnimations?.filter(
        (la) => la?.timelineId === i
      );
      if (lasershowAnimationsWithSameTimelineId.length === 0) {
        return { timelineId: i, timeMs: 0 };
      }
    }

    let lastLasershowAnimationOnTimelines: LasershowAnimation[] = [];
    for (let i = 0; i < 3; i++) {
      const lastLasershowAnimationOnTimeline = selectedLasershow.lasershowAnimations
        .filter((la) => la.timelineId === i)
        ?.at(-1);
      if (lastLasershowAnimationOnTimeline !== undefined) {
        lastLasershowAnimationOnTimelines.push(lastLasershowAnimationOnTimeline);
      }
    }

    lastLasershowAnimationOnTimelines.sort(
      (a, b) => getAnimationDuration(a.animation) + a.startTimeMs - getAnimationDuration(b.animation) + b.startTimeMs
    );
    const firstLasershowAnimation = lastLasershowAnimationOnTimelines.at(-1);
    if (firstLasershowAnimation === undefined) {
      return { timelineId: null, timeMs: null };
    }

    const startTimeMs =
      (getAnimationDuration(firstLasershowAnimation.animation) === 0
        ? timelineItemWidthWhenDurationIsZero * 4
        : getAnimationDuration(firstLasershowAnimation.animation)) + firstLasershowAnimation.startTimeMs;

    return {
      timelineId: firstLasershowAnimation.timelineId,
      timeMs: startTimeMs,
    };
  };

  return (
    <>
      <DeleteModal modalOptions={modalOptions} setModalOptions={setModalOptions} />
      <div style={{ maxHeight: canvasPxSize - 98, overflowY: "auto" }}>
        <FormControl fullWidth>
          <FormLabel htmlFor="lasershow-name">Lasershow name</FormLabel>
          <TextField
            style={{ marginBottom: "5px" }}
            id="lasershow-name"
            value={selectedLasershow?.name}
            onChange={(e) => {
              let lasershowToUpdate = { ...selectedLasershow } as Lasershow;
              lasershowToUpdate.name = e.target.value;
              setSelectedLasershow(lasershowToUpdate);
            }}
          />
          <FormLabel>Add animations to lasershow</FormLabel>
          <List style={{ maxHeight: "200px", overflowY: "auto" }}>
            {availableAnimations?.map((aa) => (
              <ListItem key={`lsm-aa-${aa.uuid}`} disablePadding>
                <ListItemButton
                  role={undefined}
                  onClick={() => handleToggle(aa.uuid, checkedUuidsToAdd, setCheckedUuidsToAdd)}
                >
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={checkedUuidsToAdd.some((u) => u === aa.uuid)}
                      tabIndex={-1}
                      disableRipple
                      inputProps={{ "aria-labelledby": `lsm-aa-ip-${aa.uuid}` }}
                    />
                  </ListItemIcon>
                  <ListItemText id={`lsm-aa-ip-${aa.uuid}`} primary={aa.name} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <OnTrue onTrue={checkedUuidsToAdd.length > 0}>
            <Button variant="contained" style={{ marginTop: "10px" }} onClick={addAnimationToLasershow}>
              Add
            </Button>
          </OnTrue>
        </FormControl>
        <FormControl fullWidth style={{ marginTop: "20px" }}>
          <FormLabel>Remove lasershow animations</FormLabel>
          <List style={{ maxHeight: "200px", overflowY: "auto" }}>
            {selectedLasershow?.lasershowAnimations.map((la) => (
              <ListItem key={`la-tr-${la.uuid}`} disablePadding>
                <ListItemButton
                  role={undefined}
                  onClick={() => handleToggle(la.uuid, checkedUuidsToRemove, setCheckedUuidsToRemove)}
                  dense
                >
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={checkedUuidsToRemove.some((u) => u === la.uuid)}
                      tabIndex={-1}
                      disableRipple
                      inputProps={{ "aria-labelledby": `la-tr-ip-${la.uuid}` }}
                    />
                  </ListItemIcon>
                  <ListItemText id={`la-tr-ip-${la.uuid}`} primary={la.name} />
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
                updateModalOptions.onDelete = deleteSelectedLasershowAnimations;
                setModalOptions(updateModalOptions);
              }}
            >
              Delete
            </Button>
          </OnTrue>
        </FormControl>
      </div>
    </>
  );
}
