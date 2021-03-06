import { Button, Divider, TextField } from "@mui/material";
import Modal from "components/modal";
import CrudComponent from "components/shared/crud-component";
import { useState, React, useCallback } from "react";
import {
  playAnimation,
  removeAnimation,
  saveAnimation,
} from "services/logic/animation-logic";
import { createGuid } from "services/shared/math";
import "./index.css";
import SendIcon from "@mui/icons-material/Send";
import { deepClone } from "services/shared/general";

export default function AnimationOptions({
  animations,
  selectedAnimationUuid,
  changesSaved,
  updateAnimationProperty,
  setSelectedAnimationUuid,
  setChangesSaved,
  setAnimations,
}) {
  const [modalOptions, setModalOptions] = useState({
    title: "Delete animation?",
    show: false,
    onOkClick: null,
    onCancelClick: () => closeModal(),
  });
  const [, updateState] = useState();
  const [animationPlaying, setAnimationPlaying] = useState(false);
  const forceUpdate = useCallback(() => updateState({}), []);

  const selectedAnimation = animations?.find(
    (a) => a?.uuid === selectedAnimationUuid
  );

  const closeModal = () => {
    let modal = modalOptions;
    modal.show = false;
    setModalOptions(modal);
    forceUpdate();
  };

  const deleteAnimation = () => {
    let updatedAnimations = deepClone(animations);
    const animationUuid = updatedAnimations?.find(
      (a) => a.uuid === selectedAnimationUuid
    )?.uuid;
    updatedAnimations.splice(selectedAnimationUuid, 1);
    removeAnimation(animationUuid);
    setAnimations(updatedAnimations);
  };

  const play = () => {
    setAnimationPlaying(true);
    playAnimation(selectedAnimation).then(() => setAnimationPlaying(false));
  };

  return (
    <div id="animation-options">
      <Modal modal={modalOptions} />
      <CrudComponent
        selectOptions={{
          selectText: "Select animation",
          onChange: setSelectedAnimationUuid,
          selectedValue: selectedAnimationUuid,
        }}
        itemsArray={animations}
        actions={{
          onSave: () => {
            setChangesSaved(true);
            saveAnimation(
              animations.find(
                (animation) => animation.uuid === selectedAnimationUuid
              )
            );
          },
          onAdd: () => {
            setChangesSaved(false);
            let updatedAnimations = deepClone(animations);
            const uuid = createGuid();

            updatedAnimations.push({
              uuid,
              name: "New",
              patternAnimations: [],
            });
            setSelectedAnimationUuid(uuid);
            setAnimations(updatedAnimations);
            setChangesSaved(false);
          },
          onDelete: () => {
            let modal = modalOptions;
            modal.show = true;
            modal.onOkClick = () => {
              deleteAnimation();
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
          variant="contained"
          disabled={animationPlaying}
          startIcon={<SendIcon />}
          onClick={play}
          style={{ marginLeft: "5px" }}
          size="small"
        >
          Run
        </Button>
      </CrudComponent>
      <br />
      <Divider />
      <TextField
        value={selectedAnimation?.name ?? "No name"}
        required
        label="Animation name"
        onChange={(e) => updateAnimationProperty("name", e.target.value)}
      />
    </div>
  );
}
