import AnimationSettings from "./settings";
import "./index.css";
import AnimationTimeline from "./animation-timeline";
import { useCallback, useEffect, useRef, useState } from "react";
import { deepClone, stringIsEmpty } from "services/shared/general";
import { createGuid } from "services/shared/math";
import Modal from "components/confirm-modal";
import PointsDrawer from "components/shared/points-drawer";

export default function AnimationSection({
  duplicatePatternAnimation,
  setAnimations,
  animations,
  selectedPatternAnimationUuid,
  selectedAnimationUuid,
}) {
  const [timeLineCurrentMs, setTimeLineCurrentMs] = useState(0);
  const [, updateState] = useState();
  const forceUpdate = useCallback(() => updateState({}), []);
  const animationStateRef = useRef();
  animationStateRef.current = animations;

  const [modalOptions, setModalOptions] = useState({
    title: "Delete pattern animation?",
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

  useEffect(() => [
    animations,
    selectedPatternAnimationUuid,
    selectedAnimationUuid,
  ]);

  const selectedPatternAnimation =
    animations !== undefined
      ? animationStateRef.current
          ?.find((ua) => ua?.uuid === selectedAnimationUuid)
          ?.patternAnimations?.find(
            (pa) => pa?.uuid === selectedPatternAnimationUuid
          )
      : undefined;

  const selectedSetting =
    selectedPatternAnimation !== undefined
      ? selectedPatternAnimation?.animationSettings?.find(
          (ase) => ase?.startTime === timeLineCurrentMs
        )
      : undefined;

  const updateAnimationSetting = (property, value) => {
    if (typeof property !== "string" || stringIsEmpty(property)) {
      return;
    }

    let updatedAnimations = deepClone(animationStateRef.current);
    let selectedPattern = updatedAnimations
      .find((ua) => ua.uuid === selectedAnimationUuid)
      .patternAnimations.find((pa) => pa.uuid === selectedPatternAnimationUuid);

    let patternAnimationSettingToUpdate =
      selectedPattern.animationSettings.find(
        (ase) => ase.startTime === timeLineCurrentMs
      );

    if (patternAnimationSettingToUpdate === undefined) {
      let setting = deepClone(selectedPattern?.animationSettings?.at(-1));
      setting.uuid = createGuid();
      setting.startTime = timeLineCurrentMs;
      setting.points.forEach((point) => (point.uuid = createGuid()));

      selectedPattern.animationSettings.push(setting);
      setAnimations(updatedAnimations);
      return;
    }

    patternAnimationSettingToUpdate[property] = value;
    setAnimations(updatedAnimations);
  };

  const deletePatternAnimation = () => {
    let animationsToUpdate = deepClone(animations);
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

    let modal = modalOptions;
    modal.show = false;
    setModalOptions(modal);
    forceUpdate();
  };

  const updatePatternAnimation = (property, value) => {
    if (typeof property !== "string" || stringIsEmpty(property)) {
      return;
    }

    let updatedAnimations = deepClone(animations);
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
        duplicatePatternAnimation={duplicatePatternAnimation}
        setTimeLineCurrentMs={setTimeLineCurrentMs}
        timeLineCurrentMs={timeLineCurrentMs}
        selectedSetting={selectedSetting}
        selectedPatternAnimation={selectedPatternAnimation}
        updateAnimationSetting={updateAnimationSetting}
        updatePatternAnimation={updatePatternAnimation}
        deletePatternAnimation={() => {
          let modal = modalOptions;
          modal.show = true;
          modal.onOkClick = () => {
            deletePatternAnimation();
            closeModal();
          };
          setModalOptions(modal);
          forceUpdate();
        }}
      />
      <AnimationTimeline
        timeLineCurrentMs={timeLineCurrentMs}
        setTimeLineCurrentMs={setTimeLineCurrentMs}
        patternAnimationSettings={selectedPatternAnimation.animationSettings}
      />
      <PointsDrawer
        options={{
          rotation: selectedSetting?.rotation ?? 0,
          centerX: selectedSetting?.centerX ?? 0,
          centerY: selectedSetting?.centerY ?? 0,
        }}
        points={selectedSetting?.points}
      />
    </div>
  ) : null;
}
