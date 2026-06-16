import * as React from "react";
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  IconButton,
  TextField,
  Tooltip,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import { PatternSectionProps } from "models/components/shared/pattern";
import {
  getHexColorStringFromPoint,
  getRgbColorStringFromPoint,
  setLaserPowerFromHexString,
} from "services/shared/converters";
import { showWarning, toastSubject } from "services/shared/toast-messages";
import { emptyGuid } from "services/shared/math";
import PropertyControl from "components/shared/property-control";

export default function GeneralSection({
  patternNamesInUse,
  setPatternNameIsInUse,
  pattern,
  updatePatternProperty,
  numberOfPoints,
  setNumberOfPoints,
  showPointNumber,
  setShowPointNumber,
}: PatternSectionProps) {
  const [numberOfPointsUnlocked, setNumberOfPointsUnlocked] =
    React.useState<boolean>(false);
  const [connectDotsUnlocked, setConnectDotsUnlocked] =
    React.useState<boolean>(false);

  const toggleAllDots = (e: React.ChangeEvent<HTMLInputElement>) =>
    e.target.checked ? connectAllDots() : disconnectAllDots();

  const disconnectAllDots = () => {
    const updatedPoints = [...pattern.points];
    const pointsLength = pattern.points.length;

    for (let i = 0; i < pointsLength; i++) {
      updatedPoints[i].connectedToPointUuid = emptyGuid;
    }

    updatePatternProperty("points", updatedPoints);
  };

  const connectAllDots = () => {
    const updatedPoints = [...pattern.points].sort(
      (a, b) => a.orderNr - b.orderNr
    );
    const pointsLength = pattern.points.length;

    for (let i = 0; i < pointsLength; i++) {
      if (i === pattern.points.length - 1) {
        updatedPoints[i].connectedToPointUuid =
          pattern.points.find((p) => p.orderNr === 0)?.uuid ?? emptyGuid;
      } else {
        updatedPoints[i].connectedToPointUuid =
          pattern.points.find((p) => p.orderNr === i + 1)?.uuid ?? emptyGuid;
      }
    }

    updatePatternProperty("points", updatedPoints);
  };

  const allPointsHaveTheSameColor = (): boolean => {
    if (pattern?.points?.length === 0) {
      return false;
    }

    const firstColor = getRgbColorStringFromPoint(pattern.points[0] ?? "");
    return pattern?.points?.every(
      (p) => getRgbColorStringFromPoint(p) === firstColor
    );
  };

  const applyColorToAllPoints = (hexColor: string) => {
    const updatedPoints = pattern.points.map((point) =>
      setLaserPowerFromHexString(hexColor, { ...point })
    );
    updatePatternProperty("points", updatedPoints);
  };

  const lockToggle = (
    unlocked: boolean,
    setUnlocked: (value: boolean) => void,
    id?: string
  ) => (
    <Tooltip
      placement="right"
      title={
        unlocked
          ? "Lock to prevent accidental changes"
          : "Unlock — changing this resets your manual point edits"
      }
    >
      <IconButton id={id} size="small" onClick={() => setUnlocked(!unlocked)}>
        {unlocked ? (
          <LockOpenIcon fontSize="small" />
        ) : (
          <LockIcon fontSize="small" />
        )}
      </IconButton>
    </Tooltip>
  );

  return (
    <div tabIndex={0}>
      <FormControl style={{ width: "100%", marginBottom: "10px" }}>
        <TextField
          value={pattern.name}
          label="Pattern name"
          onChange={(e) => {
            if (
              patternNamesInUse.some(
                (patternName) => patternName === e.target.value
              )
            ) {
              showWarning(toastSubject.duplicatedName);
              setPatternNameIsInUse(true);
            } else {
              setPatternNameIsInUse(false);
            }

            updatePatternProperty("name", e.target.value);
          }}
        />
      </FormControl>
      <FormControl
        style={{ width: "100%", marginBottom: "10px", marginTop: "10px" }}
      >
        <TextField
          label="Color"
          type="color"
          value={
            allPointsHaveTheSameColor()
              ? getHexColorStringFromPoint(pattern?.points[0])
              : "#ffffff"
          }
          onChange={(e) => applyColorToAllPoints(e.target.value)}
        />
      </FormControl>
      <PropertyControl
        label="Scale"
        id="svg-scale"
        value={pattern.scale}
        onChange={(value) => updatePatternProperty("scale", value)}
        min={0.1}
        max={100}
        step={0.1}
        showInput={false}
        showSlider
        onReset={() => updatePatternProperty("scale", 1)}
      />
      <PropertyControl
        label="Number of points"
        id="svg-points"
        value={numberOfPoints}
        onChange={(value) => setNumberOfPoints(value)}
        min={1}
        max={500}
        showSlider
        disabled={!numberOfPointsUnlocked}
        labelAdornment={lockToggle(
          numberOfPointsUnlocked,
          setNumberOfPointsUnlocked,
          "svg-toggle-points-lock"
        )}
        onReset={() => setNumberOfPoints(200)}
      />
      <PropertyControl
        label="X offset"
        id="svg-xoffset"
        value={pattern.xOffset}
        onChange={(value) => updatePatternProperty("xOffset", Math.round(value))}
        min={-4000}
        max={4000}
        showSlider
        onReset={() => updatePatternProperty("xOffset", 0)}
      />
      <PropertyControl
        label="Y offset"
        id="svg-yoffset"
        value={pattern.yOffset}
        onChange={(value) => updatePatternProperty("yOffset", Math.round(value))}
        min={-4000}
        max={4000}
        showSlider
        sliderMarks={[{ value: 0, label: "0" }]}
        onReset={() => updatePatternProperty("yOffset", 0)}
      />
      <PropertyControl
        label="Rotation"
        id="svg-rotation"
        value={pattern.rotation}
        onChange={(value) => updatePatternProperty("rotation", value)}
        min={-360}
        max={360}
        showSlider
        onReset={() => updatePatternProperty("rotation", 0)}
      />
      <FormGroup>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Tooltip
            placement="right"
            title="Connecting or disconnecting all dots overwrites manual connections"
          >
            <FormControlLabel
              disabled={!connectDotsUnlocked}
              control={
                <Checkbox
                  id="svg-toggle-all-dots"
                  checked={pattern.points.every(
                    (p) => p.connectedToPointUuid !== emptyGuid
                  )}
                  onChange={(e) => toggleAllDots(e)}
                />
              }
              label="Connect all dots"
            />
          </Tooltip>
          {lockToggle(
            connectDotsUnlocked,
            setConnectDotsUnlocked,
            "svg-toggle-dots-lock"
          )}
        </div>
        <FormControlLabel
          control={
            <Checkbox
              checked={showPointNumber}
              onChange={(e) => setShowPointNumber(e.target.checked)}
            />
          }
          label="Show point numbers"
        />
      </FormGroup>
    </div>
  );
}
