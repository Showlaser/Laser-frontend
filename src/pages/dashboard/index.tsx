import {
  Card,
  Divider,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import SideNav from "components/shared/sidenav";
import React from "react";
import CircleIcon from "@mui/icons-material/Circle";

export default function Dashboard() {
  const testLasers = [
    {
      uuid: "2a1b08d4-fc2b-490a-a800-b3f5c1ffc3a5",
      name: "Laser 1",
      specs: "Model L5",
      status: "Emitting",
      online: true,
    },
    {
      uuid: "1af81219-f6b1-46b9-8f96-9c911a99e1fe",
      name: "Laser 2",
      specs: "Model L3",
      status: "Standby",
      online: true,
    },
    {
      uuid: "00b500ca-1559-4e32-bf9d-cba3e9fc73fa",
      name: "Laser 3",
      specs: "Model L3",
      status: "Powered off",
      online: false,
    },
    {
      uuid: "dde06bfa-c65e-4ab1-aa2c-bd8c1c2cd316",
      name: "Laser 4",
      specs: "Model L5",
      status: "Emergency button pressed",
      online: true,
    },
  ];

  const zones = [
    { uuid: "9cbb621d-2236-462f-9c5c-ef518864748f", name: "Zone 1", enabled: true },
    { uuid: "37dd16de-8335-485f-981b-322238349914", name: "Zone 2", enabled: true },
    { uuid: "b09a23b1-0b5b-4997-955b-50d733a8f3a9", name: "Zone 3", enabled: false },
    { uuid: "8a8892c0-d571-4628-8621-5661cbf8aae7", name: "Zone 4", enabled: true },
  ];

  return (
    <SideNav pageName="Dashboard">
      <>
        <Grid container justifyContent="center">
          <Card sx={{ m: 2, p: 3 }}>
            <Typography sx={{ textAlign: "center" }} variant="h5" color="text.primary" gutterBottom>
              Lasers status
            </Typography>
            <Divider />
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>Specs</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Online</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {testLasers.map((laser) => (
                  <TableRow key={laser.uuid}>
                    <TableCell>
                      <span>{laser.name}</span>
                    </TableCell>
                    <TableCell>
                      <span>{laser.specs}</span>
                    </TableCell>
                    <TableCell>
                      <span>{laser.status}</span>
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title={`Laser is ${laser.online ? "online" : "offline"}`}>
                        <CircleIcon fontSize="small" style={{ color: laser.online ? "#4262ca" : "red" }} />
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
          <Card sx={{ m: 2, p: 3 }}>
            <Typography sx={{ textAlign: "center" }} variant="h5" color="text.primary" gutterBottom>
              Zones
            </Typography>
            <Divider />
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>Enabled</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {zones.map((zone) => (
                  <TableRow key={zone.uuid}>
                    <TableCell>
                      <span>{zone.name}</span>
                    </TableCell>
                    <TableCell>
                      <span>{zone.enabled}</span>
                    </TableCell>
                    <TableCell align="center">
                      <CircleIcon fontSize="small" style={{ color: zone.enabled ? "#4262ca" : "red" }} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </Grid>
      </>
    </SideNav>
  );
}
