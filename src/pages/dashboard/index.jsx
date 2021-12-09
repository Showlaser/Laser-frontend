import SideNav from "components/sidenav";
import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import { LinearProgress } from "@material-ui/core";
import { normalise } from "services/shared/math";
import LaserCommunicator from "services/shared/laser-communicator";
import {
  showInfo,
  showWarning,
  toastSubject,
} from "services/shared/toast-messages";

export default function Dashboard() {
  const [laser, setLaser] = useState({});

  useEffect(() => {
    LaserCommunicator();
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
        errors: [
          {
            title: "Overheating",
            message: "Galvo reached 60 degrees",
            dateTime: "29-11-2021 17:00",
          },
        ],
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
      showWarning(toastSubject.LogsNotEmpty);
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

  const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: "left",
    },
    statusDot: {
      fontSize: "130%",
    },
  }));

  const classes = useStyles();
  const setTempColor = (current, max) =>
    max - current > 10 ? "primary" : "secondary";

  const content = (
    <div>
      <div className={classes.root}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <h1>Laser status</h1>
              <p>
                {laser?.connected ? (
                  <div>
                    Connected{" "}
                    <span
                      className={classes.statusDot}
                      style={{ color: laser?.connected ? "green" : "red" }}
                    >
                      {" "}
                      &#x25cf;
                    </span>
                    <hr />
                    <b>Temperature</b>
                    <br />
                    <small>
                      Galvo {laser?.temperatures?.galvo?.currentTemp}°
                    </small>
                    <LinearProgress
                      color={setTempColor(
                        laser?.temperatures?.galvo?.currentTemp,
                        laser?.temperatures?.galvo?.maxTemp
                      )}
                      variant="determinate"
                      value={normalise(
                        laser?.temperatures?.galvo?.currentTemp,
                        0,
                        laser?.temperatures?.galvo?.maxTemp
                      )}
                    />
                    <small>
                      Base plate {laser?.temperatures?.basePlate?.currentTemp}°
                    </small>
                    <LinearProgress
                      color={setTempColor(
                        laser?.temperatures?.basePlate?.currentTemp,
                        laser?.temperatures?.basePlate?.maxTemp
                      )}
                      variant="determinate"
                      value={normalise(
                        laser?.temperatures?.basePlate?.currentTemp,
                        0,
                        laser?.temperatures?.basePlate?.maxTemp
                      )}
                    />
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
            <Paper className={classes.paper}>
              <h1>Laser settings</h1>
              <hr />
              <b>Zones</b>
              <List className={classes.root}>
                <text>Total: 2</text>
              </List>
              <Divider />
              <b>Development</b>
              <List className={classes.root}>
                <text>
                  Development mode enabled{" "}
                  <span style={{ color: "green", fontSize: "130%" }}>
                    {" "}
                    &#x25cf;
                  </span>
                </text>
              </List>
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper className={classes.paper}>
              <h1>Logs</h1>
              <hr />
              <b>Error</b>
              <List className={classes.root}>
                <ListItem>
                  {laser?.logs?.errors?.map((error) => (
                    <ListItemText
                      primary={error?.title}
                      secondary={`${error?.message} ${error?.dateTime}`}
                    />
                  ))}
                </ListItem>
                <Divider component="li" />
              </List>

              <b>Warnings</b>
              <List className={classes.root}>
                <ListItem>
                  {laser?.logs?.warnings?.map((warning) => (
                    <ListItemText
                      primary={warning?.title}
                      secondary={`${warning?.message} ${warning?.dateTime}`}
                    />
                  ))}
                </ListItem>
                <Divider component="li" />
              </List>
              <Button variant="text" onClick={() => clearLogs()}>
                X Clear logs
              </Button>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <h1>Shows</h1>
              <hr />
              <List className={classes.root}>
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
