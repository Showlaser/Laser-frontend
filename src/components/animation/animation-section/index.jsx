import AnimationSettings from "./settings";
import "./index.css";
import AnimationTimeline from "./animation-timeline";
import { useCallback, useEffect, useState } from "react";
import { stringIsEmpty } from "services/shared/general";
import { createGuid } from "services/shared/math";
import Modal from "components/modal";

export default function AnimationSection(props) {
  const [timeLineCurrentMs, setTimeLineCurrentMs] = useState(0);
  const [, updateState] = useState();
  const forceUpdate = useCallback(() => updateState({}), []);

  const {
    setAnimations,
    animations,
    selectedPatternAnimationUuid,
    selectedAnimationUuid,
  } = props;

  const [modalOptions, setModalOptions] = useState({
    title: "Delete pattern animation?",
    show: false,
    onOkClick: null,
    onCancelClick: () => closeModal(),
  });

  const closeModal = () => {
    let modal = { ...modalOptions };
    modal.show = false;
    setModalOptions(modal);
  };

  useEffect(() => [
    animations,
    selectedPatternAnimationUuid,
    selectedAnimationUuid,
  ]);

  const selectedPatternAnimation =
    animations !== undefined
      ? animations
          .find((ua) => ua.uuid === selectedAnimationUuid)
          .patternAnimations.find(
            (pa) => pa.uuid === selectedPatternAnimationUuid
          )
      : undefined;

  const updateAnimationSetting = (property, value) => {
    if (typeof property !== "string" || stringIsEmpty(property)) {
      return;
    }

    let updatedAnimations = [...animations];
    let selectedPattern = updatedAnimations
      .find((ua) => ua.uuid === selectedAnimationUuid)
      .patternAnimations.find((pa) => pa.uuid === selectedPatternAnimationUuid);

    let patternAnimationSettingToUpdate =
      selectedPattern.animationSettings.find(
        (ase) => ase.startTime === timeLineCurrentMs
      );

    if (patternAnimationSettingToUpdate === undefined) {
      let setting = { ...selectedPattern?.animationSettings?.at(0) };
      setting.uuid = createGuid();
      setting.startTime = timeLineCurrentMs;

      selectedPattern.animationSettings.push(setting);
      setAnimations(updatedAnimations);
      return;
    }

    patternAnimationSettingToUpdate[property] = value;
    setAnimations(updatedAnimations);
  };

  const deletePatternAnimation = () => {
    let animationsToUpdate = [...animations];
    let animationToUpdate = animationsToUpdate.find(
      (ato) => ato.uuid === selectedAnimationUuid
    );
    let indexToDelete = animationToUpdate.patternAnimations.findIndex(
      (pa) => pa.uuid === selectedPatternAnimationUuid
    );

    if (animationToUpdate === undefined || indexToDelete === -1) {
      return;
    }

    animationToUpdate.patternAnimations.splice(indexToDelete, 1);
    setAnimations(animationsToUpdate);
  };

  const updatePatternAnimation = (property, value) => {
    if (typeof property !== "string" || stringIsEmpty(property)) {
      return;
    }

    let updatedAnimations = [...animations];
    let patternAnimationToUpdate = updatedAnimations
      .find((ua) => ua.uuid === selectedAnimationUuid)
      .patternAnimations.find((pa) => pa.uuid === selectedPatternAnimationUuid);

    if (patternAnimationToUpdate === undefined) {
      return;
    }

    patternAnimationToUpdate[property] = value;
    setAnimations(updatedAnimations);
  };

  return selectedPatternAnimation !== undefined ? (
    <div id="animation-section">
      <Modal modal={modalOptions} />
      <AnimationSettings
        selectedPatternAnimation={selectedPatternAnimation}
        updateAnimationSetting={updateAnimationSetting}
        updatePatternAnimation={updatePatternAnimation}
        timeLineCurrentMs={timeLineCurrentMs}
        deletePatternAnimation={() => {
          let modal = modalOptions;
          modal.show = true;
          modal.onOkClick = () => {
            deletePatternAnimation();
            closeModal();
          };
          forceUpdate();
          setModalOptions(modal);
        }}
      />
      <AnimationTimeline
        timeLineCurrentMs={timeLineCurrentMs}
        setTimeLineCurrentMs={setTimeLineCurrentMs}
        patternAnimationSettings={selectedPatternAnimation.animationSettings}
      />
    </div>
  ) : null;
}
