import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { SafetyZone } from "models/components/shared/safety-zone";
import React from "react";

type Props = {
  zones: SafetyZone[];
};

export default function LaserZoneTable({ zones }: Props) {
  return (
    <Card sx={{ m: 2, p: 3 }}>
      <Typography
        sx={{ textAlign: "center" }}
        variant="h5"
        color="text.primary"
        gutterBottom
      >
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
