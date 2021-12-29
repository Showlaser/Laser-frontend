import { TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";

export default function PatternSelector(props) {
  return (
    <Autocomplete
      onChange={(e, patternName) => props.data.callback(patternName)}
      options={props.data.options}
      renderInput={(params) => <TextField {...params} label="Select pattern" />}
    />
  );
}
