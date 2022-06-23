import { InputLabel, MenuItem, Select } from "@mui/material";
import { useEffect } from "react";
import { useState } from "react";
import {
  getAvailableComDevices,
  getCurrentComDevice,
  setConnectionMethod,
} from "services/logic/laser-network-settings";
import { createGuid } from "services/shared/math";

export default function ConnectionMethodSettings() {
  const [selectedConnectionMethod, setSelectedConnectionMethod] =
    useState("Usb");
  const [availableComPorts, setAvailableComPorts] = useState([]);
  const [selectedComPort, setSelectedComPort] = useState(undefined);

  useEffect(() => {
    getAvailableComDevices().then((data) => setAvailableComPorts(data));
    getCurrentComDevice().then((data) => setSelectedComPort(data));
  }, [selectedComPort]);

  const onConnectionMethodChange = (e) => {
    e.preventDefault();
    setSelectedConnectionMethod(e.target.value);
    setConnectionMethod(e.target.value, selectedComPort);
  };

  const onComPortChange = (e) => {
    e.preventDefault();
    setSelectedComPort(e.target.value);
    setConnectionMethod(selectedConnectionMethod, e.target.value);
  };

  return (
    <div>
      <h2>Laser connection method</h2>
      <InputLabel id="label">Connection method</InputLabel>
      <Select
        onChange={(e) => onConnectionMethodChange(e)}
        value={selectedConnectionMethod}
      >
        <MenuItem key="usb" value="Usb">
          Usb
        </MenuItem>
        <MenuItem key="network" value="Network">
          Network
        </MenuItem>
      </Select>
      {selectedConnectionMethod === "Usb" ? (
        <div>
          <InputLabel id="label">Com port</InputLabel>
          <Select
            onChange={(e) => onComPortChange(e)}
            value={selectedComPort}
            key={createGuid()}
          >
            {availableComPorts?.map((comPort) => (
              <MenuItem key={comPort} value={comPort}>
                {comPort}
              </MenuItem>
            ))}
          </Select>
        </div>
      ) : null}
    </div>
  );
}
