import { FormControlLabel, FormGroup, Switch } from "@mui/material";
import { createGuid } from "services/shared/math";
import { deleteZone, saveZone } from "services/logic/zone-logic";
import { useEffect, useState } from "react";

export default function DevelopmentSettings({
  onDevelopmentModeActive,
  onDevelopmentModeInactive,
  developmentZone,
}) {
  const [developmentModeIsActive, setDevelopmentModeIsActive] = useState();
  const [sliderIsDisabled, setSliderIsDisabled] = useState(false);

  useEffect(() => {
    setDevelopmentModeIsActive(developmentZone !== undefined);
  }, [developmentZone]);

  const getDevelopmentZone = () => {
    const uuid = createGuid();
    return {
      uuid,
      name: "Development zone",
      maxLaserPowerInZonePwm: 20,
      points: [
        {
          uuid: createGuid(),
          zoneUuid: uuid,
          x: -4000,
          y: 4000,
          order: 0,
        },
        {
          uuid: createGuid(),
          zoneUuid: uuid,
          x: 4000,
          y: 4000,
          order: 1,
        },
        {
          uuid: createGuid(),
          zoneUuid: uuid,
          x: 4000,
          y: -4000,
          order: 2,
        },
        {
          uuid: createGuid(),
          zoneUuid: uuid,
          x: -4000,
          y: -4000,
          order: 3,
        },
      ],
    };
  };

  return (
    <div>
      <h2>Development</h2>
      <FormGroup>
        <FormControlLabel
          control={
            <Switch
              disabled={sliderIsDisabled}
              checked={developmentModeIsActive}
              onChange={() => {
                setSliderIsDisabled(true);
                if (developmentModeIsActive) {
                  deleteZone(developmentZone.uuid);
                  setDevelopmentModeIsActive(false);
                  onDevelopmentModeInactive(developmentZone.uuid);
                  setSliderIsDisabled(false);
                  return;
                }

                saveZone(getDevelopmentZone()).then(() =>
                  setSliderIsDisabled(false)
                );
                setDevelopmentModeIsActive(true);
                onDevelopmentModeActive(developmentZone);
              }}
              color="secondary"
            />
          }
          label="Enable development mode"
        />
      </FormGroup>
    </div>
  );
}
