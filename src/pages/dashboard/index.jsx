import {
  Divider,
  Grid,
  ListItem,
  ListItemText,
  Paper,
  List,
} from "@mui/material";
import Loading from "components/shared/loading";
import SideNav from "components/sidenav";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getDashboardData } from "services/logic/dashboard-logic";

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState(undefined);
  const { laserStatus, laserSettings, logs, shows } = dashboardData ?? {};

  useEffect(() => {
    getDashboardData().then((data) => {
      setDashboardData(data);
      data?.logs
        ?.filter((l) => l.logType === "Warning")
        ?.forEach((warning) => toast.warning(warning.message));
    });
    setInterval(
      () => getDashboardData().then((data) => setDashboardData(data)),
      10000
    );
  }, []);

  const sideNavSettings = {
    pageName: "Dashboard",
  };

  const content = (
    <Loading objectToLoad={dashboardData}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper style={{ padding: "8px" }}>
            <h1>Laser status</h1>
            {laserStatus?.connected ? (
              <p>
                Connected <span style={{ color: "green" }}> &#x25cf;</span>
              </p>
            ) : (
              <p>
                <span style={{ color: "red" }}> Not connected</span>
              </p>
            )}
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper style={{ padding: "8px" }}>
            <h1>Laser settings</h1>
            <hr />
            <b>Zones</b>
            <br />
            <List>
              <p>Total: {laserSettings?.zonesLength}</p>
            </List>
            <Divider />
            <b>Development</b>
            <br />
            <List>
              {laserSettings?.developmentModeIsActive ? (
                <p>
                  {" "}
                  Development mode enabled{" "}
                  <span style={{ color: "green", fontSize: "130%" }}>
                    {" "}
                    &#x25cf;
                  </span>
                </p>
              ) : null}
            </List>
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper style={{ padding: "8px" }}>
            <h1>Logs</h1>
            <hr />
            <b>Error</b>
            <br />
            <List>
              {logs
                ?.filter((l) => l.logType === "Error")
                ?.map((error, index) => (
                  <ListItem>
                    <ListItemText
                      key={`error-${index}`}
                      primary={error?.message}
                    />
                  </ListItem>
                ))}
              <Divider component="li" />
            </List>
            <br />
            <b>Warnings</b>
            <br />
            <List>
              {logs
                ?.filter((l) => l.logType === "Warning")
                ?.map((warning, index) => (
                  <ListItem>
                    <ListItemText
                      key={`logs-${index}`}
                      primary={warning?.message}
                    />
                  </ListItem>
                ))}
              <Divider component="li" />
            </List>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper style={{ padding: "8px" }}>
            <h1>Shows</h1>
            <hr />
            <List>
              <ListItem>
                <ListItemText primary="Total" secondary={shows?.length} />
              </ListItem>
              <Divider component="li" />
              {shows?.map((show, index) => (
                <ListItem key={`${index}-show`}>
                  <ListItemText primary={show?.showName} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Loading>
  );

  return (
    <div>
      <SideNav content={content} settings={sideNavSettings} />
    </div>
  );
}
