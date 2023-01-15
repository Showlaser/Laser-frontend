import { Card, Grid, Typography } from "@mui/material";
import LaserStatusTable from "components/dashboard/laser-status-table";
import LaserZoneTable from "components/dashboard/laser-zone-table";
import SideNav from "components/shared/sidenav";
import TabSelector, { TabSelectorData } from "components/tabs";
import { LaserHealth, LaserInfo, LaserLog, LaserStatus } from "models/components/shared/lasers";
import React from "react";
import "chart.js/auto";
import { Doughnut, Line } from "react-chartjs-2";
import { getRandomNumber } from "services/shared/math";
import { subtractMinutesFromCurrentDate } from "services/shared/dateHelper";

export default function Dashboard() {
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

  const testLasers: LaserInfo[] = [
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

  const zones = [
    { uuid: "9cbb621d-2236-462f-9c5c-ef518864748f", name: "Zone 1", enabled: true },
    { uuid: "37dd16de-8335-485f-981b-322238349914", name: "Zone 2", enabled: true },
    { uuid: "b09a23b1-0b5b-4997-955b-50d733a8f3a9", name: "Zone 3", enabled: false },
    { uuid: "8a8892c0-d571-4628-8621-5661cbf8aae7", name: "Zone 4", enabled: true },
  ];

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
  };

  const getRandomColor = () => `${getRandomNumber(255)}, ${getRandomNumber(255)}, ${getRandomNumber(255)}`;

  const colors = ["72, 92, 219", "15, 184, 60", "209, 33, 21", "252, 186, 3", "0, 255, 255"];

  const getFilteredAndSortedLogsFromLaser = (laser: LaserInfo, labels: string[]) => {
    const { logs } = laser;
    const filteredLogs = logs.filter((log) => labels.includes(log.dateTime.toLocaleTimeString()));
    return [...filteredLogs].sort((a: LaserLog, b: LaserLog) => a.dateTime.getTime() - b.dateTime.getTime());
  };

  const labels = [30, 20, 10, 0].map((time) => subtractMinutesFromCurrentDate(time).toLocaleTimeString());
  const temperatureChartData = {
    labels,
    datasets: testLasers.map((laser, index) => {
      const rgbValues = colors[index] ?? getRandomColor();
      return {
        label: laser?.name,
        data: getFilteredAndSortedLogsFromLaser(laser, labels).map((log) => log.temperature),
        backgroundColor: `rgba(${rgbValues}, 0.1)`,
        borderColor: `rgba(${rgbValues}, 1)`,
        fill: true,
      };
    }),
  };

  const onlineChartData = {
    labels: ["Online", "Offline"],
    datasets: [
      {
        data: [testLasers.filter((laser) => laser.online).length, testLasers.filter((laser) => !laser.online).length],
        backgroundColor: [`rgba(${colors[0]}, 0.2)`, `rgba(${colors[2]}, 0.2)`],
        borderColor: [`rgba(${colors[0]}, 1)`, `rgba(${colors[2]}, 1)`],
        borderWidth: 1,
      },
    ],
  };

  const healthChartData = () => {
    const mergedLogs = testLasers.map((laser) => laser.logs).flat();
    const currentTimeLogs = mergedLogs.filter(
      (log) => log.dateTime.toLocaleTimeString() === new Date().toLocaleTimeString()
    );
    const currentHealthOfLasers = currentTimeLogs.map((log) => log.health);

    const labels = [LaserHealth.Ok, LaserHealth.DefectGalvo, LaserHealth.Overheating, LaserHealth.Unknown];
    const data = labels.map((label) => currentHealthOfLasers?.filter((health) => health === label).length);
    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor: [
            `rgba(${colors[0]}, 0.2)`,
            `rgba(${colors[1]}, 0.2)`,
            `rgba(${colors[2]}, 0.2)`,
            `rgba(${colors[3]}, 0.2)`,
          ],
          borderColor: [
            `rgba(${colors[0]}, 1)`,
            `rgba(${colors[1]}, 1)`,
            `rgba(${colors[2]}, 1)`,
            `rgba(${colors[3]}, 1)`,
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  const tabData: TabSelectorData[] = [
    {
      tabName: "Temperatures",
      tabChildren: <Line options={chartOptions} data={temperatureChartData} />,
    },
    {
      tabName: "Online",
      tabChildren: <Doughnut data={onlineChartData} />,
    },
    {
      tabName: "Health",
      tabChildren: <Doughnut data={healthChartData()} />,
    },
  ];

  return (
    <SideNav pageName="Dashboard">
      <Grid container justifyContent="center">
        <LaserStatusTable lasers={testLasers} />
        <Card sx={{ m: 2, p: 3, width: "60vh" }}>
          <Typography sx={{ textAlign: "center" }} variant="h5" color="text.primary" gutterBottom>
            Lasers info
          </Typography>
          <TabSelector data={tabData} />
        </Card>
        <LaserZoneTable zones={zones} />
      </Grid>
    </SideNav>
  );
}
