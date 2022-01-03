import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@material-ui/core";

export default function AnimationSettings(props) {
  return (
    <div id="animation-settings">
      <text>{props?.pattern?.name}</text>

      <TextField fullWidth label="Start time ms" />
      <TextField fullWidth label="Duration time ms" />
      <FormControl fullWidth>
        <InputLabel>Timeline</InputLabel>
        <Select>
          <MenuItem value="0">0</MenuItem>
          <MenuItem value="1">1</MenuItem>
          <MenuItem value="2">2</MenuItem>
        </Select>
      </FormControl>
      <TextField
        fullWidth
        label="Scale"
        type="number"
        inputProps={{
          step: "0.1",
          min: 0.1,
          max: 1,
        }}
      />
      <FormControl fullWidth>
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
      </FormControl>
    </div>
  );
}
