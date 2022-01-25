import { Divider, TextField } from "@material-ui/core";
import CrudComponent from "components/shared/crud-component";
import { useState, React } from "react";
import { removeAnimation, saveAnimation } from "services/logic/animation-logic";
import { createGuid } from "services/shared/math";
import "./index.css";

export default function AnimationOptions(props) {
  const { animations, selectedAnimationUuid } = props;
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
        selectOption={{
          selectText: "Select animation",
          onChange: (selectedId) => props?.setSelectedAnimationId(selectedId),
          selectedValue: selectedAnimationUuid,
        }}
        itemsArray={animations}
        actions={{
          onSave: () => {
            props?.setChangesSaved(true);
            saveAnimation(animations[selectedAnimationUuid]);
          },
          onAdd: () => {
            props?.setChangesSaved(false);
            let updatedAnimations = [...animations];
            const uuid = createGuid();

            updatedAnimations.push({
              uuid,
              name: "New",
              patternAnimations: [],
            });
            props?.setSelectedAnimationUuid(uuid);
            props.setAnimations(updatedAnimations);
            props?.setChangesSaved(false);
          },
          onDelete: () => {
            let modal = modalOptions;
            modal.show = true;
            modal.onOkClick = () => {
              deleteAnimation();
              closeModal();
            };
            setModalOptions(modal);
            props?.setChangesSaved(false);
          },
        }}
        changesSaved={props?.changesSaved}
      />
      <br />
      <Divider />
      <TextField label="Animation name" />
    </div>
  );
}
