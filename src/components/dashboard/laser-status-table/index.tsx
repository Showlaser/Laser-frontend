import { TableRow, TableCell, Tooltip, Card, Typography, Table, TableHead, TableBody } from "@mui/material";
import React from "react";
import CircleIcon from "@mui/icons-material/Circle";
import { LaserInfo } from "models/components/shared/lasers";

type Props = {
  lasers: LaserInfo[];
};

export default function LaserStatusTable({ lasers }: Props) {
  return (
    <Card sx={{ m: 2, p: 3 }}>
      <Typography sx={{ textAlign: "center" }} variant="h5" color="text.primary" gutterBottom>
        Lasers status
      </Typography>
      <div style={{ height: "90%", overflowY: "auto" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Specs</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Online</TableCell>
              <TableCell>Health</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {lasers.map((laser) => (
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
                <TableCell>
                  <span>
                    {
                      laser.logs.find((log) => log.dateTime.toLocaleTimeString() === new Date().toLocaleTimeString())
                        ?.health
                    }
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
