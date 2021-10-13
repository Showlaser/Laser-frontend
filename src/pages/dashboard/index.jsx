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
      textAlign: "center",
      color: theme.palette.text.secondary,
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
                    <span style={{ color: "green" }}>Connected</span>
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
                <ListItem>
                  <ListItemText primary="Combined" secondary="5000mW (100%)" />
                </ListItem>
                <Divider component="li" />
                <ListItem>
                  <ListItemText primary="Red" secondary="1000mW (100%)" />
                </ListItem>
                <Divider component="li" />
                <ListItem>
                  <ListItemText primary="Green" secondary="1000mW (100%)" />
                </ListItem>
                <Divider component="li" />
                <ListItem>
                  <ListItemText primary="Blue" secondary="3000mW (100%)" />
                </ListItem>
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
                    secondary="Galvo reached 60 degrees"
                  />
                </ListItem>
                <Divider component="li" />
              </List>

              <b>Warnings</b>
              <List className={classes.root}>
                <ListItem>
                  <ListItemText
                    primary="Laser not connected"
                    secondary="The laser is not connected to the computer"
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
