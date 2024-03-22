import { Grid } from "@mui/material";
import SafetyZonesAddOrUpdate from "components/safety-zone";
import PointsDrawer from "components/shared/points-drawer";
import SideNav from "components/shared/sidenav";
import { Point } from "models/components/shared/point";
import { SafetyZone, SafetyZonePoint } from "models/components/shared/safety-zone";
import React, { useEffect } from "react";
import { getSafetyZones } from "services/logic/zone-logic";
import { convertPointsToCanvasSize } from "services/shared/converters";

export default function SafetyZones() {
  const [zones, setZones] = React.useState<SafetyZone[]>([]);
  const [selectedSafetyZoneUuid, setSelectedSafetyZoneUuid] = React.useState<string | null>(null);
  const [visibleSafetyZoneUuids, setVisibleSafetyZoneUuids] = React.useState<string[]>([]);
  const [unsavedChanges, setUnsavedChanges] = React.useState<boolean>(false);

  useEffect(() => {
    if (zones.length === 0) {
      getSafetyZones().then((value: SafetyZone[]) => {
        let sortedSafetyZones = [...value];
        sortedSafetyZones.forEach((safetyZone) => {
          safetyZone.points.sort((a, b) => (a.orderNr > b.orderNr ? 1 : -1));
        });

        setZones(sortedSafetyZones);
      });
    }
  }, []);

  const mapSafetyZonePointsToPatternPoints = () => {
    let pointsToRender: Point[] = [];
    const selectedZones = zones.filter((z) => visibleSafetyZoneUuids.some((sszu) => sszu === z.uuid));

    selectedZones.forEach((selectedSafetyZone) => {
      const points = selectedSafetyZone.points.map((p: SafetyZonePoint, index: number) => {
        let connectedToPointOrderNr = pointsToRender.length;
        if (selectedSafetyZone.points.length > index && index > 1) {
          connectedToPointOrderNr = pointsToRender.length + p.orderNr - 1;
        }

        let point: Point = {
          uuid: p.uuid,
          patternUuid: "",
          redLaserPowerPwm: 255,
          greenLaserPowerPwm: 255,
          blueLaserPowerPwm: 255,
          connectedToPointOrderNr,
          orderNr: p.orderNr,
          x: p.x,
          y: p.y,
        };

        return point;
      });

      pointsToRender = pointsToRender.concat(convertPointsToCanvasSize(points));
    });

    return pointsToRender;
  };

  const setZoneWrapper = (zones: SafetyZone[]) => {
    setZones(zones);
    setUnsavedChanges(true);
  };

  const sectionProps = {
    zones,
    setZones: setZoneWrapper,
    selectedSafetyZoneUuid,
    setSelectedSafetyZoneUuid,
    visibleSafetyZoneUuids,
    setVisibleSafetyZoneUuids,
    setUnsavedChanges,
  };

  return (
    <SideNav pageName="Safety zones" unsavedChanges={unsavedChanges}>
      <Grid style={{ outline: "none" }} container spacing={2}>
        <Grid item style={{ minWidth: "55vh" }}>
          <SafetyZonesAddOrUpdate {...sectionProps} />
        </Grid>
        <Grid item sx={{ marginLeft: "40px" }}>
          <PointsDrawer pointsToDraw={mapSafetyZonePointsToPatternPoints()} />
        </Grid>
      </Grid>
    </SideNav>
  );
}
