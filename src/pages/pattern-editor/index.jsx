import {
  Box,
  Button,
  Divider,
  InputLabel,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  TextField,
} from "@material-ui/core";
import React, { useEffect } from "react";
import {
  createGuid,
  emptyGuid,
  mapNumber,
  valueIsWithinBoundaries,
} from "services/shared/math";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";
import SaveAltIcon from "@material-ui/icons/SaveAlt";
import SideNav from "components/sidenav";
import "./index.css";
import { showError, toastSubject } from "services/shared/toast-messages";
import {
  getCircleTemplate,
  getPatterns,
  patternPlaceHolders,
  removePattern,
  savePattern,
} from "services/logic";
import DeleteModal from "components/modal";

export default function PatternEditor() {
  const [selectedPatternId, setSelectedPatternId] = React.useState(0);
  const [, updateState] = React.useState();
  const forceUpdate = React.useCallback(() => updateState({}), []);
  const [patterns, setPatterns] = React.useState([]);
  const [changesSaved, setChangesSaved] = React.useState(true);
  const [modalOptions, setModalOptions] = React.useState({
    title: "Delete pattern?",
    show: false,
    onOkClick: null,
    onCancelClick: () => closeModal(),
  });

  const closeModal = () => {
    let modal = modalOptions;
    modal.show = false;
    setModalOptions(modal);
    forceUpdate();
  };

  const sideNavSettings = {
    pageName: "Pattern editor",
  };

  useEffect(() => {
    if (patterns.length === 0) {
      getPatterns().then((value) => {
        setPatterns(value);
      });
    }

    drawPattern(patterns[selectedPatternId]);
  }, [patterns, selectedPatternId]);

  const deletePattern = () => {
    let updatedPatterns = patterns;
    const patternUuid = updatedPatterns[selectedPatternId]?.uuid;
    updatedPatterns.splice(selectedPatternId, 1);
    removePattern(patternUuid);

    if (updatedPatterns.length === 0) {
      loadTemplate(() => patternPlaceHolders.New);
      return;
    }

    setSelectedPatternId(updatedPatterns.length - 1);
    drawPattern(patterns[updatedPatterns.length - 1]);
  };

  const drawLine = (ctx, point, selectedId) => {
    if (selectedId === undefined) {
      selectedId = selectedPatternId;
    }

    ctx.moveTo(
      mapNumber(point?.x, 4000, -4000, 400, 0),
      mapNumber(point?.y, 4000, -4000, 0, 400)
    );

    const pointTo = patterns[selectedId]?.points?.find(
      (p) => p.uuid === point?.connectedToUuid
    );

    if (pointTo === undefined) {
      return;
    }

    ctx.lineTo(
      mapNumber(pointTo?.x, 4000, -4000, 400, 0),
      mapNumber(pointTo?.y, 4000, -4000, 0, 400)
    );
  };

  const drawDot = (ctx, point) => {
    ctx.fillRect(
      mapNumber(point?.x, 4000, -4000, 398, 0),
      mapNumber(point?.y, 4000, -4000, 0, 398),
      2,
      2
    );
  };

  const drawPattern = (pattern, selectedId) => {
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
    for (let i = 0; i < length; i++) {
      const point = pattern?.points[i];

      point?.connectedToUuid !== emptyGuid()
        ? drawLine(ctx, point, selectedId)
        : drawDot(ctx, point);
    }
    ctx.stroke();
  };

  const updatePatternPoint = (index, value, axle) => {
    if (!valueIsWithinBoundaries(value, -4000, 4000)) {
      showError(toastSubject.boundaryError);
      return;
    }

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

  const loadTemplate = (templateFunction) => {
    setChangesSaved(false);
    const template = templateFunction();
    let patternsToUpdate = patterns;
    patternsToUpdate.push(template);
    setPatterns(patternsToUpdate, drawPattern(template));
    setSelectedPatternId(patternsToUpdate.length - 1);
    forceUpdate();
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
          name={`x${index}`}
          size="small"
          style={{ margin: "2px" }}
          InputProps={{ inputProps: { min: -4000, max: 4000 } }}
          type="number"
          label="X"
          defaultValue={point.x}
          onChange={(e) => {
            setChangesSaved(false);
            updatePatternPoint(index, Number(e.target.value), "x");
          }}
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
          onChange={(e) => {
            setChangesSaved(false);
            updatePatternPoint(index, Number(e.target.value), "y");
          }}
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
        <small>Pattern name</small>
        <br />
        <TextField
          key={createGuid()}
          defaultValue={patterns[selectedPatternId]?.name}
          placeholder="Pattern name"
          autoFocus
          onChange={(e) => {
            let patternToUpdate = patterns[selectedPatternId];
            patternToUpdate.name = e.target.value;
            setPatterns(patterns);
            setChangesSaved(false);
          }}
        />
        <br />
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
          Add point
        </Button>
      </div>
    );
  };

  const renderPatterns = () => {
    const items = getPatternsForm();

    return (
      <div id="patterns-wrapper">
        <DeleteModal modal={modalOptions} />
        <h2>Patterns</h2>
        <p>Patterns can be used on the animation page</p>
        <div id="patterns-form-wrapper">
          <InputLabel id="demo-simple-select-label">Select pattern</InputLabel>
          <Select
            onChange={(e) => {
              const selectedId = e.target.value;
              setSelectedPatternId(selectedId);
              drawPattern(patterns[selectedId], selectedId);
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
          <Select value={-1} style={{ marginLeft: "5px" }}>
            <MenuItem value={-1}>
              <em>Actions</em>
            </MenuItem>
            <MenuItem
              value={0}
              key="patterns-select-save"
              onClick={() => {
                setChangesSaved(true);
                savePattern(patterns[selectedPatternId]);
              }}
            >
              <ListItemIcon>
                <SaveAltIcon />
              </ListItemIcon>
              <ListItemText>Save</ListItemText>
            </MenuItem>
            <MenuItem
              value={1}
              key="patterns-select-add"
              onClick={() => {
                setChangesSaved(false);
                let updatedPatterns = patterns;
                updatedPatterns.push(patternPlaceHolders.New);
                setSelectedPatternId(updatedPatterns.length - 1);
                drawPattern(patterns[updatedPatterns.length - 1]);
              }}
            >
              <ListItemIcon>
                <AddIcon />
              </ListItemIcon>
              <ListItemText>Add</ListItemText>
            </MenuItem>
            <MenuItem
              value={2}
              key="patterns-select-delete"
              onClick={() => {
                let modal = modalOptions;
                modal.show = true;
                modal.onOkClick = () => {
                  deletePattern();
                  closeModal();
                };
                setModalOptions(modal);
                forceUpdate();
              }}
            >
              <ListItemIcon>
                <DeleteIcon />
              </ListItemIcon>
              <ListItemText>Delete</ListItemText>
            </MenuItem>
            <MenuItem>
              <Select value={-1}>
                <MenuItem value={-1}>
                  <em>Use template</em>
                </MenuItem>
                <MenuItem onClick={() => loadTemplate(getCircleTemplate)}>
                  Circle
                </MenuItem>
              </Select>
            </MenuItem>
          </Select>
          <div style={{ float: "right" }}>
            {changesSaved ? (
              <text>Changes saved</text>
            ) : (
              <text style={{ color: "red" }}>Changes not saved</text>
            )}
          </div>
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
