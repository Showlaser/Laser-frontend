import { Button, TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { useState } from "react";

export default function PatternSelector(props) {
  const { options, onPatternSelect } = props;
  const [selectedPatternName, setSelectedPatternAnimationUuid] = useState();

  return options?.length > 0 ? (
    <div>
      <Autocomplete
        onChange={(e, patternName) =>
          setSelectedPatternAnimationUuid(patternName)
        }
        options={options}
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
          onClick={() => onPatternSelect(selectedPatternName)}
        >
          Place on timeline
        </Button>
      </div>
    </div>
  ) : (
    <p>No patterns available add them on the patterns page</p>
  );
}
