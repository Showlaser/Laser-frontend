import AnimationSettings from "./settings";
import "./index.css";
import AnimationTimeline from "./animation-timeline";
import { useEffect, useState } from "react";
import { stringIsEmpty } from "services/shared/general";

export default function AnimationSection(props) {
  const [timeLineCurrentMs, setTimeLineCurrentMs] = useState(0);
  const {
    setAnimations,
    animations,
    selectedPatternAnimationUuid,
    selectedAnimationUuid,
  } = props;

  useEffect(() => [props]);

  const selectedPatternAnimation =
    animations !== undefined
      ? animations
          .find((ua) => ua.uuid === selectedAnimationUuid)
          .patternAnimations.find(
            (pa) => pa.uuid === selectedPatternAnimationUuid
          )
      : undefined;

  const updateAnimationSettings = (property, value) => {
    if (typeof property !== "string" || stringIsEmpty(property)) {
      return;
    }

    let updatedAnimations = [...animations];
    let patternAnimationSettingsToUpdate = updatedAnimations
      .find((ua) => ua.uuid === selectedAnimationUuid)
      .patternAnimations.find((pa) => pa.uuid === selectedPatternAnimationUuid)
      .animationSettings.find((ase) => ase.startTime === timeLineCurrentMs);

    if (patternAnimationSettingsToUpdate === undefined) {
      alert("Not found");
      return;
    }

    patternAnimationSettingsToUpdate[property] = value;
    setAnimations(updatedAnimations);
  };

  const deletePatternAnimation = (uuid) => {
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
      alert("Not found");
      return;
    }

    patternAnimationToUpdate[property] = value;
    setAnimations(updatedAnimations);
  };

  return selectedPatternAnimation !== undefined ? (
    <div id="animation-section">
      <AnimationSettings
        selectedPatternAnimation={selectedPatternAnimation}
        updateAnimationSettings={updateAnimationSettings}
        updatePatternAnimation={updatePatternAnimation}
        timeLineCurrentMs={timeLineCurrentMs}
        deletePatternAnimation={deletePatternAnimation}
      />
      <AnimationTimeline
        setTimeLineCurrentMs={setTimeLineCurrentMs}
        animationPatterns={selectedPatternAnimation.animationSettings}
      />
    </div>
  ) : null;
}
