import SideNav from "components/sidenav";
import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import { LinearProgress } from "@material-ui/core";
import { normalise } from "services/shared/math";
import LaserCommunicator from "services/shared/laser-communicator";

export default function Dashboard() {
  const [laser, setLaser] = useState({});

  useEffect(() => {
    LaserCommunicator();
    setLaser({
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
    });
  }, []);

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
                    <span style={{ color: "#3f51b5", fontSize: "130%" }}>
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
              <b>Max power</b>
              <List className={classes.root}>
                <small>Total {100}%</small>
                <LinearProgress
                  color="primary"
                  variant="determinate"
                  value={100}
                />
                <br />
                <small>Red {100}%</small>
                <LinearProgress
                  color="primary"
                  variant="determinate"
                  value={100}
                />
                <br />
                <small>Green {100}%</small>
                <LinearProgress
                  color="primary"
                  variant="determinate"
                  value={100}
                />
                <br />
                <small>Blue {100}%</small>
                <LinearProgress
                  color="primary"
                  variant="determinate"
                  value={100}
                />
              </List>
              <hr />
              <b>Other</b>
              <List className={classes.root}>
                <ListItem>
                  <ListItemText primary="Zones" secondary="Configured" />
                </ListItem>
                <Divider component="li" />
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
                  <ListItemText
                    primary="Overheating"
                    secondary="Galvo reached 60 degrees 29-11-2021 17:00"
                  />
                </ListItem>
                <Divider component="li" />
              </List>

              <b>Warnings</b>
              <List className={classes.root}>
                <ListItem>
                  <ListItemText
                    primary="Laser not connected"
                    secondary="The laser is not connected to the computer 29-11-2021 16:50"
                  />
                </ListItem>
                <Divider component="li" />
              </List>
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
