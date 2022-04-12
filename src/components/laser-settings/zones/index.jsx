import React, { useCallback, useEffect, useState } from "react";
import { createGuid, emptyGuid } from "services/shared/math";
import "./index.css";
import CrudComponent from "components/shared/crud-component";
import {
  deleteZone,
  getZones,
  playZone,
  saveZone,
} from "services/logic/zone-logic";
import PointForm from "components/shared/point-form";
import Modal from "components/modal";
import PointsDrawer from "components/shared/points-drawer";
import { Grid, TextField, Button } from "@mui/material";
import { stringIsEmpty } from "services/shared/general";
import SendIcon from "@mui/icons-material/Send";

export default function Zones({ onDataAvailable }) {
  const [zones, setZones] = useState([]);
  const [selectedZoneUuid, setSelectedZoneUuid] = useState();
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
  const selectedZone = zones.find((z) => z.uuid === selectedZoneUuid);

  useEffect(() => {
    getZones().then((data) => {
      onDataAvailable(data);
      setZones(data);
      setSelectedZoneUuid(data[0]?.uuid ?? emptyGuid());
    });
  }, []);

  const closeModal = () => {
    let modal = modalOptions;
    modal.show = false;
    setModalOptions(modal);
    forceUpdate();
  };

  const onPointsUpdate = (points) => {
    let updatedZones = structuredClone(zones);
    let zoneToUpdate = updatedZones.find((z) => z.uuid === selectedZoneUuid);
    zoneToUpdate.points = points;
    setZones(updatedZones);
  };

  const updateZoneProperty = (property, value) => {
    if (typeof property !== "string" || stringIsEmpty(property)) {
      return;
    }

    let updatedZones = structuredClone(zones);
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
            let updatedZones = structuredClone(zones);
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
          variant="outlined"
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
        label="Max allowed power in the zone"
        onChange={(e) =>
          updateZoneProperty("maxLaserPowerInZonePwm", e.target.value)
        }
        defaultValue={selectedZone?.maxLaserPowerInZonePwm}
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
