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
import { adoptShowlasers, getPendingAdoptions } from "services/logic/showlaser-manager";

export default function ShowlaserManager() {
  const [pendingAdoptions, setPendingAdoptions] = useState<UDPBroadcast[] | null>(null);
  const [selectedPendingAdoptions, setSelectedPendingAdoptions] = useState<string[]>([]);
  const [registeredLaser, setRegisteredLaser] = useState<RegisteredLaser | null>(null);

  useEffect(() => {
    if (pendingAdoptions === null) {
      getPendingAdoptions().then((adoptions) => {
        if (adoptions !== undefined) {
          setPendingAdoptions(adoptions);
        }
      });
    }

    const selectedShowlaser = pendingAdoptions?.find(
      (pa) => pa.uuid === selectedPendingAdoptions.at(0)
    );
    let updatedRegisteredLaser = { ...registeredLaser };
    updatedRegisteredLaser.status = LaserStatus.PendingConnection;
    updatedRegisteredLaser.uuid = selectedShowlaser?.uuid;
    updatedRegisteredLaser.modelType = selectedShowlaser?.modelType ?? LaserModel.Version5;
    updatedRegisteredLaser.ipAddress = selectedShowlaser?.ip;

    setRegisteredLaser(updatedRegisteredLaser);
  }, [pendingAdoptions, selectedPendingAdoptions]);

  const onAdopt = async () => {
    if (registeredLaser === null) {
      return;
    }

    await adoptShowlasers(registeredLaser);
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
                  value={registeredLaser?.name}
                  onChange={(e) => {
                    let updatedRegisteredLaser = { ...registeredLaser };
                    if (updatedRegisteredLaser !== null) {
                      updatedRegisteredLaser.name = e.target.value;
                      setRegisteredLaser(updatedRegisteredLaser);
                    }
                  }}
                />
                <small>IP: {registeredLaser?.ipAddress}</small>
                <small>UUID: {registeredLaser?.uuid}</small>
                <small>ModelType: {registeredLaser?.modelType}</small>
                <small>Status: {registeredLaser?.status}</small>
              </FormControl>
              <Button variant="contained" onClick={onAdopt} style={{ marginTop: "10px" }}>
                Adopt selected
              </Button>
            </>
          </OnTrue>
        </Paper>
      </Grid>
    </SideNav>
  );
}
