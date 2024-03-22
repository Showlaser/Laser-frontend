import { Input, InputLabel, MenuItem, Select } from "@mui/material";
import React from "react";
import { numberOfTimeLines } from "services/shared/config";
import { SelectedLasershowAnimationContext, SelectedLasershowAnimationContextType } from "..";

export default function LasershowAnimationProperties() {
  const { selectedLasershowAnimation, setSelectedLasershowAnimation } = React.useContext(
    SelectedLasershowAnimationContext
  ) as SelectedLasershowAnimationContextType;

  const updateLasershowAnimationProperty = (propertyName: string, value: any) => {
    if (selectedLasershowAnimation === undefined) {
      return;
    }

    let updatedLasershowAnimation: any = { ...selectedLasershowAnimation };
    updatedLasershowAnimation[propertyName] = value;
    setSelectedLasershowAnimation(updatedLasershowAnimation);
  };

  const getTimelineMenuItems = () => {
    let items = [];
    for (let i = 0; i < numberOfTimeLines; i++) {
      items.push(
        <MenuItem key={`${i}-menu-items`} selected={(selectedLasershowAnimation?.timeLineId ?? 0) === i} value={i}>
          {i + 1}
        </MenuItem>
      );
    }

    return items;
  };

  const labelStyle = { marginBottom: "-11px", marginTop: "2.5px" };
  return (
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
        value={selectedLasershowAnimation?.timeLineId}
        label="Timeline id"
        onChange={(e) => updateLasershowAnimationProperty("timeLineId", Number(e.target.value))}
      >
        {getTimelineMenuItems()}
      </Select>
    </>
  );
}
