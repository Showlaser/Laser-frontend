import { Grid, Paper } from "@mui/material";
import SafetyZonesAddOrUpdate from "components/safety-zone/tabs/add-update";
import SideNav from "components/shared/sidenav";
import TabSelector, { TabSelectorData } from "components/tabs";
import { SafetyZone } from "models/components/shared/safety-zone";
import React from "react";

export default function SafetyZones() {
  const [selectedTabId, setSelectedTabId] = React.useState<number>(0);
  const [zones, setZones] = React.useState<SafetyZone[]>([]);
  const [selectedSafetyZoneUuid, setSelectedSafetyZoneUuid] = React.useState<string | null>(null);

  const sectionProps = {
    zones,
    setZones,
    selectedSafetyZoneUuid,
    setSelectedSafetyZoneUuid,
  };

  const tabSelectorData: TabSelectorData[] = [
    {
      tabName: "Add/Update zone",
      tabChildren: <SafetyZonesAddOrUpdate {...sectionProps} />,
    },
  ];

  return (
    <SideNav pageName="Safety zones">
      <Grid style={{ outline: "none" }} container tabIndex={0} direction="row" spacing={2}>
        <Grid item xs={5}>
          <Paper>
            <TabSelector data={tabSelectorData} selectedTabId={selectedTabId} setSelectedTabId={setSelectedTabId} />
          </Paper>
        </Grid>
        <Grid item sx={{ marginLeft: "40px" }}>
          {"<PointsDrawer />"}
        </Grid>
      </Grid>
    </SideNav>
  );
}
