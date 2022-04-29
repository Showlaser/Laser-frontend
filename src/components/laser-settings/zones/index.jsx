import React, { useCallback, useState } from "react";
import { createGuid } from "services/shared/math";
import "./index.css";
import CrudComponent from "components/shared/crud-component";
import { deleteZone, playZone, saveZone } from "services/logic/zone-logic";
import PointForm from "components/shared/point-form";
import Modal from "components/modal";
import PointsDrawer from "components/shared/points-drawer";
import { Grid, TextField, Button } from "@mui/material";
import { deepClone, stringIsEmpty } from "services/shared/general";
import SendIcon from "@mui/icons-material/Send";

export default function Zones({
  zones,
  setZones,
  selectedZoneUuid,
  setSelectedZoneUuid,
}) {
  const [zonePlaying, setZonePlaying] = useState(false);
  const [changesSaved, setChangesSaved] = useState(false);
  const [modalOptions, setModalOptions] = useState({
    title: "Delete animation?",
    show: false,
    onOkClick: null,
    onCancelClick: () => closeModal(),
  });
  const [, updateState] = useState();
  const forceUpdate = useCallback(() => updateState({}), []);
  const selectedZone = zones?.find((z) => z?.uuid === selectedZoneUuid);

  const closeModal = () => {
    let modal = modalOptions;
    modal.show = false;
    setModalOptions(modal);
    forceUpdate();
  };

  const onPointsUpdate = (points) => {
    let updatedZones = deepClone(zones);
    let zoneToUpdate = updatedZones.find((z) => z.uuid === selectedZoneUuid);
    zoneToUpdate.points = points;
    setZones(updatedZones);
  };

  const updateZoneProperty = (property, value) => {
    if (typeof property !== "string" || stringIsEmpty(property)) {
      return;
    }

    let updatedZones = deepClone(zones);
    let zoneToUpdate = updatedZones.find((up) => up?.uuid === selectedZoneUuid);
    zoneToUpdate[property] = value;
    setZones(updatedZones);
  };

  const play = () => {
    setZonePlaying(true);
    playZone(selectedZone).then(() => setZonePlaying(false));
  };

  return (
    <div>
      <h2>Zones</h2>
      <Modal modal={modalOptions} />
      <CrudComponent
        selectOptions={{
          selectText: "Select zone",
          onChange: setSelectedZoneUuid,
          selectedValue: selectedZoneUuid,
        }}
        itemsArray={zones}
        changesSaved={changesSaved}
        actions={{
          onSave: () => {
            setChangesSaved(true);
            saveZone(zones.find((zone) => zone.uuid === selectedZoneUuid));
          },
          onAdd: () => {
            let updatedZones = deepClone(zones);
            const uuid = createGuid();
            updatedZones.push({
              uuid,
              name: `zone${zones.length + 1}`,
              points: [],
              maxLaserPowerInZonePwm: 0,
            });

            setZones(updatedZones);
            setSelectedZoneUuid(uuid);
            setChangesSaved(false);
          },
          onDelete: () => {
            let modal = modalOptions;
            modal.show = true;
            modal.onOkClick = () => {
              const index = zones.findIndex((z) => z.uuid === selectedZoneUuid);
              if (index === -1) {
                return;
              }

              let updatedZones = deepClone(zones);
              updatedZones.splice(index, 1);
              setZones(updatedZones);
              deleteZone(selectedZoneUuid);
              closeModal();
            };
            setModalOptions(modal);
            forceUpdate();
            setChangesSaved(false);
          },
        }}
      >
        <Button
          variant="contained"
          disabled={zonePlaying}
          startIcon={<SendIcon />}
          onClick={play}
          style={{ marginLeft: "5px" }}
          size="small"
        >
          Run
        </Button>
      </CrudComponent>
      <TextField
        style={{ marginTop: "10px" }}
        key={selectedZoneUuid + "zonesettings-name"}
        label="Zone name"
        onChange={(e) => updateZoneProperty("name", e.target.value)}
        defaultValue={selectedZone?.name}
      />
      <br />
      <TextField
        key={selectedZoneUuid + "zonesettings-power"}
        label="Max allowed power in the zone (0 / 765)"
        onChange={(e) =>
          updateZoneProperty("maxLaserPowerInZonePwm", e.target.value)
        }
        type="number"
        inputProps={{
          min: 0,
          max: 765,
        }}
        defaultValue={selectedZone?.maxLaserPowerInZonePwm ?? 20}
      />
      <Grid container>
        <PointForm
          item={selectedZone}
          onChange={onPointsUpdate}
          options={{ hideLaserPower: true }}
        />
        <PointsDrawer points={selectedZone?.points} />
      </Grid>
    </div>
  );
}
