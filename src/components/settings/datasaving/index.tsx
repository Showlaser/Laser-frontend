import { FormControlLabel, FormGroup, Switch, Tooltip } from "@mui/material";
import React from "react";
import { dataSavingIsEnabled, setDataSaving } from "services/shared/user-settings";

export default function DataSaving() {
  return (
    <FormGroup>
      <Tooltip
        placement="right-start"
        title="Turning this on will limit network requests to external services (like Spotify) to save network data"
      >
        <FormControlLabel
          control={
            <Switch
              defaultChecked={dataSavingIsEnabled()}
              onChange={(e) => setDataSaving(e.target.checked)}
            />
          }
          label="Enable data saving"
        />
      </Tooltip>
    </FormGroup>
  );
}
