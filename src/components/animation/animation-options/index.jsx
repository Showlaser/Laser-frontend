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
  const [changesSaved, setChangesSaved] = useState(true);
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
            setChangesSaved(true);
            saveAnimation(animations[selectedAnimationId]);
          },
          onAdd: () => {
            setChangesSaved(false);
            let updatedAnimations = animations;
            //updatedAnimations.push(patternPlaceHolders.New);
            setSelectedAnimationId(updatedAnimations.length - 1);
          },
          onDelete: () => {
            let modal = modalOptions;
            modal.show = true;
            modal.onOkClick = () => {
              deleteAnimation();
              closeModal();
            };
            setModalOptions(modal);
          },
        }}
        changesSaved={changesSaved}
      />
      <br />
      <Divider />
      <TextField label="Animation name" />
    </div>
  );
}
