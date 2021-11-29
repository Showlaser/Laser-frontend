import {
  Box,
  Button,
  Divider,
  InputLabel,
  Menu,
  MenuItem,
  Select,
  Slider,
  TextField,
} from "@material-ui/core";
import React, { useEffect } from "react";
import { createGuid, mapNumber } from "services/shared/math";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";
import SideNav from "components/sidenav";
import "./index.css";

export default function PatternEditor() {
  const [selectedPatternId, setSelectedPatternId] = React.useState(0);
  const [, updateState] = React.useState();
  const forceUpdate = React.useCallback(() => updateState({}), []);

  const patternPlaceholder = {
    scale: 1,
    points: [
      {
        uuid: createGuid(),
        x: -4000,
        y: 4000,
        connectedToUuid: null,
      },
      {
        uuid: createGuid(),
        x: 4000,
        y: 4000,
        connectedToUuid: null,
      },
      {
        uuid: createGuid(),
        x: 4000,
        y: -4000,
        connectedToUuid: null,
      },
      {
        uuid: createGuid(),
        x: -4000,
        y: -4000,
        connectedToUuid: null,
      },
    ],
  };
  const [patterns, setPatterns] = React.useState([patternPlaceholder]);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const getCircleTemplate = () => {
    const dotsPerCircle = 30;
    const interval = (Math.PI * 2) / dotsPerCircle;
    const radius = 4000;

    let points = [];

    for (let i = dotsPerCircle; i > 0; i--) {
      const desiredRadianAngleOnCircle = interval * i;
      const x = Math.round(radius * Math.cos(desiredRadianAngleOnCircle));
      const y = Math.round(radius * Math.sin(desiredRadianAngleOnCircle));
      points.push({
        uuid: createGuid(),
        x,
        y,
        connectedToUuid: null,
      });
    }

    return { points, scale: 1 };
  };

  const sideNavSettings = {
    pageName: "Pattern editor",
  };

  useEffect(() => {
    drawPattern(patterns[selectedPatternId]);
  }, []);

  const drawLine = (ctx, point, scale) => {
    ctx.moveTo(
      mapNumber(point?.x * scale, 4000, -4000, 400, 0),
      mapNumber(point?.y * scale, 4000, -4000, 0, 400)
    );

    const pointTo = patterns[selectedPatternId]?.points?.find(
      (p) => p.uuid === point?.connectedToUuid
    );

    if (pointTo === undefined) {
      return;
    }

    ctx.lineTo(
      mapNumber(pointTo?.x * scale, 4000, -4000, 400, 0),
      mapNumber(pointTo?.y * scale, 4000, -4000, 0, 400)
    );
  };

  const drawDot = (ctx, point, scale) => {
    ctx.fillRect(
      mapNumber(point?.x * scale, 4000, -4000, 398, 0),
      mapNumber(point?.y * scale, 4000, -4000, 0, 398),
      2,
      2
    );
  };

  const drawPattern = (pattern) => {
    if (pattern === undefined) {
      return;
    }

    let c = document.getElementById("pattern-canvas");
    let ctx = c.getContext("2d");
    ctx.beginPath();

    ctx.clearRect(0, 0, c.width, c.height);
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#ff0000";
    ctx.fillStyle = "#ff0000";
    ctx.stroke();

    const length = pattern?.points?.length;
    const scale = pattern?.scale ?? 1;

    for (let i = 0; i < length; i++) {
      const point = pattern?.points[i];

      point?.connectedToUuid !== null
        ? drawLine(ctx, point, scale)
        : drawDot(ctx, point, scale);
    }
    ctx.stroke();
  };

  const updatePatternPoint = (index, value, axle) => {
    let updatedPatterns = patterns;
    updatedPatterns[selectedPatternId].points[index][axle] = value;
    setPatterns(
      updatedPatterns,
      drawPattern(updatedPatterns[selectedPatternId])
    );
  };

  const onPatternUpdate = () => {
    drawPattern(patterns[selectedPatternId]);
    forceUpdate();
  };

  const onConnect = (uuid, connectedToUuid) => {
    let updatedPattern = patterns[selectedPatternId];
    if (connectedToUuid !== " ") {
      let updatedPoint = updatedPattern.points.find((p) => p.uuid === uuid);
      updatedPoint.connectedToUuid = connectedToUuid;
    } else {
      let updatedPoint = updatedPattern.points.find((p) => p.uuid === uuid);
      updatedPoint.connectedToUuid = null;
    }
    setPatterns(patterns, onPatternUpdate());
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const onTemplateMenuClose = (templateName) => {
    setAnchorEl(null);
    if (templateName === "circle") {
      const circle = getCircleTemplate();
      let patternsToUpdate = patterns;
      patternsToUpdate.push(circle);
      setPatterns(patternsToUpdate, drawPattern(circle));
      setSelectedPatternId(patternsToUpdate.length - 1);
    }
  };

  const deletePoint = (point) => {
    let patternToUpdate = patterns[selectedPatternId];
    const pointIndex = patternToUpdate?.points?.findIndex(
      (p) => p?.uuid === point?.uuid
    );
    if (pointIndex === -1) {
      return;
    }

    let pointsToUpdate = patternToUpdate?.points?.filter(
      (p) => p?.connectedToUuid === patternToUpdate?.points[pointIndex]?.uuid
    );
    pointsToUpdate.forEach((p) => (p.connectedToUuid = null));

    patternToUpdate?.points?.splice(pointIndex, 1);
    setPatterns(patterns, onPatternUpdate());
  };

  const getPatternsForm = () => {
    const form = patterns[selectedPatternId]?.points?.map((point, index) => (
      <div key={`${index}-pattern-point`}>
        <small>Point {index}</small>
        <br />
        <TextField
          key={createGuid()}
          autoFocus
          name={`x${index}`}
          size="small"
          style={{ margin: "2px" }}
          InputProps={{ inputProps: { min: -4000, max: 4000 } }}
          type="number"
          label="X"
          defaultValue={point.x}
          onChange={(e) => updatePatternPoint(index, e.target.value, "x")}
        />
        <TextField
          key={createGuid()}
          name={`y${index}`}
          size="small"
          style={{ margin: "2px" }}
          InputProps={{ inputProps: { min: -4000, max: 4000 } }}
          type="number"
          label="Y"
          defaultValue={point.y}
          onChange={(e) => updatePatternPoint(index, e.target.value, "y")}
        />
        <Button
          onClick={() => deletePoint(point)}
          style={{ marginTop: "15px" }}
          size="small"
          color="secondary"
          startIcon={<DeleteIcon />}
        />
        <label>Connected to </label>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          onChange={(e) => onConnect(point?.uuid, e.target.value)}
          value={point?.connectedToUuid ?? " "}
        >
          <MenuItem value={" "}>None</MenuItem>
          {patterns[selectedPatternId]?.points?.map((p, i) =>
            i !== index ? <MenuItem value={p?.uuid}>point {i}</MenuItem> : null
          )}
        </Select>
      </div>
    ));

    return (
      <div>
        {form}
        <Button
          onClick={() => {
            let patternToUpdate = patterns[selectedPatternId];
            patternToUpdate?.points.push({
              uuid: createGuid(),
              x: 0,
              y: 0,
              connectedToUuid: null,
            });
            setPatterns(patterns, onPatternUpdate());
          }}
          style={{ marginTop: "5px", width: "225px" }}
          size="small"
          color="primary"
          variant="contained"
          startIcon={<AddIcon />}
        >
          Add
        </Button>
      </div>
    );
  };

  const renderPatterns = () => {
    const items = getPatternsForm();

    return (
      <div id="patterns-wrapper">
        <h2>Patterns</h2>
        <p>Patterns can be used on the animation page</p>
        <div id="patterns-form-wrapper">
          <small>Scale</small>
          <br />
          <Slider
            style={{ width: "94%" }}
            onChange={(e, value) => {
              let updatedPatterns = patterns;
              let patternToUpdate = updatedPatterns[selectedPatternId];
              patternToUpdate.scale = value;

              setPatterns(updatedPatterns);
              drawPattern(patternToUpdate);
            }}
            defaultValue={1}
            min={0.1}
            max={1}
            aria-labelledby="continuous-slider"
            valueLabelDisplay="auto"
            step={0.1}
          />
          <InputLabel id="demo-simple-select-label">Select pattern</InputLabel>
          <Select
            onChange={(e) => {
              setSelectedPatternId(e.target.value);
              drawPattern(patterns[e.target.value]);
            }}
            value={selectedPatternId}
            labelId="demo-simple-select"
            id="demo-simple-select"
          >
            {patterns?.map((pattern, index) => (
              <MenuItem key={`${index}-pattern`} value={index}>
                {index}
              </MenuItem>
            ))}
          </Select>
          <Button
            onClick={() => {
              let updatedPatterns = patterns;
              updatedPatterns.push(patternPlaceholder);
              setSelectedPatternId(updatedPatterns.length - 1);
              drawPattern(patterns[updatedPatterns.length - 1]);
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
              let updatedPatterns = patterns;
              updatedPatterns.splice(selectedPatternId, 1);
              setSelectedPatternId(updatedPatterns.length - 1);
              drawPattern(patterns[updatedPatterns.length - 1]);
              forceUpdate();
            }}
            style={{ marginLeft: "5px" }}
            size="small"
            color="secondary"
            variant="contained"
            startIcon={<DeleteIcon />}
          >
            Remove
          </Button>
          <Button
            style={{ marginLeft: "5px" }}
            size="small"
            variant="contained"
            aria-controls="simple-menu"
            aria-haspopup="true"
            onClick={handleClick}
          >
            Use template
          </Button>
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={onTemplateMenuClose}
          >
            <MenuItem onClick={() => onTemplateMenuClose("circle")}>
              Circle
            </MenuItem>
          </Menu>
          <Divider style={{ marginTop: "5px" }} />
          {items}
        </div>

        <Box id="zones-preview" component="div" display="inline-block">
          <canvas height="400px" width="400px" id="pattern-canvas" />
        </Box>
      </div>
    );
  };

  const content = <div>{renderPatterns()}</div>;

  return (
    <div>
      <SideNav content={content} settings={sideNavSettings} />
    </div>
  );
}
