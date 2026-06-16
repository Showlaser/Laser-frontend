import * as React from "react";
import {
  Alert,
  Checkbox,
  Fade,
  FormControl,
  FormControlLabel,
  FormGroup,
  TextField,
  Tooltip,
} from "@mui/material";
import { PatternSectionProps } from "models/components/shared/pattern";
import {
  getHexColorStringFromPoint,
  getRgbColorStringFromPoint,
  setLaserPowerFromHexString,
} from "services/shared/converters";
import { showWarning, toastSubject } from "services/shared/toast-messages";
import { OnTrue } from "components/shared/on-true";
import { emptyGuid } from "services/shared/math";
import PropertyControl from "components/shared/property-control";

const resetConfirmMessage = "Are you sure you want to reset this value?";

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
  const [dangerousElementsEnabled, setDangerousElementsEnabled] =
    React.useState<boolean>(false);
  const [showColorWarning, setShowColorWarning] =
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

  const getTooltipText = () =>
    dangerousElementsEnabled
      ? "Warning changing this value will reset the made changes!"
      : 'Enable this element by checking the "Enabled dangerous elements" checkbox';

  const allPointsHaveTheSameColor = (): boolean => {
    if (pattern?.points?.length === 0) {
      return false;
    }

    const firstColor = getRgbColorStringFromPoint(pattern.points[0] ?? "");
    return pattern?.points?.every(
      (p) => getRgbColorStringFromPoint(p) === firstColor
    );
  };

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
      <OnTrue onTrue={showColorWarning}>
        <Fade in={showColorWarning} timeout={1000}>
          <Alert severity="warning">
            Warning! The color changes are only applied when closing the color
            picker!
          </Alert>
        </Fade>
      </OnTrue>
      <FormControl
        style={{ width: "100%", marginBottom: "10px", marginTop: "10px" }}
      >
        <TextField
          onClick={() => setShowColorWarning(true)}
          label="Color"
          type="color"
          defaultValue={
            allPointsHaveTheSameColor()
              ? getHexColorStringFromPoint(pattern?.points[0])
              : "#fffff"
          }
          onBlur={(e) => {
            const updatedPoints = [...pattern.points];
            const length = updatedPoints.length;

            for (let i = 0; i < length; i++) {
              updatedPoints[i] = setLaserPowerFromHexString(e.target.value, {
                ...updatedPoints[i],
              });
            }

            setShowColorWarning(false);
            updatePatternProperty("points", updatedPoints);
          }}
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
        resetConfirmMessage={resetConfirmMessage}
      />
      <PropertyControl
        label="Number of points"
        id="svg-points"
        value={numberOfPoints}
        onChange={(value) => setNumberOfPoints(value)}
        min={1}
        max={500}
        showSlider
        disabled={!dangerousElementsEnabled}
        tooltip={getTooltipText()}
        onReset={() => setNumberOfPoints(200)}
        resetConfirmMessage={resetConfirmMessage}
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
        resetConfirmMessage={resetConfirmMessage}
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
        resetConfirmMessage={resetConfirmMessage}
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
        resetConfirmMessage={resetConfirmMessage}
      />
      <FormGroup>
        <Tooltip placement="right" title={getTooltipText()}>
          <FormControlLabel
            disabled={!dangerousElementsEnabled}
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
        <FormControlLabel
          control={
            <Checkbox
              checked={showPointNumber}
              onChange={(e) => setShowPointNumber(e.target.checked)}
            />
          }
          label="Show point numbers"
        />
        <FormControlLabel
          control={
            <Checkbox
              id="svg-toggle-dangerous-elements"
              checked={dangerousElementsEnabled}
              onChange={(e) => setDangerousElementsEnabled(e.target.checked)}
            />
          }
          label="Enable dangerous elements"
        />
      </FormGroup>
    </div>
  );
}
