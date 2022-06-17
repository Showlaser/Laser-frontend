import React, { useCallback, useEffect, useState } from "react";
import { emptyGuid } from "services/shared/math";
import SideNav from "components/shared/sidenav";
import "./index.css";
import {
  getCircleTemplate,
  getPatterns,
  getPatternPlaceHolder,
  removePattern,
  savePattern,
  playPattern,
} from "services/logic/pattern-logic";
import DeleteModal from "components/modal";
import CrudComponent from "components/shared/crud-component";
import PointsForm from "components/shared/point-form";
import { deepClone, stringIsEmpty } from "services/shared/general";
import PointsDrawer from "components/shared/points-drawer";
import SendIcon from "@mui/icons-material/Send";
import { Alert, Button, Divider, TextField } from "@mui/material";
import Loading from "components/shared/loading";
import HighPoweredBeamsWarning from "components/shared/high-powered-beams-warning";

export default function PatternEditor() {
  const [selectedPatternUuid, setSelectedPatternAnimationUuid] = useState(
    emptyGuid()
  );
  const [patterns, setPatterns] = useState();
  const [, updateState] = useState();
  const forceUpdate = useCallback(() => updateState({}), []);
  const [changesSaved, setChangesSaved] = useState(true);
  const [patternPlaying, setPatternPlaying] = useState(false);
  const [modalOptions, setModalOptions] = useState({
    title: "Delete pattern?",
    show: false,
    onOkClick: null,
    onCancelClick: () => closeModal(),
  });
  const selectedPattern =
    patterns?.find((p) => p?.uuid === selectedPatternUuid) ?? patterns?.at(-1);

  useEffect(() => {
    getPatterns().then((p) => {
      let pat = p;
      if (p?.length <= 0) {
        pat.push(getPatternPlaceHolder());
      }

      setSelectedPatternAnimationUuid(pat?.at(0)?.uuid);
      setPatterns(pat);
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
    let updatedPatterns = deepClone(patterns).filter(
      (p) => p?.uuid !== selectedPatternUuid
    );
    removePattern(selectedPatternUuid);

    if (updatedPatterns.length === 0) {
      loadTemplate(() => getPatternPlaceHolder());
      return;
    }

    const lastItem = updatedPatterns.at(-1);
    setSelectedPatternAnimationUuid(lastItem?.uuid);
  };

  const loadTemplate = (templateFunction) => {
    setChangesSaved(false);
    const template = templateFunction();
    let patternsToUpdate = deepClone(patterns);
    patternsToUpdate.push(template);
    setPatterns(patternsToUpdate);

    const lastItem = patternsToUpdate.at(-1);
    setSelectedPatternAnimationUuid(lastItem?.uuid);
  };

  const updatePatternProperty = (property, value) => {
    if (typeof property !== "string" || stringIsEmpty(property)) {
      return;
    }

    let updatedPatterns = deepClone(patterns);
    let patternToUpdate = updatedPatterns.find(
      (up) => up?.uuid === selectedPatternUuid
    );
    patternToUpdate[property] = value;
    setPatterns(updatedPatterns);
  };

  const play = () => {
    setPatternPlaying(true);
    playPattern(selectedPattern).then(() => setPatternPlaying(false));
  };

  const content = (
    <Loading objectToLoad={patterns}>
      <div id="patterns-wrapper">
        <DeleteModal modal={modalOptions} />
        <HighPoweredBeamsWarning />
        <h2>Patterns</h2>
        <p>Patterns can be used on the lasershow page</p>
        <div id="patterns-form-wrapper">
          <CrudComponent
            selectOptions={{
              selectText: "Select pattern",
              onChange: (selectedUuid) => {
                setSelectedPatternAnimationUuid(selectedUuid);
              },
              selectedValue: selectedPatternUuid,
            }}
            itemsArray={patterns}
            actions={{
              onSave: () => {
                setChangesSaved(true);
                savePattern(
                  patterns.find((p) => p?.uuid === selectedPatternUuid)
                );
              },
              onAdd: () => {
                setChangesSaved(false);
                let updatedPatterns = deepClone(patterns);
                const placeHolder = getPatternPlaceHolder();
                updatedPatterns.push(placeHolder);
                setPatterns(updatedPatterns);
                setSelectedPatternAnimationUuid(placeHolder.uuid);
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
          >
            <Button
              variant="contained"
              disabled={patternPlaying}
              startIcon={<SendIcon />}
              onClick={play}
              style={{ marginLeft: "5px" }}
              size="small"
            >
              Run
            </Button>
          </CrudComponent>
          <Divider style={{ marginTop: "5px" }} />
          <TextField
            label="Pattern name"
            value={selectedPattern?.name ?? ""}
            onChange={(e) => updatePatternProperty("name", e.target.value)}
          />
          <PointsForm
            namePlaceHolder="Pattern name"
            item={selectedPattern}
            onChange={(newPoints) => updatePatternProperty("points", newPoints)}
          />
        </div>

        <PointsDrawer points={selectedPattern?.points} />
      </div>
    </Loading>
  );

  return (
    <div>
      <SideNav content={content} settings={sideNavSettings} />
    </div>
  );
}
