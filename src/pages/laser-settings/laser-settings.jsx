import { Divider } from "@material-ui/core";
import SideNav from "components/sidenav";
import React, { useState } from "react";
import Zones from "components/laser-settings/zones";
import TemperatureSettings from "components/laser-settings/temperature";

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

  const [, updateState] = React.useState();
  const forceUpdate = React.useCallback(() => updateState({}), []);

  const sideNavSettings = {
    pageName: "Laser settings",
  };

  const updateLaser = (value, propertyName) => {
    let updatedLaser = laser;
    laser[propertyName] = value;
    setLaser(updatedLaser);
    forceUpdate();
  };

  const content = (
    <div>
      <Zones zones={laser?.zones} callback={updateLaser} />
      <Divider />
      <TemperatureSettings
        temperatures={laser?.temperatures}
        callback={updateLaser}
      />
    </div>
  );

  return (
    <div>
      <SideNav content={content} settings={sideNavSettings} />
    </div>
  );
}
