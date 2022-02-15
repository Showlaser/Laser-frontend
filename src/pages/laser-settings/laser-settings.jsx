import { Button, Divider, makeStyles } from "@material-ui/core";
import SideNav from "components/sidenav";
import React, { useState } from "react";
import Zones from "components/laser-settings/zones";
import LaserNetworkSettings from "components/laser-settings/network-settings";
import DevelopmentSettings from "components/laser-settings/development-settings";

export default function LaserSettings() {
  const [laser, setLaser] = useState({
    connected: true,
    zones: [
      {
        points: [
          {
            x: -4000,
            y: 0,
          },
          {
            x: 4000,
            y: 0,
          },
          {
            x: 4000,
            y: -4000,
          },
          {
            x: -4000,
            y: -4000,
          },
        ],
        maxPowerPwm: 3,
      },
    ],
    development: {
      developmentModeEnabled: false,
    },
  });

  const useStyles = makeStyles((theme) => ({
    saveButton: {
      marginTop: "15px",
      width: "20%",
    },
  }));

  const classes = useStyles();

  const sideNavSettings = {
    pageName: "Laser settings",
  };

  const updateLaser = (value, propertyName) => {
    let updatedLaser = laser;
    laser[propertyName] = value;
    setLaser(updatedLaser);
  };

  const content = (
    <div>
      <LaserNetworkSettings network={laser?.network} callback={updateLaser} />
      <Divider />
      <Zones zones={laser?.zones} callback={updateLaser} />
      <Divider />
      <Divider />
      <DevelopmentSettings
        development={laser?.development}
        callback={updateLaser}
      />
      <Divider />
      <Button
        variant="contained"
        color="primary"
        className={classes.saveButton}
      >
        Save settings
      </Button>
    </div>
  );

  return (
    <div>
      <SideNav content={content} settings={sideNavSettings} />
    </div>
  );
}
