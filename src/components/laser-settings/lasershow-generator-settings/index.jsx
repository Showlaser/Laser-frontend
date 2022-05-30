import {
  InputLabel,
  MenuItem,
  Select,
  FormGroup,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { useEffect, useState } from "react";
import { getAudioDevices } from "services/logic/lasershow-generation-logic";

export default function LasershowGeneratorSettings() {
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    getAudioDevices().then((devices) => setDevices(devices));
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
              defaultChecked={
                localStorage.getItem("save-generated-lasershows") !== null
              }
              onChange={(e) =>
                e.target.checked
                  ? localStorage.setItem("save-generated-lasershows", null)
                  : localStorage.removeItem("save-generated-lasershows")
              }
            />
          }
          label="Save generated lasershows"
        />
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
