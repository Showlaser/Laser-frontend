import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import {
  ExportedLasershow,
  LaserCommandModel,
  LaserCommandModelCluster,
} from "models/components/shared/laser-command";
import { Lasershow } from "models/components/shared/lasershow";
import { Point } from "models/components/shared/point";
import React from "react";

type Props = {
  selectedLasershow: Lasershow | null;
  getPointsToDraw: (positionMs: number, convertValuesFromPointsDrawer: boolean) => Point[][];
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

  const generateLasershow = (): ExportedLasershow => {
    const laserCommands: ExportedLasershow = [];
    for (let timelinePosition = 0; timelinePosition < lasershowDuration; timelinePosition += 10) {
      const lasershowPointsAtTimelinePosition = getPointsToDraw(timelinePosition, false);
      const laserCommandModelCluster: LaserCommandModelCluster = {
        timeMs: timelinePosition,
        commands: [],
      };

      for (
        let lasershowAnimationIndex = 0;
        lasershowAnimationIndex < lasershowPointsAtTimelinePosition.length;
        lasershowAnimationIndex++
      ) {
        const animationPatternCommands: LaserCommandModel[] = [];
        const lasershowAnimationPointsToDraw = [
          ...lasershowPointsAtTimelinePosition[lasershowAnimationIndex],
        ].sort((a, b) => a.orderNr - b.orderNr);

        lasershowAnimationPointsToDraw.forEach((ptd, index) => {
          const pointToConnectTo = lasershowAnimationPointsToDraw.find(
            (up) => up.uuid === ptd.connectedToPointUuid
          );
          const x: number = Math.ceil(ptd.x);
          const y: number = Math.ceil(ptd.y);

          animationPatternCommands.push({
            r: ptd.redLaserPowerPwm,
            g: ptd.greenLaserPowerPwm,
            b: ptd.blueLaserPowerPwm,
            x,
            y,
          });

          if (pointToConnectTo === undefined) {
            // If not connected to another point, add a dummy point with turned off lasers, so no line is drawn.
            animationPatternCommands.push({
              r: 0,
              g: 0,
              b: 0,
              x,
              y,
            });
          } else if (index === lasershowAnimationPointsToDraw.length - 1) {
            // Display a line to the connected point
            animationPatternCommands.push({
              r: ptd.redLaserPowerPwm,
              g: ptd.greenLaserPowerPwm,
              b: ptd.blueLaserPowerPwm,
              x: Math.ceil(pointToConnectTo.x),
              y: Math.ceil(pointToConnectTo.y),
            });
          }
        });

        laserCommandModelCluster.commands.push(animationPatternCommands);
      }

      laserCommands.push(laserCommandModelCluster);
    }

    return laserCommands;
  };

  const downloadLaserShow = (laserCommands: ExportedLasershow) => {
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
    const generatedLasershow: ExportedLasershow = generateLasershow();
    downloadLaserShow(generatedLasershow);
  };

  return (
    <div>
      <FormControl fullWidth style={{ marginBottom: "15px" }}>
        <InputLabel id="lasershow-export-select-label">Showlaser galvo speed (kpps)</InputLabel>
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
