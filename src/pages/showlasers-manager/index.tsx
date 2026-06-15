import { Button, FormControl, FormLabel, Grid, Paper, TextField } from "@mui/material";
import SelectList from "components/select-list";
import { OnTrue } from "components/shared/on-true";
import SideNav from "components/shared/sidenav";
import {
  LaserModel,
  LaserStatus,
  RegisteredLaser,
} from "models/components/shared/registered-laser";
import { UDPBroadcast } from "models/components/shared/UPDBroadcast";
import React, { useEffect, useState } from "react";
import {
  adoptShowlasers,
  getPendingAdoptions,
  getRegisteredLasers,
} from "services/logic/showlaser-manager";
import { stringIsEmpty } from "services/shared/general";
import { showError, toastSubject } from "services/shared/toast-messages";

export default function ShowlaserManager() {
  const [pendingAdoptions, setPendingAdoptions] = useState<UDPBroadcast[] | null>(null);
  const [selectedPendingAdoptions, setSelectedPendingAdoptions] = useState<string[]>([]);

  const [registeredLasersUuid, setRegisteredLasersUuid] = useState<string[]>([]);
  const [laserToRegister, setLaserToRegister] = useState<RegisteredLaser | null>(null);
  const [registeredLasers, setRegisteredLasers] = useState<RegisteredLaser[] | null>(null);

  useEffect(() => {
    if (pendingAdoptions === null) {
      getPendingAdoptions().then((adoptions) => {
        if (adoptions !== undefined) {
          setPendingAdoptions(adoptions);
        }
      });
    }

    if (registeredLasers === null) {
      getRegisteredLasers().then((registered) => {
        if (registered !== undefined) {
          setRegisteredLasers(registered);
        }
      });
    }

    const selectedShowlaser = pendingAdoptions?.find(
      (pa) => pa.uuid === selectedPendingAdoptions.at(0),
    );

    const updatedRegisteredLaser = { ...laserToRegister };
    updatedRegisteredLaser.status = LaserStatus.PendingConnection;
    updatedRegisteredLaser.uuid = selectedShowlaser?.uuid;
    updatedRegisteredLaser.modelType = selectedShowlaser?.modelType ?? LaserModel.Version5;
    updatedRegisteredLaser.ipAddress = selectedShowlaser?.ip;

    setLaserToRegister(updatedRegisteredLaser);
  }, [pendingAdoptions, selectedPendingAdoptions]);

  const onAdopt = async () => {
    if (laserToRegister === null || stringIsEmpty(laserToRegister?.name ?? "")) {
      showError(toastSubject.formNotComplete, "Showlaser name is empty");
      return;
    }

    await adoptShowlasers(laserToRegister);
  };

  return (
    <SideNav pageName="Showlaser manager">
      <Grid item xs={4}>
        <Paper style={{ padding: "20px" }}>
          <FormLabel>Lasers to adopt</FormLabel>
          <SelectList
            allowSelectMultiple={false}
            onSelect={setSelectedPendingAdoptions}
            items={
              pendingAdoptions?.map((adoption: UDPBroadcast) => ({
                uuid: adoption.uuid,
                name: adoption.ip,
                description: "",
              })) ?? []
            }
          />

          <OnTrue onTrue={selectedPendingAdoptions.length > 0}>
            <>
              <FormControl fullWidth>
                <FormLabel htmlFor="showlaser-name">Showlaser name</FormLabel>
                <TextField
                  style={{ marginBottom: "5px" }}
                  id="showlaser-name"
                  value={laserToRegister?.name}
                  required
                  onChange={(e) => {
                    const updatedRegisteredLaser = { ...laserToRegister };
                    if (updatedRegisteredLaser !== null) {
                      updatedRegisteredLaser.name = e.target.value;
                      setLaserToRegister(updatedRegisteredLaser);
                    }
                  }}
                />
                <small>IP: {laserToRegister?.ipAddress}</small>
                <small>UUID: {laserToRegister?.uuid}</small>
                <small>ModelType: {laserToRegister?.modelType}</small>
                <small>Status: {laserToRegister?.status}</small>
              </FormControl>
              <Button variant="contained" onClick={onAdopt} style={{ marginTop: "10px" }}>
                Adopt selected
              </Button>
            </>
          </OnTrue>

          <SelectList
            allowSelectMultiple={false}
            onSelect={setRegisteredLasersUuid}
            items={
              registeredLasers?.map((laser: RegisteredLaser) => ({
                uuid: laser.uuid,
                name: laser?.name ?? "",
                description: "",
              })) ?? []
            }
          />
        </Paper>
      </Grid>
    </SideNav>
  );
}
