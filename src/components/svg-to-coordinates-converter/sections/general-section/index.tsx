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

export default function GeneralSection({
  scale,
  setScale,
  numberOfPoints,
  setNumberOfPoints,
  xOffset,
  setXOffset,
  yOffset,
  setYOffset,
  rotation,
  setRotation,
  showPointNumber,
  setShowPointNumber,
  fileName,
  setFileName,
  points,
  setPoints,
}: SectionProps) {
  const [dangerousElementsEnabled, setDangerousElementsEnabled] = React.useState<boolean>(false);

  const toggleAllDots = (e: any) => (e.target.checked ? connectAllDots() : disconnectAllDots());

  const disconnectAllDots = () => {
    let updatedPoints = [...points];
    const pointsLength = points.length;

    for (let i = 0; i < pointsLength; i++) {
      updatedPoints[i].connectedToPointOrderNr = null;
    }

    setPoints(updatedPoints);
  };

  const connectAllDots = () => {
    let updatedPoints = [...points];
    const pointsLenght = points.length;

    for (let i = 0; i < pointsLenght; i++) {
      if (i === points.length - 1) {
        updatedPoints[i].connectedToPointOrderNr = 0;
      } else {
        updatedPoints[i].connectedToPointOrderNr = i + 1;
      }
    }

    setPoints(updatedPoints);
  };

  const getTooltipText = () =>
    dangerousElementsEnabled
      ? "Warning changing this value will reset the made changes!"
      : 'Enable this element by checking the "Enabled dangerous elements" checkbox';

  return (
    <div>
      <FormControl style={{ width: "100%", marginBottom: "10px" }}>
        <TextField value={fileName} label="Pattern name" onChange={(e) => setFileName(e.target.value)} />
      </FormControl>
      <FormControl style={{ width: "100%", marginBottom: "10px", marginTop: "10px" }}>
        <TextField
          label="Color"
          type="color"
          value="#ffffff"
          onChange={(e) => {
            let updatedPoints = [...points];
            const length = updatedPoints.length;

            for (let i = 0; i < length; i++) {
              updatedPoints[i].colorRgb = e.target.value;
            }

            setPoints(updatedPoints);
          }}
        />
      </FormControl>
      <FormControl style={{ width: "100%" }}>
        <FormLabel htmlFor="svg-scale">
          Scale
          <Button
            style={{ marginLeft: "10px" }}
            onClick={() => (window.confirm("Are you sure you want to reset this value?") ? setScale(4) : null)}
          >
            Reset
          </Button>
        </FormLabel>
        <Slider
          id="svg-scale"
          size="small"
          value={scale}
          onChange={(e, value) => setScale(Number(value))}
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
          onClick={() => (window.confirm("Are you sure you want to reset this value?") ? setXOffset(0) : null)}
        >
          Reset
        </Button>
      </FormLabel>
      <br />
      <Input type="number" value={xOffset} onChange={(e) => setXOffset(Number(e.target.value))} />
      <br />
      <FormControl style={{ width: "100%" }}>
        <Slider
          id="svg-points"
          size="small"
          value={xOffset}
          onChange={(e, value) => setXOffset(Number(value))}
          min={-8000 / (scale * 10)}
          max={8000 / (scale * 10)}
          aria-label="Small"
          valueLabelDisplay="auto"
        />
      </FormControl>
      <FormLabel htmlFor="svg-points">
        Y offset
        <Button
          style={{ marginLeft: "10px" }}
          onClick={() => (window.confirm("Are you sure you want to reset this value?") ? setYOffset(0) : null)}
        >
          Reset
        </Button>
      </FormLabel>
      <br />
      <Input type="number" value={yOffset} onChange={(e) => setYOffset(Number(e.target.value))} />
      <br />
      <FormControl style={{ width: "100%" }}>
        <Slider
          id="svg-points"
          size="small"
          value={yOffset}
          onChange={(e, value) => setYOffset(Number(value))}
          min={-8000 / (scale * 10)}
          max={8000 / (scale * 10)}
          aria-label="Small"
          valueLabelDisplay="auto"
          marks={[{ value: 0, label: "0" }]}
        />
      </FormControl>
      <FormLabel htmlFor="svg-points">
        Rotation
        <Button
          style={{ marginLeft: "10px" }}
          onClick={() => (window.confirm("Are you sure you want to reset this value?") ? setRotation(0) : null)}
        >
          Reset
        </Button>
      </FormLabel>
      <br />
      <Input type="number" value={rotation} onChange={(e) => setRotation(Number(e.target.value))} />
      <br />
      <FormControl style={{ width: "100%" }}>
        <Slider
          id="svg-points"
          size="small"
          value={rotation}
          onChange={(e, value) => setRotation(Number(value))}
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
                checked={points.every((p) => p.connectedToPointOrderNr !== null)}
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
