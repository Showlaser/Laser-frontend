import { Button, TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { useState } from "react";

export default function PatternSelector(props) {
  const [selectedPatternName, setSelectedPatternName] = useState();

  return (
    <div>
      <Autocomplete
        onChange={(e, patternName) => setSelectedPatternName(patternName)}
        options={props.data.options}
        renderInput={(params) => (
          <TextField {...params} label="Select pattern" />
        )}
      />
      <div>
        <Button
          style={{ marginTop: "10px", width: "100%" }}
          variant="contained"
          color="primary"
          size="small"
          onClick={() => props.data.callback(selectedPatternName)}
        >
          Place on timeline
        </Button>
      </div>
    </div>
  );
}
