import { Button, Card, Divider, Grid, Table, TableCell, TableHead, TableRow, Tooltip, Typography } from "@mui/material";
import SideNav from "components/shared/sidenav";
import React from "react";
import CircleIcon from "@mui/icons-material/Circle";

export default function Dashboard() {
  const testLasers = [
    { name: "Laser 1", specs: "Model L5", status: "Emitting", online: true },
    { name: "Laser 2", specs: "Model L3", status: "Standby", online: true },
    { name: "Laser 3", specs: "Model L3", status: "Powered off", online: false },
    { name: "Laser 4", specs: "Model L5", status: "Emergency button pressed", online: true },
  ];

  const zones = [
    { name: "Zone 1", enabled: true },
    { name: "Zone 2", enabled: true },
    { name: "Zone 3", enabled: false },
    { name: "Zone 4", enabled: true },
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
              {testLasers.map((laser) => (
                <TableRow>
                  <TableCell>{laser.name}</TableCell>
                  <TableCell>{laser.specs}</TableCell>
                  <TableCell>{laser.status}</TableCell>
                  <TableCell align="center">
                    <Tooltip title={`Laser is ${laser.online ? "online" : "offline"}`}>
                      <CircleIcon fontSize="small" style={{ color: laser.online ? "#4262ca" : "red" }} />
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
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
              {zones.map((zone) => (
                <TableRow>
                  <TableCell>{zone.name}</TableCell>
                  <TableCell>{zone.enabled}</TableCell>
                  <TableCell align="center">
                    <CircleIcon fontSize="small" style={{ color: zone.enabled ? "#4262ca" : "red" }} />
                  </TableCell>
                </TableRow>
              ))}
            </Table>
          </Card>
        </Grid>
      </>
    </SideNav>
  );
}
