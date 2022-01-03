import { Button, TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";

export default function PatternSelector(props) {
  return (
    <div>
      <Autocomplete
        onChange={(e, patternName) => props.data.callback(patternName)}
        options={props.data.options}
        renderInput={(params) => (
          <TextField {...params} label="Select pattern" />
        )}
      />
      <div>
        <Button
          style={{ marginTop: "10px", width: "100%" }}
          style={{ marginTop: "10px", width: "100%" }}
          variant="contained"
          color="primary"
          size="small"
        >
          Place on timeline
        </Button>
      </div>
    </div>
  );
}
