import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@material-ui/core";
import { useEffect } from "react";

export default function AnimationSettings(props) {
  const selectedPattern = props?.selectedPattern;
  useEffect(() => {}, [props]);
  console.log();

  return (
    <div id="animation-settings">
      <p>{selectedPattern?.name}</p>

      <TextField fullwidth label="Start time ms" />
      <TextField fullwidth label="Duration time ms" />
      <FormControl fullwidth>
        <InputLabel>Timeline</InputLabel>
        <Select>
          <MenuItem value="0">0</MenuItem>
          <MenuItem value="1">1</MenuItem>
          <MenuItem value="2">2</MenuItem>
        </Select>
      </FormControl>
      <TextField
        fullwidth
        label="Scale"
        type="number"
        inputProps={{
          step: "0.1",
          min: 0.1,
          max: 1,
        }}
      />
      <FormControl fullwidth>
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
