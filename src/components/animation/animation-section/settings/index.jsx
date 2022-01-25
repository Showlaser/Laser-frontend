import {
  Button,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@material-ui/core";
import PointsForm from "components/shared/point-form";
import { useEffect } from "react";

export default function AnimationSettings(props) {
  const { selectedPattern } = props;
  useEffect(() => [props]);

  return (
    <div id="animation-settings">
      <TextField
        label="Pattern animation name"
        value={selectedPattern?.name ?? ""}
        onChange={(e) => {}}
      />
      <TextField
        defaultValue={selectedPattern?.patternAnimation?.startTimeMs ?? 0}
        label="Start time ms"
      />
      <TextField label="Duration time ms" />
      <br />
      <InputLabel>Timeline</InputLabel>
      <Select value={selectedPattern?.patternAnimation?.timelineId ?? 1}>
        <MenuItem value="0">0</MenuItem>
        <MenuItem value="1">1</MenuItem>
        <MenuItem value="2">2</MenuItem>
      </Select>
      <br />
      <Button>Delete</Button>
      <hr />
      <label>Animation points</label>
      <br />
      <TextField
        defaultValue={selectedPattern?.patternAnimation?.scale}
        label="Scale"
        type="number"
        inputProps={{
          step: "0.1",
          min: 0.1,
          max: 1,
        }}
      />
      <br />
      <TextField
        label="X position"
        type="number"
        inputProps={{
          min: -4000,
          max: 4000,
        }}
      />
      <TextField
        label="Y position"
        type="number"
        inputProps={{
          min: -4000,
          max: 4000,
        }}
      />
      <br />
      <PointsForm
        namePlaceHolder="Animation name"
        item={selectedPattern}
        onNameChange={(name) => {}}
        addPoint={() => {}}
        onPointUpdate={() => {}}
        onDelete={() => {}}
      />
    </div>
  );
}
