import * as React from "react";
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Input,
  Slider,
  TextField,
  Tooltip,
} from "@mui/material";
import { SectionProps } from "models/components/shared/pattern";
import { setLaserPowerFromHexString } from "services/shared/converters";
import { showError, showWarning, toastSubject } from "services/shared/toast-messages";

export default function GeneralSection({
  patternNamesInUse,
  setPatternNameIsInUse,
  pattern,
  updatePatternProperty,
  numberOfPoints,
  setNumberOfPoints,
  showPointNumber,
  setShowPointNumber,
}: SectionProps) {
  const [dangerousElementsEnabled, setDangerousElementsEnabled] = React.useState<boolean>(false);

  const toggleAllDots = (e: any) => (e.target.checked ? connectAllDots() : disconnectAllDots());

  const disconnectAllDots = () => {
    let updatedPoints = [...pattern.points];
    const pointsLength = pattern.points.length;

    for (let i = 0; i < pointsLength; i++) {
      updatedPoints[i].connectedToPointOrderNr = null;
    }

    updatePatternProperty("points", updatedPoints);
  };

  const connectAllDots = () => {
    let updatedPoints = [...pattern.points];
    const pointsLength = pattern.points.length;

    for (let i = 0; i < pointsLength; i++) {
      if (i === pattern.points.length - 1) {
        updatedPoints[i].connectedToPointOrderNr = 0;
      } else {
        updatedPoints[i].connectedToPointOrderNr = i + 1;
      }
    }

    updatePatternProperty("points", updatedPoints);
  };

  const getTooltipText = () =>
    dangerousElementsEnabled
      ? "Warning changing this value will reset the made changes!"
      : 'Enable this element by checking the "Enabled dangerous elements" checkbox';

  return (
    <div>
      <FormControl style={{ width: "100%", marginBottom: "10px" }}>
        <TextField
          value={pattern.name}
          label="Pattern name"
          onChange={(e) => {
            if (patternNamesInUse.some((patternName) => patternName === e.target.value)) {
              showWarning(toastSubject.duplicatedName);
              setPatternNameIsInUse(true);
            } else {
              setPatternNameIsInUse(false);
            }

            updatePatternProperty("name", e.target.value);
          }}
        />
      </FormControl>
      <FormControl style={{ width: "100%", marginBottom: "10px", marginTop: "10px" }}>
        <TextField
          label="Color"
          type="color"
          value="#ffffff"
          onChange={(e) => {
            let updatedPoints = [...pattern.points];
            const length = updatedPoints.length;

            for (let i = 0; i < length; i++) {
              updatedPoints[i] = setLaserPowerFromHexString(e.target.value, { ...updatedPoints[i] });
            }

            updatePatternProperty("points", updatedPoints);
          }}
        />
      </FormControl>
      <FormControl style={{ width: "100%" }}>
        <FormLabel htmlFor="svg-scale">
          Scale
          <Button
            style={{ marginLeft: "10px" }}
            onClick={() =>
              window.confirm("Are you sure you want to reset this value?") ? updatePatternProperty("scale", 4) : null
            }
          >
            Reset
          </Button>
        </FormLabel>
        <Slider
          id="svg-scale"
          size="small"
          value={pattern.scale}
          onChange={(e, value) => updatePatternProperty("scale", Number(value))}
          min={0.1}
          max={10}
          step={0.1}
          aria-label="Small"
          valueLabelDisplay="auto"
        />
      </FormControl>
      <br />
      <Tooltip placement="right" title={getTooltipText()}>
        <div>
          <FormLabel htmlFor="svg-points" disabled={!dangerousElementsEnabled}>
            Number of points
            <Button
              disabled={!dangerousElementsEnabled}
              style={{ marginLeft: "10px" }}
              onClick={() =>
                window.confirm("Are you sure you want to reset this value?") ? setNumberOfPoints(200) : null
              }
            >
              Reset
            </Button>
          </FormLabel>
          <br />
          <Input
            type="number"
            value={numberOfPoints}
            onChange={(e) => setNumberOfPoints(Number(e.target.value))}
            disabled={!dangerousElementsEnabled}
          />
          <br />
          <FormControl style={{ width: "100%" }}>
            <Slider
              disabled={!dangerousElementsEnabled}
              id="svg-points"
              size="small"
              value={numberOfPoints}
              onChange={(e, value) => setNumberOfPoints(Number(value))}
              min={1}
              max={500}
              aria-label="Small"
              valueLabelDisplay="auto"
            />
          </FormControl>
        </div>
      </Tooltip>
      <FormLabel htmlFor="svg-points">
        X offset
        <Button
          style={{ marginLeft: "10px" }}
          onClick={() =>
            window.confirm("Are you sure you want to reset this value?") ? updatePatternProperty("xOffset", 0) : null
          }
        >
          Reset
        </Button>
      </FormLabel>
      <br />
      <Input
        type="number"
        value={pattern.xOffset}
        onChange={(e) => updatePatternProperty("xOffset", Number(e.target.value))}
      />
      <br />
      <FormControl style={{ width: "100%" }}>
        <Slider
          id="svg-points"
          size="small"
          value={pattern.xOffset}
          onChange={(e, value) => updatePatternProperty("xOffset", Number(value))}
          min={-8000 / (pattern.scale * 10)}
          max={8000 / (pattern.scale * 10)}
          aria-label="Small"
          valueLabelDisplay="auto"
        />
      </FormControl>
      <FormLabel htmlFor="svg-points">
        Y offset
        <Button
          style={{ marginLeft: "10px" }}
          onClick={() =>
            window.confirm("Are you sure you want to reset this value?") ? updatePatternProperty("yOffset", 0) : null
          }
        >
          Reset
        </Button>
      </FormLabel>
      <br />
      <Input
        type="number"
        value={pattern.yOffset}
        onChange={(e) => updatePatternProperty("yOffset", Number(e.target.value))}
      />
      <br />
      <FormControl style={{ width: "100%" }}>
        <Slider
          id="svg-points"
          size="small"
          value={pattern.yOffset}
          onChange={(e, value) => updatePatternProperty("yOffset", Number(value))}
          min={-8000 / (pattern.scale * 10)}
          max={8000 / (pattern.scale * 10)}
          aria-label="Small"
          valueLabelDisplay="auto"
          marks={[{ value: 0, label: "0" }]}
        />
      </FormControl>
      <FormLabel htmlFor="svg-points">
        Rotation
        <Button
          style={{ marginLeft: "10px" }}
          onClick={() =>
            window.confirm("Are you sure you want to reset this value?") ? updatePatternProperty("rotation", 0) : null
          }
        >
          Reset
        </Button>
      </FormLabel>
      <br />
      <Input
        type="number"
        value={pattern.rotation}
        onChange={(e) => updatePatternProperty("rotation", Number(e.target.value))}
      />
      <br />
      <FormControl style={{ width: "100%" }}>
        <Slider
          id="svg-points"
          size="small"
          value={pattern.rotation}
          onChange={(e, value) => updatePatternProperty("rotation", Number(value))}
          min={-360}
          max={360}
          aria-label="Small"
          valueLabelDisplay="auto"
        />
      </FormControl>
      <FormGroup>
        <Tooltip placement="right" title={getTooltipText()}>
          <FormControlLabel
            disabled={!dangerousElementsEnabled}
            control={
              <Checkbox
                checked={pattern.points.every((p) => p.connectedToPointOrderNr !== null)}
                onChange={(e) => toggleAllDots(e)}
              />
            }
            label="Connect all dots"
          />
        </Tooltip>
        <FormControlLabel
          control={<Checkbox checked={showPointNumber} onChange={(e) => setShowPointNumber(e.target.checked)} />}
          label="Show point numbers"
        />
        <FormControlLabel
          control={
            <Checkbox
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
