import { InputLabel, MenuItem, Select } from "@mui/material";
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
      <InputLabel id="label">Audio device to listen to</InputLabel>
      <Select onChange={(e) => onDeviceSelect(e.target.value)}>
        {devices?.map((device) => (
          <MenuItem key={device} value={device}>
            {device}
          </MenuItem>
        ))}
      </Select>
    </div>
  );
}
