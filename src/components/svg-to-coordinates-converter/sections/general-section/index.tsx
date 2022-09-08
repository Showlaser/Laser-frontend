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
} from "@mui/material";

type GeneralSectionProps = {
  scale: number;
  setScale: (value: number) => void;
  numberOfPoints: number;
  setNumberOfPoints: (value: number) => void;
  xOffset: number;
  setXOffset: (value: number) => void;
  yOffset: number;
  setYOffset: (value: number) => void;
  rotation: number;
  setRotation: (value: number) => void;
  connectDots: boolean;
  setConnectDots: (value: boolean) => void;
  showPointNumber: boolean;
  setShowPointNumber: (value: boolean) => void;
};

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
  connectDots,
  setConnectDots,
  showPointNumber,
  setShowPointNumber,
}: GeneralSectionProps) {  
  return (
    <div>
      <FormControl style={{ width: "100%" }}>
        <FormLabel htmlFor="svg-scale">Scale<Button style={{marginLeft: "10px"}} onClick={() => setScale(4)}>Reset</Button>
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
      <FormLabel htmlFor="svg-points">Number of points<Button style={{marginLeft: "10px"}} onClick={() => setNumberOfPoints(200)}>Reset</Button></FormLabel>
      <br />
      <Input
        type="number"
        value={numberOfPoints}
        onChange={(e) => setNumberOfPoints(Number(e.target.value))}
      />
      <br />
      <FormControl style={{ width: "100%" }}>
        <Slider
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
      <FormLabel htmlFor="svg-points">X offset<Button style={{marginLeft: "10px"}} onClick={() => setXOffset(0)}>Reset</Button></FormLabel>
      <br />
      <Input
        type="number"
        value={xOffset}
        onChange={(e) => setXOffset(Number(e.target.value))}
      />
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
      <FormLabel htmlFor="svg-points">Y offset<Button style={{marginLeft: "10px"}} onClick={() => setYOffset(0)}>Reset</Button></FormLabel>
      <br />
      <Input
        type="number"
        value={yOffset}
        onChange={(e) => setYOffset(Number(e.target.value))}
      />
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
      <FormLabel htmlFor="svg-points">Rotation<Button style={{marginLeft: "10px"}} onClick={() => setRotation(0)}>Reset</Button></FormLabel>
      <br />
      <Input
        type="number"
        value={rotation}
        onChange={(e) => setRotation(Number(e.target.value))}
      />
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
        <FormControlLabel
          control={
            <Checkbox
              checked={connectDots}
              onChange={(e) => setConnectDots(e.target.checked)}
            />
          }
          label="Connect dots"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={showPointNumber}
              onChange={(e) => setShowPointNumber(e.target.checked)}
            />
          }
          label="Show point number"
        />
      </FormGroup>
    </div>
  );
}
