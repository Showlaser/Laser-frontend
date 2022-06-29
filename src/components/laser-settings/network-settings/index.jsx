import { Button, MenuItem, Select, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import {
  getAvailableComDevices,
  setSettings,
} from "services/logic/laser-network-settings";

export default function LaserNetworkSettings() {
  const [availableComPorts, setAvailableComPorts] = useState([]);
  const [selectedComPortId, setSelectedComPortId] = useState(0);

  useEffect(() => {
    getAvailableComDevices().then((data) => setAvailableComPorts(data));
  }, []);

  const validateIp = (ip) => {
    if (
      /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
        ip
      )
    ) {
      return true;
    }
    return false;
  };

  const onIpChange = (ip) => {
    if (!validateIp(ip)) {
      return;
    }
  };

  return (
    <div>
      <h2>Laser network</h2>
      <small>Computer ip address</small>
      <br />
      <TextField
        placeholder="This computer ip address"
        defaultValue={localStorage.getItem("computer-ip")}
        onChange={(e) => onIpChange(e.target.value)}
      />
      <br />
      <small>Server com port</small>
      <br />
      <Select
        onChange={(e) => setSelectedComPortId(e.target.value)}
        value={selectedComPortId ?? 0}
      >
        {availableComPorts?.map((comPort, index) => (
          <MenuItem key={`${index}-comport`} value={index}>
            {comPort}
          </MenuItem>
        ))}
      </Select>
      <br />
      <Button
        variant="contained"
        style={{ margin: "5px 0 5px 0" }}
        onClick={() =>
          setSettings(
            localStorage.getItem("computer-ip"),
            availableComPorts[selectedComPortId]
          )
        }
      >
        Set server ip on laser
      </Button>
    </div>
  );
}
