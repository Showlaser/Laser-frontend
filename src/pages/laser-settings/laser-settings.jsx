import SideNav from "components/sidenav";
import React, { useState } from "react";
import Zones from "components/laser-settings/zones";
import LaserNetworkSettings from "components/laser-settings/network-settings";
import DevelopmentSettings from "components/laser-settings/development-settings";
import { Button, Divider } from "@mui/material";
import SpotifyLogin from "components/laser-settings/spotify-login";
import Loading from "components/shared/loading";

export default function LaserSettings() {
  const [zones, setZones] = useState();

  const sideNavSettings = {
    pageName: "Laser settings",
  };

  const content = (
    <Loading objectToLoad={zones}>
      <LaserNetworkSettings />
      <Divider />
      <Zones onDataAvailable={setZones} />
      <Divider />
      <DevelopmentSettings development={{}} />
      <Divider />
      <SpotifyLogin />
      <Button variant="contained" color="primary">
        Save settings
      </Button>
    </Loading>
  );

  return (
    <div>
      <SideNav content={content} settings={sideNavSettings} />
    </div>
  );
}
