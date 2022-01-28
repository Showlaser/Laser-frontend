import { Divider, TextField } from "@material-ui/core";
import CrudComponent from "components/shared/crud-component";
import { useState, React } from "react";
import { removeAnimation, saveAnimation } from "services/logic/animation-logic";
import { createGuid } from "services/shared/math";
import "./index.css";

export default function AnimationOptions(props) {
  const {
    animations,
    selectedAnimationUuid,
    changesSaved,
    updateAnimationProperty,
    setSelectedAnimationUuid,
    setChangesSaved,
    setAnimations,
  } = props;
  const [modalOptions, setModalOptions] = useState({
    title: "Delete pattern?",
    show: false,
    onOkClick: null,
    onCancelClick: () => closeModal(),
  });

  const closeModal = () => {
    let modal = modalOptions;
    modal.show = false;
    setModalOptions(modal);
  };

  const deleteAnimation = () => {
    let updatedAnimations = animations;
    const animationUuid = updatedAnimations[selectedAnimationUuid]?.uuid;
    updatedAnimations.splice(selectedAnimationUuid, 1);
    removeAnimation(animationUuid);

    props?.setSelectedAnimationId(updatedAnimations.length - 1);
  };

  return (
    <div id="animation-options">
      <CrudComponent
        selectOptions={{
          selectText: "Select animation",
          onChange: (selectedUuid) => {
            setSelectedAnimationUuid(selectedUuid);
          },
          selectedValue: selectedAnimationUuid,
        }}
        itemsArray={animations}
        actions={{
          onSave: () => {
            setChangesSaved(true);
            saveAnimation(animations[selectedAnimationUuid]);
          },
          onAdd: () => {
            setChangesSaved(false);
            let updatedAnimations = [...animations];
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
            setChangesSaved(false);
          },
        }}
        changesSaved={changesSaved}
      />
      <br />
      <Divider />
      <TextField
        label="Animation name"
        onChange={(e) => updateAnimationProperty("name", e.target.value)}
      />
    </div>
  );
}
