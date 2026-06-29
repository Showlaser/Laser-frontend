import { Grid, Skeleton } from "@mui/material";
import "chart.js/auto";
import LaserStatusTable from "components/dashboard/laser-status-table";
import SideNav from "components/shared/sidenav";
import { RegisteredLaser } from "models/components/shared/registered-laser";
import { useEffect, useState } from "react";
import { getRegisteredLasers } from "services/logic/showlaser-manager";

export default function Dashboard() {
  const [registeredLasers, setRegisteredLasers] = useState<RegisteredLaser[] | null>(null);

  useEffect(() => {
    const fetchStatus = () => {
      getRegisteredLasers().then((registered) => {
        if (registered !== undefined) {
          setRegisteredLasers(registered);
        }
      });
    };

    fetchStatus();
    const intervalId = setInterval(fetchStatus, 30000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <SideNav pageName="Dashboard">
      <Grid container sx={{ justifyContent: "center" }}>
        {registeredLasers === null ? (
          <Skeleton animation="wave" variant="rectangular" width={500} height={282.5} />
        ) : (
          <LaserStatusTable registeredLasers={registeredLasers} />
        )}
      </Grid>
    </SideNav>
  );
}
