import { List } from "@mui/icons-material";
import {
  Button,
  Divider,
  Grid,
  ListItem,
  ListItemText,
  Paper,
} from "@mui/material";
import SideNav from "components/sidenav";
import React, { useState, useEffect } from "react";
import {
  showInfo,
  showWarning,
  toastSubject,
} from "services/shared/toast-messages";

export default function Dashboard() {
  const [laser, setLaser] = useState({});

  useEffect(() => {
    const laserTelemetry = {
      connected: true,
      temperatures: {
        galvo: {
          currentTemp: 50,
          maxTemp: 60,
        },
        basePlate: {
          currentTemp: 35,
          maxTemp: 50,
        },
      },
      logs: {
        errors: [],
        warnings: [
          {
            title: "Laser not connected",
            message: "The laser is not connected to the computer",
            dateTime: "29-11-2021 16:50",
          },
        ],
      },
      settings: {
        development: {
          developmentModeEnabled: true,
        },
      },
    };

    setLaser(laserTelemetry);

    const { logs, settings } = laserTelemetry;
    if (logs?.errors?.includes || logs?.warnings?.includes) {
      showWarning(toastSubject.logsNotEmpty);
    }
    if (settings?.development?.developmentModeEnabled) {
      showInfo(toastSubject.developmentModeActive);
    }
  }, []);

  const clearLogs = () => {
    alert("Not implemented yet!");
  };

  const sideNavSettings = {
    pageName: "Dashboard",
  };

  const content = (
    <div>
      <div>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper>
              <h1>Laser status</h1>
              <p>
                {laser?.connected ? (
                  <div>
                    Connected{" "}
                    <span style={{ color: laser?.connected ? "green" : "red" }}>
                      {" "}
                      &#x25cf;
                    </span>
                  </div>
                ) : (
                  <div>
                    <span style={{ color: "red" }}> Not connected</span>
                  </div>
                )}
              </p>
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper>
              <h1>Laser settings</h1>
              <hr />
              <b>Zones</b>
              <List>
                <p>Total: 2</p>
              </List>
              <Divider />
              <b>Development</b>
              <List>
                <p>
                  Development mode enabled{" "}
                  <span style={{ color: "green", fontSize: "130%" }}>
                    {" "}
                    &#x25cf;
                  </span>
                </p>
              </List>
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper>
              <h1>Logs</h1>
              <hr />
              <b>Error</b>
              <List>
                <ListItem>
                  {laser?.logs?.errors?.map((error, index) => (
                    <ListItemText
                      key={`error-${index}`}
                      primary={error?.title}
                      secondary={`${error?.message} ${error?.dateTime}`}
                    />
                  ))}
                </ListItem>
                <Divider component="li" />
              </List>

              <b>Warnings</b>
              <List>
                <ListItem>
                  {laser?.logs?.warnings?.map((warning, index) => (
                    <ListItemText
                      key={`logs-${index}`}
                      primary={warning?.title}
                      secondary={`${warning?.message} ${warning?.dateTime}`}
                    />
                  ))}
                </ListItem>
                <Divider component="li" />
              </List>
              <Button variant="text" onClick={() => clearLogs()}>
                X Clear warnings
              </Button>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper>
              <h1>Shows</h1>
              <hr />
              <List>
                <ListItem>
                  <ListItemText primary="Total" secondary="2" />
                </ListItem>
                <Divider component="li" />
                <ListItem>
                  <ListItemText
                    primary="Test show"
                    secondary="21-07-2021 17:00"
                  />
                </ListItem>
                <Divider component="li" />
              </List>
            </Paper>
          </Grid>
        </Grid>
      </div>
    </div>
  );

  return (
    <div>
      <SideNav content={content} settings={sideNavSettings} />
    </div>
  );
}
