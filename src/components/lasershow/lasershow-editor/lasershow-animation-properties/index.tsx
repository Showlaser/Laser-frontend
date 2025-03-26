import { Alert, Input, InputLabel, MenuItem, Select } from "@mui/material";
import { SelectedLasershowContext, SelectedLasershowContextType } from "pages/lasershow-editor";
import React from "react";
import { numberOfTimeLines } from "services/shared/config";
import { SelectedLasershowAnimationContext, SelectedLasershowAnimationContextType } from "..";

export default function LasershowAnimationProperties() {
  const { selectedLasershowAnimation, setSelectedLasershowAnimation } = React.useContext(
    SelectedLasershowAnimationContext
  ) as SelectedLasershowAnimationContextType;

  const { selectedLasershow, setSelectedLasershow } = React.useContext(
    SelectedLasershowContext
  ) as SelectedLasershowContextType;

  const updateLasershowAnimationProperty = (propertyName: string, value: any) => {
    if (selectedLasershowAnimation === null) {
      return;
    }

    const selectedLasershowAnimationIndex = selectedLasershow?.lasershowAnimations.findIndex(
      (la) => la.uuid === selectedLasershowAnimation?.uuid
    );
    if (selectedLasershowAnimationIndex === undefined) {
      return;
    }

    let updatedLasershow = { ...selectedLasershow } as any;
    updatedLasershow.lasershowAnimations[selectedLasershowAnimationIndex][propertyName] = value;
    setSelectedLasershow(updatedLasershow);
  };

  const getTimelineMenuItems = () => {
    let items = [];
    for (let i = 0; i < numberOfTimeLines; i++) {
      items.push(
        <MenuItem
          key={`${i}-menu-items`}
          selected={(selectedLasershowAnimation?.timelineId ?? 0) === i}
          value={i}
        >
          {i + 1}
        </MenuItem>
      );
    }

    return items;
  };

  const labelStyle = { marginBottom: "-11px", marginTop: "2.5px" };
  return selectedLasershowAnimation !== undefined ? (
    <>
      <InputLabel
        shrink
        style={{ marginBottom: labelStyle.marginBottom }}
        size="small"
        htmlFor="lasershow-animation-name"
      >
        Name
      </InputLabel>
      <Input
        size="small"
        id="lasershow-animation-name"
        inputProps={{ maxLength: 25 }}
        value={selectedLasershowAnimation?.name}
        onChange={(e) => updateLasershowAnimationProperty("name", e.target.value)}
      />
      <InputLabel shrink style={labelStyle} size="small" htmlFor="lasershow-animation-starttime">
        Starttime in Ms
      </InputLabel>
      <Input
        size="small"
        id="lasershow-animation-starttime"
        type="number"
        inputProps={{ min: 0, max: 100000000, step: "10" }}
        value={selectedLasershowAnimation?.startTimeMs}
        onChange={(e) => updateLasershowAnimationProperty("startTimeMs", Number(e.target.value))}
      />
      <InputLabel shrink style={labelStyle} id="properties-timeline-id">
        Timeline id
      </InputLabel>
      <Select
        size="small"
        labelId="properties-timeline-id"
        value={selectedLasershowAnimation?.timelineId}
        label="Timeline id"
        onChange={(e) => updateLasershowAnimationProperty("timelineId", Number(e.target.value))}
      >
        {getTimelineMenuItems()}
      </Select>
    </>
  ) : (
    <Alert severity="info">
      Select a lasershow animation first by clicking it in the timeline!
    </Alert>
  );
}
