import { TextField } from "@mui/material";

export default function LaserNetworkSettings(props) {
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

    let updatedNetwork = props?.network;
    updatedNetwork.ipAddress = ip;
    props.callback(updatedNetwork, "network");
  };

  return (
    <div>
      <h2>Network</h2>
      <small>Laser ip address</small>
      <br />
      <TextField
        placeholder="192.168.1.120"
        onChange={(e) => onIpChange(e.target.value)}
      />
    </div>
  );
}
