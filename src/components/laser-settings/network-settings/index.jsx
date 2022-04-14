import { Button, MenuItem, Select, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { getAvailableComDevices } from "services/logic/laser-network-settings";

export default function LaserNetworkSettings() {
  const [availableComPorts, setAvailableComPorts] = useState([]);
  const [selectedComPortId, setSelectedComPortId] = useState();

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
          <MenuItem value={index}>{comPort}</MenuItem>
        ))}
      </Select>
      <br />
      <Button style={{ margin: "5px 0 5px 0" }}>Set server ip on laser</Button>
    </div>
  );
}
