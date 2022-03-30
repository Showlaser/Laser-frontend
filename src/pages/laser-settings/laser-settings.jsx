import SideNav from "components/sidenav";
import React, { useState } from "react";
import Zones from "components/laser-settings/zones";
import LaserNetworkSettings from "components/laser-settings/network-settings";
import DevelopmentSettings from "components/laser-settings/development-settings";
import { Button, Divider } from "@mui/material";
import { getZonesPlaceholder } from "services/shared/zones";
import SpotifyLogin from "components/laser-settings/spotify-login";

export default function LaserSettings() {
  const [laser, setLaser] = useState({
    connected: true,
    zones: getZonesPlaceholder(),
    development: {
      developmentModeEnabled: false,
    },
  });

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
      <DevelopmentSettings
        development={laser?.development}
        callback={updateLaser}
      />
      <Divider />
      <SpotifyLogin />
      <Button variant="contained" color="primary">
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
