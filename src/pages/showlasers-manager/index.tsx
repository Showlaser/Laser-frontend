import {
  Alert,
  Button,
  Divider,
  FormControl,
  FormLabel,
  Grid,
  Paper,
  TextField,
} from "@mui/material";
import SelectList from "components/select-list";
import { OnTrue } from "components/shared/on-true";
import PropertyControl from "components/shared/property-control";
import SideNav from "components/shared/sidenav";
import { LaserStatus, RegisteredLaser } from "models/components/shared/registered-laser";
import { UDPBroadcast } from "models/components/shared/UPDBroadcast";
import { useEffect, useState } from "react";
import {
  adoptShowlasers,
  getPendingAdoptions,
  getRegisteredLasers,
  removeShowlasers,
  updateRegisteredLaser,
} from "services/logic/showlaser-manager";
import { canvasPxSize } from "services/shared/config";
import { stringIsEmpty } from "services/shared/general";
import { showError, toastSubject } from "services/shared/toast-messages";

export default function ShowlaserManager() {
  const [pendingAdoptions, setPendingAdoptions] = useState<UDPBroadcast[] | null>(null);
  const [registeredLasers, setRegisteredLasers] = useState<RegisteredLaser[] | null>(null);

  const [selectedPendingAdoptions, setSelectedPendingAdoptions] = useState<string[]>([]);
  const [selectedRegisteredLasers, setSelectedRegisteredLasers] = useState<string[]>([]);

  const [laserToAdopt, setLaserToAdopt] = useState<RegisteredLaser | null>(null);

  const _registeredLaser = registeredLasers?.find(
    (laser) => laser.uuid === selectedRegisteredLasers[0],
  );

  const _registeredLaserInModifyableState =
    _registeredLaser?.status === LaserStatus.Standby ||
    _registeredLaser?.status === LaserStatus.Emitting;

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
    // eslint-disable-next-line react-hooks/exhaustive-deps -- adding laserToAdopt/registeredLasers would loop on setState
  }, [pendingAdoptions, selectedPendingAdoptions]);

  // Redraw the projection preview whenever the selected laser or any of its
  // projection/power settings change.
  useEffect(() => {
    drawSettingsPreview();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- redraw only when the previewed values change
  }, [
    selectedRegisteredLasers,
    _registeredLaser?.maxPowerPerlaserInPercentage,
    _registeredLaser?.projectionTopInPercentage,
    _registeredLaser?.projectionBottomInPercentage,
    _registeredLaser?.projectionLeftInPercentage,
    _registeredLaser?.projectionRightInPercentage,
  ]);

  // Draws the projection range as a rectangle that grows outward from the
  // centre origin: each side reaches its own percentage of the maximum range
  // (50% = halfway, 100% = the dashed outer boundary). The fill becomes more
  // transparent at lower max power so weaker output reads as fainter.
  const drawSettingsPreview = () => {
    const canvas = document.getElementById(
      "showlaser-settings-preview",
    ) as HTMLCanvasElement | null;
    if (canvas === null || _registeredLaser === undefined) {
      return;
    }

    const size = canvasPxSize;
    canvas.width = size;
    canvas.height = size;
    canvas.style.maxWidth = "100%";
    canvas.style.height = "auto";

    const ctx = canvas.getContext("2d");
    if (ctx === null) {
      return;
    }

    ctx.clearRect(0, 0, size, size);

    const padding = 24;
    const center = size / 2;
    const halfRange = size / 2 - padding;

    const maxPower = _registeredLaser.maxPowerPerlaserInPercentage ?? 0;
    const top = _registeredLaser.projectionTopInPercentage ?? 0;
    const bottom = _registeredLaser.projectionBottomInPercentage ?? 0;
    const left = _registeredLaser.projectionLeftInPercentage ?? 0;
    const right = _registeredLaser.projectionRightInPercentage ?? 0;

    // Outer boundary = the maximum reach in every direction (100%).
    ctx.strokeStyle = "rgba(112, 111, 111, 0.6)";
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.strokeRect(center - halfRange, center - halfRange, halfRange * 2, halfRange * 2);
    ctx.setLineDash([]);

    // Center origin crosshair (the laser projects outward from here).
    ctx.strokeStyle = "rgba(112, 111, 111, 0.8)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(center, padding);
    ctx.lineTo(center, size - padding);
    ctx.moveTo(padding, center);
    ctx.lineTo(size - padding, center);
    ctx.stroke();

    // Projection rectangle: each side reaches its own percentage of the range.
    const rectLeft = center - (left / 100) * halfRange;
    const rectRight = center + (right / 100) * halfRange;
    const rectTop = center - (top / 100) * halfRange;
    const rectBottom = center + (bottom / 100) * halfRange;

    // Lower max power -> more transparent fill (min 0.05 so it stays visible).
    const fillAlpha = Math.max(0.05, maxPower / 100);
    ctx.fillStyle = `rgba(72, 92, 219, ${fillAlpha})`;
    ctx.strokeStyle = "rgba(72, 92, 219, 0.9)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.rect(rectLeft, rectTop, rectRight - rectLeft, rectBottom - rectTop);
    ctx.fill();
    ctx.stroke();
  };

  const onAdopt = async () => {
    if (
      laserToAdopt === null ||
      stringIsEmpty(laserToAdopt?.ipAddress ?? "") ||
      stringIsEmpty(laserToAdopt?.uuid ?? "") ||
      stringIsEmpty(laserToAdopt?.name ?? "")
    ) {
      showError(toastSubject.formNotComplete, "Showlaser name is empty");
      return;
    }

    const result = await adoptShowlasers(laserToAdopt);
    if (result?.status === 200) {
      setSelectedPendingAdoptions([]);
      let pendingAdoptionsCopy = [...(pendingAdoptions ?? [])];
      pendingAdoptionsCopy = pendingAdoptionsCopy.filter(
        (adoption) => adoption.uuid !== laserToAdopt.uuid,
      );
      setPendingAdoptions(pendingAdoptionsCopy);
      getRegisteredLasers().then((registered) => {
        if (registered !== undefined) {
          console.log(registered);
          setRegisteredLasers(registered);
        }
      });
    }
  };

  const onRemove = async () => {
    if (
      selectedRegisteredLasers.length > 0 &&
      window.confirm("Are you sure you want to remove the selected showlasers?")
    ) {
      const status = await removeShowlasers(selectedRegisteredLasers);
      if (status === 200) {
        setSelectedRegisteredLasers([]);
        getRegisteredLasers().then((registered) => {
          if (registered !== undefined) {
            setRegisteredLasers(registered);
          }
        });
      }
    }
  };

  const onAdoptionSelect = (selected: string[]) => {
    setSelectedPendingAdoptions(selected);
    const selectedLaser = pendingAdoptions?.find((adoption) => adoption.uuid === selected[0]);
    if (selectedLaser === undefined) {
      setLaserToAdopt(null);
      return;
    }

    const showlaserToAdopt: RegisteredLaser = {
      uuid: selectedLaser.uuid,
      name: selectedLaser.name,
      modelType: selectedLaser.modelType,
      ipAddress: selectedLaser.ipAddress,
      maxPowerPerlaserInPercentage: selectedLaser.maxPowerPerlaserInPercentage,
      projectionTopInPercentage: selectedLaser.projectionTopInPercentage,
      projectionBottomInPercentage: selectedLaser.projectionBottomInPercentage,
      projectionLeftInPercentage: selectedLaser.projectionLeftInPercentage,
      projectionRightInPercentage: selectedLaser.projectionRightInPercentage,
    };

    setLaserToAdopt(showlaserToAdopt);
  };

  const onSaveRegisteredLaser = async () => {
    const registeredLaser = registeredLasers?.find(
      (laser) => laser.uuid === selectedRegisteredLasers[0],
    );

    if (registeredLaser !== undefined) {
      await updateRegisteredLaser(registeredLaser);
    }
  };

  const updateRegisteredLaserProperty = (property: string, value: unknown) => {
    if (registeredLasers === null) {
      return;
    }

    const registeredLasersToUpdate = [...registeredLasers];
    const index = registeredLasers?.findIndex(
      (laser) => laser.uuid === selectedRegisteredLasers[0],
    );

    if (index !== -1) {
      const updatedLaser = { ...registeredLasers[index] };
      (updatedLaser as Record<string, unknown>)[property] = value;
      registeredLasersToUpdate[index] = updatedLaser;
      setRegisteredLasers(registeredLasersToUpdate);
    }
  };

  return (
    <SideNav pageName="Showlaser manager">
      <Grid size={4}>
        <Paper style={{ padding: "20px" }}>
          <FormLabel>Lasers to adopt</FormLabel>
          <SelectList
            allowSelectMultiple={false}
            onSelect={onAdoptionSelect}
            items={
              pendingAdoptions?.map((adoption: UDPBroadcast) => ({
                uuid: adoption.uuid,
                name: adoption?.ipAddress ?? "",
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
                  value={laserToAdopt?.name}
                  required
                  onChange={(e) => {
                    if (pendingAdoptions === null) {
                      return;
                    }

                    const laserToUpdateIndex = pendingAdoptions?.findIndex(
                      (laser) => laser.uuid === selectedPendingAdoptions[0],
                    );

                    if (laserToUpdateIndex !== -1) {
                      pendingAdoptions[laserToUpdateIndex].name = e.target.value;
                    }
                  }}
                />
                <small>IP: {laserToAdopt?.ipAddress}</small>
                <small>UUID: {laserToAdopt?.uuid}</small>
                <small>ModelType: {laserToAdopt?.modelType}</small>
              </FormControl>
              <Button variant="contained" onClick={onAdopt} style={{ marginTop: "10px" }}>
                Adopt selected
              </Button>
            </>
          </OnTrue>
        </Paper>

        <Paper style={{ padding: "20px", marginTop: "20px" }}>
          <FormLabel>Registered Showlasers</FormLabel>
          <SelectList
            allowSelectMultiple={false}
            onSelect={setSelectedRegisteredLasers}
            items={
              registeredLasers?.map((laser: RegisteredLaser) => ({
                uuid: laser.uuid,
                name: laser?.name ?? "",
                description: "Status: " + laser?.status,
              })) ?? []
            }
          />
          <OnTrue onTrue={selectedRegisteredLasers.length > 0}>
            <div style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>
              <FormControl disabled={!_registeredLaserInModifyableState}>
                <OnTrue onTrue={!_registeredLaserInModifyableState}>
                  <Alert severity="error">
                    The showlaser is not connected to the controller and therefore no changes can be
                    made.
                  </Alert>
                </OnTrue>
                <FormLabel htmlFor="showlaser-name">Showlaser name</FormLabel>
                <TextField
                  style={{ marginBottom: "5px" }}
                  id="showlaser-name"
                  value={_registeredLaser?.name}
                  required
                  onChange={(e) => updateRegisteredLaserProperty("name", e.target.value)}
                />
                <small>IP: {_registeredLaser?.ipAddress}</small>
                <small>UUID: {_registeredLaser?.uuid}</small>
                <small>ModelType: {_registeredLaser?.modelType}</small>
                <small>Status: {_registeredLaser?.status}</small>
                <PropertyControl
                  disabled={!_registeredLaserInModifyableState}
                  label="Max power per laser %"
                  id="maxPowerPerlaserInPercentage"
                  value={_registeredLaser?.maxPowerPerlaserInPercentage ?? 0}
                  onChange={(value) =>
                    updateRegisteredLaserProperty("maxPowerPerlaserInPercentage", Math.round(value))
                  }
                  min={0}
                  max={100}
                  showSlider
                  sliderMarks={[{ value: 0, label: "0" }]}
                />
                <PropertyControl
                  disabled={!_registeredLaserInModifyableState}
                  label="Projection range to top %"
                  id="svg-yoffset"
                  value={_registeredLaser?.projectionTopInPercentage ?? 0}
                  onChange={(value) =>
                    updateRegisteredLaserProperty("projectionTopInPercentage", Math.round(value))
                  }
                  min={0}
                  max={100}
                  showSlider
                  sliderMarks={[{ value: 0, label: "0" }]}
                />
                <PropertyControl
                  disabled={!_registeredLaserInModifyableState}
                  label="Projection range to bottom %"
                  id="svg-yoffset"
                  value={_registeredLaser?.projectionBottomInPercentage ?? 0}
                  onChange={(value) =>
                    updateRegisteredLaserProperty("projectionBottomInPercentage", Math.round(value))
                  }
                  min={0}
                  max={100}
                  showSlider
                  sliderMarks={[{ value: 0, label: "0" }]}
                />
                <PropertyControl
                  disabled={!_registeredLaserInModifyableState}
                  label="Projection range to left %"
                  id="svg-yoffset"
                  value={_registeredLaser?.projectionLeftInPercentage ?? 0}
                  onChange={(value) =>
                    updateRegisteredLaserProperty("projectionLeftInPercentage", Math.round(value))
                  }
                  min={0}
                  max={100}
                  showSlider
                  sliderMarks={[{ value: 0, label: "0" }]}
                />
                <PropertyControl
                  disabled={!_registeredLaserInModifyableState}
                  label="Projection range to right %"
                  id="svg-yoffset"
                  value={_registeredLaser?.projectionRightInPercentage ?? 0}
                  onChange={(value) =>
                    updateRegisteredLaserProperty("projectionRightInPercentage", Math.round(value))
                  }
                  min={0}
                  max={100}
                  showSlider
                  sliderMarks={[{ value: 0, label: "0" }]}
                />
                <Button
                  disabled={!_registeredLaserInModifyableState}
                  variant="contained"
                  onClick={onSaveRegisteredLaser}
                  style={{ marginTop: "10px" }}
                >
                  Update selected showlasers
                </Button>
                <Divider />
                <Button
                  disabled={!_registeredLaserInModifyableState}
                  color="error"
                  size="small"
                  variant="text"
                  onClick={onRemove}
                  style={{ marginTop: "10px" }}
                >
                  Remove selected showlasers
                </Button>
              </FormControl>
              <canvas id="showlaser-settings-preview" />
            </div>
          </OnTrue>
        </Paper>
      </Grid>
    </SideNav>
  );
}
