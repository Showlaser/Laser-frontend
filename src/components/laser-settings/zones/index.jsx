import React, { useEffect } from "react";
import {
  convertToMilliWatts,
  mapNumber,
  valueIsWithinBoundaries,
} from "services/shared/math";
import "./index.css";
import { showError, toastSubject } from "services/shared/toast-messages";
import {
  Button,
  Divider,
  InputLabel,
  MenuItem,
  Select,
  Slider,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

export default function Zones(props) {
  const [selectedZone, setSelectedZone] = React.useState(0);
  const zonePlaceholder = {
    points: [
      {
        x: -4000,
        y: 4000,
      },
      {
        x: 4000,
        y: 4000,
      },
      {
        x: 4000,
        y: -4000,
      },
      {
        x: -4000,
        y: -4000,
      },
    ],
    maxPowerPwm: 3,
  };

  useEffect(() => {
    drawZone(props.zones[selectedZone]);
  }, [props?.zones, selectedZone]);

  const drawZone = (zone) => {
    let c = document.getElementById("zones-canvas");
    let ctx = c.getContext("2d");
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#ff0000";
    ctx.stroke();

    const length = zone?.points?.length;
    for (let i = 0; i < length; i++) {
      const point = zone?.points[i];
      ctx.moveTo(
        mapNumber(point?.x, 4000, -4000, 400, 0),
        mapNumber(point?.y, 4000, -4000, 0, 400)
      );
      i === 3
        ? ctx.lineTo(
            mapNumber(zone?.points[0]?.x, 4000, -4000, 400, 0),
            mapNumber(zone?.points[0]?.y, 4000, -4000, 0, 400)
          )
        : ctx.lineTo(
            mapNumber(zone?.points[i + 1]?.x, 4000, -4000, 400, 0),
            mapNumber(zone?.points[i + 1]?.y, 4000, -4000, 0, 400)
          );
    }
    ctx.stroke();
  };

  const updateZone = (index, value, axle) => {
    if (!valueIsWithinBoundaries(value, -4000, 4000)) {
      showError(toastSubject.boundaryError);
      return;
    }

    let updatedZones = props?.zones;
    updatedZones[selectedZone].points[index][axle] = value;
    props.callback(updatedZones, "zones");
    drawZone(props?.zones[selectedZone]);
  };

  const getZonesForm = () => {
    return props?.zones[selectedZone]?.points?.map((point, index) => (
      <div key={`${index}-point`}>
        <small>Point {index}</small>
        <br />
        <TextField
          name={`x${index}`}
          size="small"
          style={{ margin: "2px" }}
          InputProps={{ inputProps: { min: -4000, max: 4000 } }}
          type="number"
          label="X"
          value={point.x}
          onChange={(e) => updateZone(index, Number(e.target.value), "x")}
        />
        <TextField
          name={`y${index}`}
          size="small"
          style={{ margin: "2px" }}
          InputProps={{ inputProps: { min: -4000, max: 4000 } }}
          type="number"
          label="Y"
          value={point.y}
          onChange={(e) => updateZone(index, Number(e.target.value), "y")}
        />
      </div>
    ));
  };

  const renderZones = () => {
    const items = getZonesForm();

    return (
      <div id="zones-wrapper">
        <div id="zone-form">
          <InputLabel id="demo-simple-select-label">Select zone</InputLabel>
          <Select
            onChange={(e) => {
              const data = e.target.value;
              setSelectedZone(data);
              drawZone(props?.zones[data]);
            }}
            value={selectedZone ?? " "}
            labelId="demo-simple-select-label"
            id="demo-simple-select"
          >
            {props?.zones?.map((zone, index) => (
              <MenuItem key={`${index}-zone`} value={index}>
                {index}
              </MenuItem>
            ))}
          </Select>
          <Button
            onClick={() => {
              let updatedZones = props?.zones;
              updatedZones.push(zonePlaceholder);
              setSelectedZone(updatedZones.length - 1);
              props.callback(updatedZones, "zones");
              drawZone(props?.zones[updatedZones.length - 1]);
            }}
            style={{ marginLeft: "5px" }}
            size="small"
            color="primary"
            variant="contained"
            startIcon={<AddIcon />}
          >
            Add
          </Button>
          <Button
            onClick={() => {
              let updatedZones = props?.zones;
              updatedZones.splice(selectedZone, 1);
              setSelectedZone(updatedZones.length - 1);
              props.callback(updatedZones, "zones");
              drawZone(props?.zones[updatedZones.length - 1]);
            }}
            style={{ marginLeft: "5px" }}
            size="small"
            color="secondary"
            variant="contained"
            startIcon={<DeleteIcon />}
          >
            Remove
          </Button>
          <Divider style={{ marginTop: "5px" }} />
          {items}
          <br />
          <label>Max power in zone</label>
          <br />
          <small>
            Power in mW:{" "}
            {convertToMilliWatts(5000, props?.zones[selectedZone]?.maxPowerPwm)}
          </small>
          <Slider
            onChange={(e, value) => {
              let updatedZones = props?.zones;
              updatedZones[selectedZone].maxPowerPwm = value;
              props.callback(updatedZones, "zones");
            }}
            value={props?.zones[selectedZone]?.maxPowerPwm}
            max={511}
            aria-labelledby="continuous-slider"
            valueLabelDisplay="auto"
          />
        </div>

        <Box id="zones-preview" component="div" display="inline-block">
          <canvas height="400px" width="400px" id="zones-canvas" />
        </Box>
      </div>
    );
  };

  return (
    <div>
      <h2>Zones</h2>
      <p>Set zones in which the laser power will be reduced</p>
      {renderZones()}
    </div>
  );
}
