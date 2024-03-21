import {
  Alert,
  Button,
  FormControl,
  FormLabel,
  Input,
  InputLabel,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Slider,
  Tooltip,
} from "@mui/material";
import { OnTrue } from "components/shared/on-true";
import { SafetyZone } from "models/components/shared/safety-zone";
import React, { useEffect, useState } from "react";
import { stringIsEmpty } from "services/shared/general";
import { createGuid, normalize, numberIsBetweenOrEqual } from "services/shared/math";
import { showError, toastSubject } from "services/shared/toast-messages";
import SafetyZonePoints from "./points";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { saveSafetyZone, deleteSafetyZone, getSafetyZones } from "services/logic/zone-logic";
import { LaserInfo } from "models/components/shared/lasers";
import { sharedTestLasers } from "pages/dashboard";
import DeleteModal, { ModalOptions } from "components/shared/delete-modal";

export interface SafetyZonesSectionProps {
  zones: SafetyZone[];
  setZones: (state: SafetyZone[]) => void;
  selectedSafetyZoneUuid: string | null;
  setSelectedSafetyZoneUuid: (state: string | null) => void;
  visibleSafetyZoneUuids: string[];
  setVisibleSafetyZoneUuids: (state: string[]) => void;
  setUnsavedChanges: (state: boolean) => void;
}

export default function SafetyZonesAddOrUpdate({
  zones,
  setZones,
  selectedSafetyZoneUuid,
  setSelectedSafetyZoneUuid,
  visibleSafetyZoneUuids,
  setVisibleSafetyZoneUuids,
  setUnsavedChanges,
}: SafetyZonesSectionProps) {
  const selectedSafetyZone = zones?.find((z) => z?.uuid === selectedSafetyZoneUuid);
  const [lasers, setLasers] = useState<LaserInfo[]>(sharedTestLasers);
  const [modalOptions, setModalOptions] = React.useState<ModalOptions>({
    show: false,
    onDelete: () => {},
    title: "Are you sure you want to remove the selected safety zone?",
  });

  useEffect(() => {
    if (lasers.length === 0) {
      // TODO add real call to api for lasers
    }
  }, []);

  const addSafetyZone = () => {
    let updatedZones = [...zones];
    updatedZones.push({
      uuid: createGuid(),
      name: `Safety zone ${zones.length + 1}`,
      appliedOnShowLaserUuid: "",
      description: "New safety zone",
      maxLaserPowerInZonePercentage: 0,
      points: [],
    });

    setZones(updatedZones);
    setTimeout(() => {
      // Delay, because the list does not contain the item yet
      const list = document.getElementById("safety-zone-list");
      if (list === null) {
        return;
      }

      list.scrollTop = list.scrollHeight;
    }, 50);
  };

  const updateSafetyZoneProperty = (value: any, property: string) => {
    let updatedSafetyZone: any = { ...selectedSafetyZone };
    let updatedSafetyZones = [...zones];

    updatedSafetyZone[property] = value;
    const index = zones.findIndex((z) => z.uuid === updatedSafetyZone.uuid);

    updatedSafetyZones[index] = updatedSafetyZone;
    setZones(updatedSafetyZones);
  };

  const getLaserPowerSliderColor = () => {
    const value = Number(selectedSafetyZone?.maxLaserPowerInZonePercentage);
    if (numberIsBetweenOrEqual(value, 0, 25)) {
      return "primary";
    }
    if (numberIsBetweenOrEqual(value, 25, 50)) {
      return "warning";
    }

    return "error";
  };

  const onVisibilityChange = (safetyZoneUuid: string) => {
    let visibilityUuids = [...visibleSafetyZoneUuids];

    const zoneIndex = visibilityUuids.findIndex((zUuid) => zUuid === safetyZoneUuid);
    zoneIndex !== -1 ? visibilityUuids.splice(zoneIndex, 1) : visibilityUuids.push(safetyZoneUuid);
    setVisibleSafetyZoneUuids(visibilityUuids);
  };

  const saveZones = async () => {
    await saveSafetyZone(zones);
    setUnsavedChanges(false);
  };

  const deleteZone = async () => {
    if (selectedSafetyZoneUuid === null) {
      return;
    }

    const safetyZonesOnApi = await getSafetyZones();
    const safetyZoneIsSavedOnApi = safetyZonesOnApi.some((szoa) => szoa.uuid === selectedSafetyZoneUuid);
    if (safetyZoneIsSavedOnApi) {
      await deleteSafetyZone(selectedSafetyZoneUuid);
    }

    const index = zones.findIndex((z) => z.uuid === selectedSafetyZoneUuid);
    if (index === -1) {
      return;
    }

    let updatedZones = [...zones];
    updatedZones.splice(index, 1);
    setZones(updatedZones);
  };

  const onSelectedSafetyZoneClick = (safetyZoneUuid: string) => {
    setSelectedSafetyZoneUuid(safetyZoneUuid);
    onVisibilityChange(safetyZoneUuid);
  };

  const labelStyle = { marginBottom: "-11px", marginTop: "5px" };
  return (
    <>
      <DeleteModal modalOptions={modalOptions} setModalOptions={setModalOptions} />
      <Paper sx={{ p: 2 }}>
        <FormControl fullWidth>
          <FormLabel>Safety zones</FormLabel>
          <List dense style={{ maxHeight: "220px", overflowY: "auto" }} id="safety-zone-list">
            {zones.map((zone) => (
              <ListItem key={`safety-zone-${zone.uuid}`}>
                <ListItemButton onClick={() => onSelectedSafetyZoneClick(zone.uuid)} style={{ width: "100%" }}>
                  <ListItemText primary={zone?.name} secondary={zone?.description} />
                </ListItemButton>
                <Tooltip title="Toggle visibility" placement="right">
                  <ListItemIcon onClick={() => onVisibilityChange(zone.uuid)} style={{ paddingLeft: "15px" }}>
                    {visibleSafetyZoneUuids.some((vszu) => vszu === zone.uuid) ? (
                      <VisibilityIcon />
                    ) : (
                      <VisibilityOffIcon />
                    )}
                  </ListItemIcon>
                </Tooltip>
              </ListItem>
            ))}
          </List>
          <br />
          <Button fullWidth size="small" onClick={addSafetyZone} sx={{ mb: 1 }}>
            Add safety zone
          </Button>
          <Button size="small" fullWidth variant="contained" onClick={saveZones}>
            Save all changes
          </Button>
        </FormControl>
      </Paper>
      <Paper sx={{ p: 2, mt: 1 }}>
        {selectedSafetyZone === undefined ? (
          <Alert severity="info">Select a safety zone first!</Alert>
        ) : (
          <>
            <InputLabel
              error={stringIsEmpty(selectedSafetyZone?.name)}
              shrink
              style={{ marginBottom: labelStyle.marginBottom }}
              size="small"
              htmlFor="safety-zone-name"
            >
              Name
            </InputLabel>
            <Input
              disabled={selectedSafetyZone === undefined}
              id="safety-zone-name"
              value={selectedSafetyZone?.name}
              onChange={(e) => {
                const nameIsInUse = zones.some((z) => z.name === e.target.value);
                if (nameIsInUse) {
                  showError(toastSubject.duplicatedName, `: ${e.target.value}`);
                }

                updateSafetyZoneProperty(e.target.value, "name");
              }}
            />
            <InputLabel shrink style={labelStyle} size="small" htmlFor="safety-zone-description">
              Description
            </InputLabel>
            <Input
              disabled={selectedSafetyZone === undefined}
              id="safety-zone-description"
              value={selectedSafetyZone?.description}
              onChange={(e) => updateSafetyZoneProperty(e.target.value, "description")}
            />
            <InputLabel shrink style={labelStyle} size="small" htmlFor="safety-zone-">
              Applied on showLaser
            </InputLabel>
            <Select
              onChange={(e: any) => updateSafetyZoneProperty(String(e.target.value), "appliedOnShowLaserUuid")}
              id="safety-zone-applied-on-showlaser"
              value={selectedSafetyZone?.appliedOnShowLaserUuid}
            >
              {lasers.map((laser, index) => (
                <MenuItem key={`safety-zone-laser-${laser.uuid}`} selected={true} value={laser.uuid}>
                  {laser.name}
                </MenuItem>
              ))}
            </Select>
            <InputLabel
              id="safety-zone-max-power-label"
              error={selectedSafetyZone?.maxLaserPowerInZonePercentage === undefined}
              shrink
              style={labelStyle}
              size="small"
              htmlFor="safety-zone-max-power"
            >
              Max laser power in safety zone (
              {normalize(Number(selectedSafetyZone?.maxLaserPowerInZonePercentage), 0, 100)}
              %)
            </InputLabel>
            <small>Warning! Be very careful with setting the power!</small>
            <Slider
              disabled={selectedSafetyZone === undefined}
              color={getLaserPowerSliderColor()}
              valueLabelDisplay="auto"
              value={normalize(Number(selectedSafetyZone?.maxLaserPowerInZonePercentage), 0, 100)}
              onChange={(e, value) => updateSafetyZoneProperty(value, "maxLaserPowerInZonePercentage")}
            />
            {selectedSafetyZone !== undefined ? (
              <SafetyZonePoints setSafetyZoneProperty={updateSafetyZoneProperty} safetyZone={selectedSafetyZone} />
            ) : null}
            <div style={{ padding: "0 25px 0 25px" }}>
              <Button
                size="small"
                color="error"
                fullWidth
                onClick={() => {
                  let updateModalOptions = { ...modalOptions };
                  updateModalOptions.show = true;
                  updateModalOptions.onDelete = deleteZone;
                  setModalOptions(updateModalOptions);
                }}
              >
                Delete
              </Button>
            </div>
          </>
        )}
      </Paper>
    </>
  );
}
