import { Alert, TextField } from "@mui/material";
import { useState } from "react";
import { getSpotifyDevices } from "services/logic/spotify";

export default function VoteSettings({ setVoteValidTimeInMinutes }) {
  const [activeDevice, setActiveDevice] = useState();
  const [intervalSet, setIntervalSet] = useState(false);

  const updateActiveDevice = () => {
    getSpotifyDevices().then((data) => {
      const device = data.devices.find((dev) => dev.is_active);
      if (!device) {
        return;
      }

      setActiveDevice(device);
    });
  };

  useState(() => {
    updateActiveDevice();
    if (!activeDevice && !intervalSet) {
      const interval = setInterval(() => {
        if (setActiveDevice) {
          clearInterval(interval);
        }
        updateActiveDevice();
      }, 2500);

      setIntervalSet(true);
    }
  }, []);

  return (
    <div>
      {!activeDevice ? (
        <Alert severity="error">
          No active device found! Play a song through Spotify and refresh the
          page.
        </Alert>
      ) : null}
      <h3>Vote settings</h3>
      <TextField
        type="number"
        label="Vote session valid in minutes"
        defaultValue={5}
        onKeyDown={(e) => {
          e.preventDefault();
          return false;
        }}
        onChange={(e) => setVoteValidTimeInMinutes(Number(e.target.value))}
        style={{ minWidth: "175px" }}
        InputProps={{ inputProps: { min: 1, max: 10 } }}
      />
    </div>
  );
}
