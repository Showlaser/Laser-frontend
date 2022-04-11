import { React, useState, useEffect } from "react";
import SideNav from "components/sidenav";
import AnimationSection from "components/animation/animation-section";
import AnimationOptions from "components/animation/animation-options";
import "./index.css";
import {
  getAnimations,
  getPatternAnimationPlaceholder,
} from "services/logic/animation-logic";
import { getPatterns } from "services/logic/pattern-logic";
import { createGuid, emptyGuid } from "services/shared/math";
import { stringIsEmpty } from "services/shared/general";
import TimelineSection from "components/shared/timeline-section";

export default function AnimationEditor() {
  const [selectedAnimationUuid, setSelectedAnimationUuid] = useState(
    emptyGuid()
  );
  const [selectedPatternAnimationUuid, setSelectedPatternAnimationUuid] =
    useState();
  const [animations, setAnimations] = useState([]);
  const [patterns, setPatterns] = useState([]);
  const [changesSaved, setChangesSaved] = useState(true);

  useEffect(() => {
    getAnimations().then((animationCollection) => {
      animationCollection.forEach((animation) => {
        animation.patternAnimations.forEach((pa) => {
          pa.animationSettings.forEach((ast) => {
            ast.points = ast?.points?.sort((a, b) =>
              a.order > b.order ? 1 : -1
            );
          });
        });
      });

      setAnimations(animationCollection);
      const animationUuid = animationCollection.at(0)?.uuid ?? emptyGuid();
      setSelectedAnimationUuid(animationUuid);

      const patternAnimationUuid =
        animationCollection.at(0)?.patternAnimations.at(0)?.uuid ?? emptyGuid();
      setSelectedPatternAnimationUuid(patternAnimationUuid);
    });
    getPatterns().then((p) => setPatterns(p));
  }, []);

  const sideNavSettings = {
    pageName: "Lasershow editor",
  };

  const updateAnimationProperty = (property, value) => {
    if (typeof property !== "string" || stringIsEmpty(property)) {
      return;
    }

    let updatedAnimations = structuredClone(animations);
    let animationToUpdate = updatedAnimations.find(
      (ua) => ua.uuid === selectedAnimationUuid
    );
    animationToUpdate[property] = value;
    setAnimations(updatedAnimations);
    setChangesSaved(false);
  };

  const addPatternToAnimation = (selectedPattern) => {
    if (selectedPattern === undefined) {
      return;
    }

    let updatedAnimations = structuredClone(animations);
    let updatedAnimation = updatedAnimations.find(
      (a) => a.uuid === selectedAnimationUuid
    );

    const placeholder = getPatternAnimationPlaceholder(
      selectedPattern,
      updatedAnimation
    );
    updatedAnimation?.patternAnimations?.push(placeholder);
    setAnimations(updatedAnimations);

    setChangesSaved(false);
    setSelectedPatternAnimationUuid(placeholder.uuid);
  };

  const duplicatePatternAnimation = (selectedPatternAnimation) => {
    if (selectedPatternAnimation === undefined) {
      return;
    }

    let newPatternAnimation = structuredClone(selectedPatternAnimation);
    newPatternAnimation.uuid = createGuid();
    newPatternAnimation.name += " duplicate";
    newPatternAnimation.animationSettings.forEach((setting) => {
      setting.uuid = createGuid();
      setting.points.forEach((point) => (point.uuid = createGuid()));
    });

    let updatedAnimations = structuredClone(animations);
    let updatedAnimation = updatedAnimations.find(
      (a) => a.uuid === selectedAnimationUuid
    );

    updatedAnimation?.patternAnimations?.push(newPatternAnimation);
    setAnimations(updatedAnimations);

    setChangesSaved(false);
    setSelectedPatternAnimationUuid(newPatternAnimation.uuid);
  };

  const content = (
    <div id="animation">
      <AnimationOptions
        setAnimations={setAnimations}
        setSelectedAnimationUuid={setSelectedAnimationUuid}
        animations={animations}
        setChangesSaved={setChangesSaved}
        changesSaved={changesSaved}
        updateAnimationProperty={updateAnimationProperty}
        selectedAnimationUuid={selectedAnimationUuid}
      />
      {animations?.length > 0 ? (
        <div>
          <AnimationSection
            duplicatePatternAnimation={duplicatePatternAnimation}
            setAnimations={setAnimations}
            animations={animations}
            patterns={patterns}
            selectedAnimationUuid={selectedAnimationUuid}
            selectedPatternAnimationUuid={selectedPatternAnimationUuid}
          />
          <TimelineSection
            items={animations}
            setSelectedSubItemUuid={setSelectedPatternAnimationUuid}
            subItemsName="patternAnimations"
            getSubItemDuration={(item) => {
              return item.animationSettings
                ?.sort((a, b) => (a.startTime > b.startTime ? 1 : -1))
                ?.at(-1)?.startTime;
            }}
            availableItems={patterns}
            selectedSubItemUuid={selectedPatternAnimationUuid}
            selectedItemUuid={selectedAnimationUuid}
            setItems={setAnimations}
            onSelect={addPatternToAnimation}
          />
        </div>
      ) : null}
    </div>
  );

  return (
    <div>
      <SideNav content={content} settings={sideNavSettings} />
    </div>
  );
}
