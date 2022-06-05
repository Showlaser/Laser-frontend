import React, { useEffect, useState } from "react";
import Zones from "components/laser-settings/zones";
import LaserNetworkSettings from "components/laser-settings/network-settings";
import { Divider } from "@mui/material";
import SpotifyLogin from "components/laser-settings/spotify-login";
import Loading from "components/shared/loading";
import { getZones } from "services/logic/zone-logic";
import { emptyGuid } from "services/shared/math";
import SideNav from "components/shared/sidenav";
import LasershowGeneratorSettings from "components/laser-settings/lasershow-generator-settings";

export default function LaserSettings() {
  const [zones, setZones] = useState();
  const [selectedZoneUuid, setSelectedZoneUuid] = useState(emptyGuid());

  useEffect(() => {
    getZones().then((data) => {
      setZones(data);
      setSelectedZoneUuid(data[0]?.uuid ?? emptyGuid());
    });
  }, []);

  const sideNavSettings = {
    pageName: "Laser settings",
  };

  const content = (
    <Loading objectToLoad={zones}>
      <LaserNetworkSettings />
      <Divider />
      <Zones
        zones={zones}
        setZones={setZones}
        selectedZoneUuid={selectedZoneUuid}
        setSelectedZoneUuid={setSelectedZoneUuid}
      />
      <Divider />
      <SpotifyLogin />
      <Divider />
      <LasershowGeneratorSettings />
    </Loading>
  );

  return (
    <div style={{ marginBottom: "75px" }}>
      <SideNav content={content} settings={sideNavSettings} />
    </div>
  );
}
