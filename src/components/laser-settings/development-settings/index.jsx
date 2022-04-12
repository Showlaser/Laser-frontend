import { FormControlLabel, FormGroup, Switch } from "@mui/material";

export default function DevelopmentSettings({ callback, development }) {
  return (
    <div>
      <h2>Development</h2>
      <FormGroup>
        <FormControlLabel
          control={<Switch onChange={(e) => {}} color="secondary" />}
          label="Enable development mode"
        />
      </FormGroup>
    </div>
  );
}
