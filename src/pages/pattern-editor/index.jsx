import { Box, Divider, TextField } from "@material-ui/core";
import React, { useEffect } from "react";
import { createGuid, mapNumber } from "services/shared/math";
import SideNav from "components/sidenav";
import "./index.css";
import {
  getCircleTemplate,
  getPatterns,
  patternPlaceHolders,
  removePattern,
  savePattern,
} from "services/logic/pattern-logic";
import DeleteModal from "components/modal";
import CrudComponent from "components/shared/crud-component";
import PointsForm from "components/shared/point-form";

export default function PatternEditor() {
  const [selectedPatternId, setSelectedPatternId] = React.useState(0);
  const [patterns, setPatterns] = React.useState([]);
  const [, updateState] = React.useState();
  const forceUpdate = React.useCallback(() => updateState({}), []);
  const [changesSaved, setChangesSaved] = React.useState(true);
  const [modalOptions, setModalOptions] = React.useState({
    title: "Delete pattern?",
    show: false,
    onOkClick: null,
    onCancelClick: () => closeModal(),
  });

  useEffect(() => {
    getPatterns().then((p) => {
      setPatterns(p);
      drawPattern(p[selectedPatternId]);
    });
  }, []);

  const closeModal = () => {
    let modal = modalOptions;
    modal.show = false;
    setModalOptions(modal);
    forceUpdate();
  };

  const sideNavSettings = {
    pageName: "Pattern editor",
  };

  const deletePattern = () => {
    let updatedPatterns = [...patterns];
    const patternUuid = updatedPatterns[selectedPatternId]?.uuid;
    updatedPatterns.splice(selectedPatternId, 1);
    removePattern(patternUuid);

    if (updatedPatterns.length === 0) {
      loadTemplate(() => patternPlaceHolders.New);
      return;
    }

    setSelectedPatternId(updatedPatterns.length - 1);
    drawPattern(updatedPatterns[updatedPatterns.length - 1]);
  };

  const drawDot = (ctx, point) => {
    ctx.fillRect(
      mapNumber(point?.x, 4000, -4000, 395, 0),
      mapNumber(point?.y, 4000, -4000, 0, 395),
      3,
      3
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
    for (let i = 0; i < length; i++) {
      const point = pattern?.points[i];
      drawDot(ctx, point);
    }
    ctx.stroke();
  };

  const updatePatternPoint = (index, value, axle) => {
    let updatedPatterns = [...patterns];
    let updatedPattern = updatedPatterns[selectedPatternId];

    updatedPattern.points[index][axle] = value;
    setPatterns(updatedPatterns);
    drawPattern(updatedPatterns[selectedPatternId]);
  };

  const loadTemplate = (templateFunction) => {
    setChangesSaved(false);
    const template = templateFunction();
    let patternsToUpdate = [...patterns];
    patternsToUpdate.push(template);
    setPatterns(patternsToUpdate);
    setSelectedPatternId(patternsToUpdate.length - 1);
    drawPattern(patternsToUpdate[patternsToUpdate.length - 1]);
  };

  const deletePoint = (point) => {
    let patternsToUpdate = [...patterns];
    let patternToUpdate = patternsToUpdate[selectedPatternId];
    const pointIndex = patternToUpdate?.points?.findIndex(
      (p) => p?.uuid === point?.uuid
    );
    if (pointIndex === -1) {
      return;
    }

    patternToUpdate?.points?.splice(pointIndex, 1);
    setPatterns(patternsToUpdate);
    drawPattern(patternsToUpdate[selectedPatternId]);
  };

  const updatePatternProperty = (property, value) => {
    if (typeof property !== "string") {
      return;
    }

    let updatedPatterns = [...patterns];
    updatedPatterns[selectedPatternId][property] = value;
    setPatterns(updatedPatterns);
    drawPattern(updatedPatterns[selectedPatternId]);
  };

  const addPoint = () => {
    const pattern = patterns[selectedPatternId];
    let points = [...pattern.points];
    points.push({
      uuid: createGuid(),
      patternUuid: pattern.uuid,
      x: 0,
      y: 0,
    });

    updatePatternProperty("points", points);
  };

  const content = (
    <div id="patterns-wrapper">
      <DeleteModal modal={modalOptions} />
      <h2>Patterns</h2>
      <p>Patterns can be used on the animation page</p>
      <div id="patterns-form-wrapper">
        <CrudComponent
          selectOptions={{
            selectText: "Select pattern",
            onChange: (selectedId) => {
              setSelectedPatternId(selectedId);
              drawPattern(patterns[selectedId]);
            },
            selectedValue: selectedPatternId,
          }}
          itemsArray={patterns}
          actions={{
            onSave: () => {
              setChangesSaved(true);
              savePattern(patterns[selectedPatternId]);
            },
            onAdd: () => {
              setChangesSaved(false);
              let updatedPatterns = [...patterns];
              updatedPatterns.push(patternPlaceHolders.New);
              setPatterns(updatedPatterns);
              setSelectedPatternId(updatedPatterns.length - 1);
              drawPattern(updatedPatterns[updatedPatterns.length - 1]);
            },
            onDelete: () => {
              let modal = modalOptions;
              modal.show = true;
              modal.onOkClick = () => {
                deletePattern();
                closeModal();
              };
              setModalOptions(modal);
              forceUpdate();
            },
            templates: [
              {
                name: "Circle",
                getTemplate: () => loadTemplate(getCircleTemplate),
              },
            ],
          }}
          changesSaved={changesSaved}
        />
        <Divider style={{ marginTop: "5px" }} />
        <TextField
          label="Pattern name"
          value={patterns[selectedPatternId]?.name ?? ""}
          onChange={(e) => updatePatternProperty("name", e.target.value)}
        />
        <PointsForm
          namePlaceHolder="Pattern name"
          item={patterns[selectedPatternId]}
          addPoint={addPoint}
          onPointUpdate={updatePatternPoint}
          onDelete={deletePoint}
        />
      </div>

      <Box id="zones-preview" component="div" display="inline-block">
        <canvas height="400px" width="400px" id="pattern-canvas" />
      </Box>
    </div>
  );

  return (
    <div>
      <SideNav content={content} settings={sideNavSettings} />
    </div>
  );
}
