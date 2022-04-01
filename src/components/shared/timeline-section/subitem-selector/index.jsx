import { Autocomplete, Button, TextField } from "@mui/material";
import React, { useState } from "react";

export default function SubItemSelector({ options, onSubitemSelect }) {
  const [selectedSubItemName, setSelectedSubItemName] = useState();

  return options?.length > 0 ? (
    <div>
      <Autocomplete
        onChange={(e, name) => setSelectedSubItemName(name)}
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
          onClick={() => onSubitemSelect(selectedSubItemName)}
        >
          Place on timeline
        </Button>
      </div>
    </div>
  ) : (
    <p>No items available add them</p>
  );
}
