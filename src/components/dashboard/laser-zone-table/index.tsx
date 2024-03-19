import { Card, Typography, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { SafetyZone } from "models/components/shared/safety-zone";
import React from "react";
import CircleIcon from "@mui/icons-material/Circle";

type Props = {
  zones: SafetyZone[];
};

export default function LaserZoneTable({ zones }: Props) {
  return (
    <Card sx={{ m: 2, p: 3 }}>
      <Typography sx={{ textAlign: "center" }} variant="h5" color="text.primary" gutterBottom>
        Zones
      </Typography>
      <div style={{ height: "90%", overflowY: "auto" }}>
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
      </div>
    </Card>
  );
}
