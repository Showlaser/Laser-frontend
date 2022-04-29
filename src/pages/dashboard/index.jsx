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
import { stringIsEmpty } from "services/shared/general";

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState(undefined);
  const { applicationStatus, laserSettings, logs, shows } = dashboardData ?? {};

  useEffect(() => {
    getDashboardData().then((data) => {
      if (!stringIsEmpty(data?.applicationStatus?.computerIpAddress)) {
        localStorage.setItem(
          "computer-ip",
          data?.applicationStatus?.computerIpAddress
        );
      }

      setDashboardData(data);
      showMessages(data);
    });
    setInterval(
      () => getDashboardData().then((data) => setDashboardData(data)),
      4000
    );
  }, []);

  const showMessages = (data) => {
    data?.logs
      ?.filter((l) => l.logType === "Warning")
      ?.forEach((warning) => toast.warning(warning.message));
    data?.logs
      ?.filter((l) => l.logType === "Info")
      ?.forEach((info) => toast.info(info.message));
  };

  const sideNavSettings = {
    pageName: "Dashboard",
  };

  const content = (
    <Loading objectToLoad={dashboardData}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper style={{ padding: "8px" }}>
            <h1>Application status</h1>
            <hr />
            <List>
              <b>Laser connection status</b>
              <ListItem>
                <ListItemText
                  primary={
                    applicationStatus?.laserConnected ? (
                      <span>
                        Laser connected{" "}
                        <span style={{ color: "green" }}> &#x25cf;</span>
                      </span>
                    ) : (
                      <span>
                        <span style={{ color: "red" }}>
                          Laser is not connected, set the connection in the
                          settings page
                        </span>
                      </span>
                    )
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary={`Computer ip: ${applicationStatus?.computerIpAddress}`}
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper style={{ padding: "8px" }}>
            <h1>Laser settings</h1>
            <hr />
            <List>
              <b>Zones</b>
              <ListItem>
                <ListItemText
                  primary={`Total: ${laserSettings?.zonesLength}`}
                />
              </ListItem>
            </List>
            <Divider />
            <List>
              <b>Development</b>
              <ListItem>
                <ListItemText
                  primary={
                    laserSettings?.developmentModeIsActive ? (
                      <span>
                        {" "}
                        Development mode enabled{" "}
                        <span style={{ color: "green", fontSize: "130%" }}>
                          {" "}
                          &#x25cf;
                        </span>
                      </span>
                    ) : null
                  }
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper style={{ padding: "8px" }}>
            <h1>Logs</h1>
            <hr />
            <List>
              <b>Errors</b>
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
            </List>
            <Divider />
            <List>
              <b>Warnings</b>
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
            </List>
            <Divider />
            <List>
              <b>Info</b>
              {logs
                ?.filter((l) => l.logType === "Info")
                ?.map((info, index) => (
                  <ListItem>
                    <ListItemText
                      key={`logs-${index}`}
                      primary={info?.message}
                    />
                  </ListItem>
                ))}
            </List>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper style={{ padding: "8px" }}>
            <h1>Shows</h1>
            <hr />
            <List>
              <b>Total</b>
              <ListItem>
                <ListItemText primary={shows?.length} />
              </ListItem>
            </List>
            <Divider />
            <List>
              <b>Show names</b>
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
