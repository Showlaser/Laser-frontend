import { Button, FormControl, FormLabel, Grid, List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import SelectList from "components/select-list";
import PointsDrawer from "components/shared/points-drawer";
import { SafetyZonesSectionProps } from "models/components/shared/safety-zones";
import React from "react";

export default function SafetyZonesAddOrUpdate({
  zones,
  setZones,
  selectedSafetyZoneUuid,
  setSelectedSafetyZoneUuid,
}: SafetyZonesSectionProps) {
  const [selectedSafetyZoneUuids, setSelectedSafetyZoneUuids] = React.useState<string[]>([]);

  return (
    <>
      <FormControl fullWidth>
        <FormLabel>Safety zones</FormLabel>
        <List style={{ maxHeight: "400px", overflowY: "auto" }}>
          {zones.map((zone) => (
            <ListItem>
              <ListItemButton>
                <ListItemText primary={zone?.name} secondary={zone?.description} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Button fullWidth variant="contained">
          Add safety zone
        </Button>
      </FormControl>
      <br />
      <FormControl fullWidth style={{ marginTop: "25px" }}>
        <FormLabel>Display on showlaser</FormLabel>
        <SelectList
          onSelect={setSelectedSafetyZoneUuids}
          items={zones.filter((z) => selectedSafetyZoneUuids.includes(z.uuid))}
          disabled={false}
        />
      </FormControl>
    </>
  );
}
