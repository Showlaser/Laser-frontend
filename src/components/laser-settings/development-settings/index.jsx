import { FormControlLabel, FormGroup, Switch } from "@material-ui/core";

export default function DevelopmentSettings(props) {
  const changeDevelopmentMode = (value, propName) => {
    let updatedDevelopment = props?.development;
    updatedDevelopment[propName] = value;
    props.callback(updatedDevelopment, "development");
  };

  return (
    <div>
      <h2>Development</h2>
      <FormGroup>
        <FormControlLabel
          control={
            <Switch
              onChange={(e) =>
                changeDevelopmentMode(
                  e.target.checked,
                  "developmentModeEnabled"
                )
              }
              color="secondary"
            />
          }
          label="Enable development mode"
        />
      </FormGroup>
    </div>
  );
}
