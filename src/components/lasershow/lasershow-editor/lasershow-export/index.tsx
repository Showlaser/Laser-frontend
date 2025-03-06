import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { LaserCommand } from "models/components/shared/laser-command";
import { Lasershow } from "models/components/shared/lasershow";
import { Point } from "models/components/shared/point";
import React from "react";

type Props = {
  selectedLasershow: Lasershow | null;
  getPointsToDraw: (
    positionMs: number,
    convertValuesFromPointsDrawer: boolean
  ) => Point[][];
  lasershowDuration: number;
};

export default function LasershowExport({
  selectedLasershow,
  lasershowDuration,
  getPointsToDraw,
}: Props) {
  const [galvoSpeed, setGalvoSpeed] = React.useState(40000);

  const onGalvoSpeedChange = (event: SelectChangeEvent) => {
    setGalvoSpeed(Number(event.target.value));
  };

  const generateLasershow = (): LaserCommand[][] => {
    let laserCommands: LaserCommand[][] = [];
    for (let i = 0; i < lasershowDuration; i += 10) {
      const pointsToDraw = getPointsToDraw(i, false)[0].sort(
        (a, b) => a.orderNr - b.orderNr
      );

      let commands: LaserCommand[] = [];
      pointsToDraw.forEach((ptd) => {
        const pointToConnectTo = pointsToDraw.find(
          (up) => up.uuid === ptd.connectedToPointUuid
        );

        const x: number = Math.ceil(ptd.x);
        const y: number = Math.ceil(ptd.y);

        commands.push([
          ptd.redLaserPowerPwm,
          ptd.greenLaserPowerPwm,
          ptd.blueLaserPowerPwm,
          x,
          y,
        ]);

        if (pointToConnectTo === undefined) {
          // If not connected to another point, display a point
          commands.push([0, 0, 0, x, y]);
        } else {
          // Display a line to the connected point
          commands.push([
            pointToConnectTo.redLaserPowerPwm,
            pointToConnectTo.greenLaserPowerPwm,
            pointToConnectTo.blueLaserPowerPwm,
            Math.ceil(pointToConnectTo.x),
            Math.ceil(pointToConnectTo.y),
          ]);
        }
      });

      laserCommands.push(commands);
    }
    return laserCommands;
  };

  const downloadLaserShow = (laserCommands: LaserCommand[][]) => {
    const jsonModel = {
      kpps: galvoSpeed,
      laserCommands: laserCommands,
    };

    const json = JSON.stringify(jsonModel);
    const blob = new Blob([json], { type: "application/json" });

    // Create a temporary anchor element
    const a = document.createElement("a");
    a.download = `${selectedLasershow?.name}.json`;
    a.href = URL.createObjectURL(blob);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const onClick = () => {
    let generatedLasershow: LaserCommand[][] = generateLasershow();
    downloadLaserShow(generatedLasershow);
  };

  return (
    <div>
      <FormControl fullWidth style={{ marginBottom: "15px" }}>
        <InputLabel id="lasershow-export-select-label">
          Showlaser galvo speed (kpps)
        </InputLabel>
        <Select
          labelId="lasershow-export-select-label"
          id="lasershow-export-select"
          value={String(galvoSpeed)}
          label="KPPS"
          onChange={onGalvoSpeedChange}
        >
          <MenuItem value={40000}>40000</MenuItem>
        </Select>
      </FormControl>

      <Button fullWidth variant="contained" onClick={onClick}>
        Export to .json
      </Button>
    </div>
  );
}
