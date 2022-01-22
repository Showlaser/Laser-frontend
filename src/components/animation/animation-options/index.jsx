import { Divider, TextField } from "@material-ui/core";
import CrudComponent from "components/shared/crud-component";
import { useEffect, useState, React } from "react";
import {
  getAnimations,
  removeAnimation,
  saveAnimation,
} from "services/logic/animation-logic";
import "./index.css";

export default function AnimationOptions(props) {
  const [animations, setAnimations] = useState([]);
  const [selectedAnimationId, setSelectedAnimationId] = useState();
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

  useEffect(() => {
    getAnimations().then((value) => setAnimations(value));
  }, [modalOptions]);

  const deleteAnimation = () => {
    let updatedAnimations = animations;
    const animationUuid = updatedAnimations[selectedAnimationId]?.uuid;
    updatedAnimations.splice(selectedAnimationId, 1);
    removeAnimation(animationUuid);

    setSelectedAnimationId(updatedAnimations.length - 1);
  };

  return (
    <div id="animation-options">
      <CrudComponent
        selectOption={{
          selectText: "Select animation",
          onChange: (selectedId) => setSelectedAnimationId(selectedId),
          selectedValue: selectedAnimationId,
        }}
        itemsArray={animations}
        actions={{
          onSave: () => {
            props?.setChangesSaved(true);
            saveAnimation(animations[selectedAnimationId]);
          },
          onAdd: () => {
            props?.setChangesSaved(false);
            let updatedAnimations = animations;
            setSelectedAnimationId(updatedAnimations.length - 1);
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
