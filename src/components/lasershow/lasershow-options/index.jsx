import { Button, Divider, TextField } from "@mui/material";
import Modal from "components/modal";
import CrudComponent from "components/shared/crud-component";
import { useState, React, useCallback } from "react";
import { createGuid } from "services/shared/math";
import "./index.css";
import SendIcon from "@mui/icons-material/Send";
import {
  playLasershow,
  removeLasershow,
  saveLasershow,
} from "services/logic/lasershow-logic";

export default function LasershowOptions({
  lasershows,
  selectedLasershowUuid,
  changesSaved,
  updateLasershowProperty,
  setSelectedLasershowUuid,
  setChangesSaved,
  setLasershows,
}) {
  const [modalOptions, setModalOptions] = useState({
    title: "Delete lasershow?",
    show: false,
    onOkClick: null,
    onCancelClick: () => closeModal(),
  });
  const [, updateState] = useState();
  const [lasershowPlaying, setLasershowPlaying] = useState(false);
  const forceUpdate = useCallback(() => updateState({}), []);

  const selectedLasershow = lasershows?.find(
    (l) => l?.uuid === selectedLasershowUuid
  );

  const closeModal = () => {
    let modal = modalOptions;
    modal.show = false;
    setModalOptions(modal);
  };

  const deleteLasershow = () => {
    let updatedLasershows = structuredClone(lasershows);
    const lasershowUuid = updatedLasershows?.find(
      (l) => l.uuid === selectedLasershowUuid
    )?.uuid;
    updatedLasershows.splice(selectedLasershowUuid, 1);
    removeLasershow(lasershowUuid);
    setLasershows(updatedLasershows);
  };

  const play = () => {
    setLasershowPlaying(true);
    playLasershow(selectedLasershow).then(() => setLasershowPlaying(false));
  };

  return (
    <div id="lasershow-options">
      <Modal modal={modalOptions} />
      <CrudComponent
        selectOptions={{
          selectText: "Select lasershow",
          onChange: setSelectedLasershowUuid,
          selectedValue: selectedLasershowUuid,
        }}
        itemsArray={lasershows}
        actions={{
          onSave: () => {
            setChangesSaved(true);
            saveLasershow(
              lasershows.find(
                (lasershow) => lasershow.uuid === selectedLasershowUuid
              )
            );
          },
          onAdd: () => {
            setChangesSaved(false);
            let updatedLasershows = structuredClone(lasershows);
            const uuid = createGuid();

            updatedLasershows.push({
              uuid,
              name: "New lasershow",
              animations: [],
            });
            setSelectedLasershowUuid(uuid);
            setLasershows(updatedLasershows);
            setChangesSaved(false);
          },
          onDelete: () => {
            let modal = modalOptions;
            modal.show = true;
            modal.onOkClick = () => {
              deleteLasershow();
              closeModal();
            };
            setModalOptions(modal);
            forceUpdate();
            setChangesSaved(false);
          },
        }}
        changesSaved={changesSaved}
      >
        <Button
          variant="outlined"
          disabled={lasershowPlaying}
          startIcon={<SendIcon />}
          onClick={play}
        >
          Run
        </Button>
      </CrudComponent>
      <br />
      <Divider />
      <TextField
        value={selectedLasershow?.name ?? "No name"}
        required
        label="Lasershow name"
        onChange={(e) => updateLasershowProperty("name", e.target.value)}
      />
    </div>
  );
}
