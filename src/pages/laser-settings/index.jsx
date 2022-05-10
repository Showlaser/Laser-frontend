import React, { useEffect, useState } from "react";
import Zones from "components/laser-settings/zones";
import LaserNetworkSettings from "components/laser-settings/network-settings";
import DevelopmentSettings from "components/laser-settings/development-settings";
import { Button, Divider } from "@mui/material";
import SpotifyLogin from "components/laser-settings/spotify-login";
import Loading from "components/shared/loading";
import { getZones } from "services/logic/zone-logic";
import { emptyGuid } from "services/shared/math";
import { deepClone } from "services/shared/general";
import SideNav from "components/shared/sidenav";

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
      <DevelopmentSettings
        developmentZone={zones?.find(
          (zone) =>
            zone?.points?.length === 4 && zone?.maxLaserPowerInZonePwm === 20
        )}
        onDevelopmentModeActive={(developmentZone) => {
          let zonesToUpdate = deepClone(zones);
          zonesToUpdate.push(developmentZone);
          setZones(zonesToUpdate);
        }}
        onDevelopmentModeInactive={(developmentZoneUuid) => {
          let zonesToUpdate = deepClone(zones);
          const developmentZoneIndex = zonesToUpdate.indexOf(
            (z) => z.uuid === developmentZoneUuid
          );
          if (developmentZoneIndex === -1) {
            return;
          }

          zonesToUpdate.splice(developmentZoneIndex, 1);
          setZones(zonesToUpdate);
        }}
      />
      <Divider />
      <SpotifyLogin />
    </Loading>
  );

  return (
    <div>
      <SideNav content={content} settings={sideNavSettings} />
    </div>
  );
}
