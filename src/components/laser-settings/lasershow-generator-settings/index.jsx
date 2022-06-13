import {
  InputLabel,
  MenuItem,
  Select,
  FormGroup,
  FormControlLabel,
  Switch,
  Alert,
} from "@mui/material";
import { useEffect, useState } from "react";
import { getAudioDevices } from "services/logic/lasershow-generation-logic";

export default function LasershowGeneratorSettings() {
  const [devices, setDevices] = useState([]);
  const saveGeneratedLasershow =
    localStorage.getItem("save-generated-lasershows") !== null;

  useEffect(() => {
    getAudioDevices().then((deviceCollection) => setDevices(deviceCollection));
  }, []);

  const onDeviceSelect = (device) => {
    localStorage.setItem("selected-audio-device", device);
  };

  return (
    <div>
      <h2>Lasershow generator</h2>
      <FormGroup>
        <FormControlLabel
          control={
            <Switch
              defaultChecked={saveGeneratedLasershow}
              onChange={(e) =>
                e.target.checked
                  ? localStorage.setItem("save-generated-lasershows", null)
                  : localStorage.removeItem("save-generated-lasershows")
              }
            />
          }
          label="Save generated lasershows"
        />
        <Alert severity="info">
          The show will be saved if a new song starts. Do not close the
          application, otherwise your generated lasershow will not be saved! It
          is recommended that you do not pause the song during generation, since
          this can create a small delay.
        </Alert>
      </FormGroup>
      <InputLabel id="label">Audio device to listen to</InputLabel>
      <Select
        onChange={(e) => onDeviceSelect(e.target.value)}
        defaultValue={localStorage.getItem("selected-audio-device")}
      >
        {devices?.map((device) => (
          <MenuItem key={device} value={device}>
            {device}
          </MenuItem>
        ))}
      </Select>
    </div>
  );
}
