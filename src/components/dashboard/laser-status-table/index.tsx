import CircleIcon from "@mui/icons-material/Circle";
import { Card, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { LaserStatus, RegisteredLaser } from "models/components/shared/registered-laser";

export type LaserStatusTableProps = {
  registeredLasers: RegisteredLaser[];
};

export default function LaserStatusTable({ registeredLasers }: LaserStatusTableProps) {
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
              <TableCell>Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Health</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {registeredLasers?.map((laser, index) => (
              <TableRow key={laser.uuid}>
                <TableCell>
                  <span>{index + 1}</span>
                </TableCell>
                <TableCell>
                  <span>{laser.name}</span>
                </TableCell>
                <TableCell>
                  <span>{laser.modelType}</span>
                </TableCell>
                <TableCell>
                  <span>{laser.status}</span>
                </TableCell>
                <TableCell align="center">
                  <CircleIcon
                    fontSize="small"
                    style={{
                      color:
                        laser.status === LaserStatus.Standby ||
                        laser.status === LaserStatus.Emitting
                          ? "rgba(72, 219, 104, 0.8)"
                          : "rgba(255, 0, 0, 0.9)",
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
