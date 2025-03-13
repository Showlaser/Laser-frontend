import { Grid } from "@mui/material";
import "chart.js/auto";
import LaserStatusTable from "components/dashboard/laser-status-table";
import SideNav from "components/shared/sidenav";
import {
  LaserHealth,
  LaserInfo,
  LaserLog,
  LaserStatus,
} from "models/components/shared/lasers";
import React from "react";
import { subtractMinutesFromCurrentDate } from "services/shared/dateHelper";
import { getRandomNumber } from "services/shared/math";

const randomProperty = (obj: any) => {
  const keys = Object.keys(obj);
  return obj[keys[(keys.length * Math.random()) << 0]];
};

const generateFakeLogForLaser = (laserUuid: string): LaserLog[] =>
  [30, 20, 10, 0].map((time) => ({
    laserUuid,
    dateTime: subtractMinutesFromCurrentDate(time),
    temperature: getRandomNumber(65),
    health: randomProperty(LaserHealth),
  }));

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
  },
};

export const sharedTestLasers: LaserInfo[] = [
  {
    uuid: "2a1b08d4-fc2b-490a-a800-b3f5c1ffc3a5",
    name: "Laser 1",
    specs: "Model L5",
    status: LaserStatus.Emitting,
    online: true,
    logs: generateFakeLogForLaser("2a1b08d4-fc2b-490a-a800-b3f5c1ffc3a5"),
  },
  {
    uuid: "1af81219-f6b1-46b9-8f96-9c911a99e1fe",
    name: "Laser 2",
    specs: "Model L3",
    status: LaserStatus.Standby,
    online: true,
    logs: generateFakeLogForLaser("1af81219-f6b1-46b9-8f96-9c911a99e1fe"),
  },
  {
    uuid: "00b500ca-1559-4e32-bf9d-cba3e9fc73fa",
    name: "Laser 3",
    specs: "Model L3",
    status: LaserStatus.PoweredOff,
    online: false,
    logs: generateFakeLogForLaser("00b500ca-1559-4e32-bf9d-cba3e9fc73fa"),
  },
  {
    uuid: "dde06bfa-c65e-4ab1-aa2c-bd8c1c2cd316",
    name: "Laser 4",
    specs: "Model L5",
    status: LaserStatus.EmergencyButtonPressed,
    online: true,
    logs: generateFakeLogForLaser("dde06bfa-c65e-4ab1-aa2c-bd8c1c2cd316"),
  },
];

export default function Dashboard() {
  return (
    <SideNav pageName="Dashboard">
      <Grid container justifyContent="center">
        <LaserStatusTable lasers={sharedTestLasers} />
      </Grid>
    </SideNav>
  );
}
