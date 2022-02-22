import { React, useState, useEffect } from "react";
import SideNav from "components/sidenav";
import PatternTimelineSection from "components/animation/pattern-timeline-section";
import AnimationSection from "components/animation/animation-section";
import AnimationOptions from "components/animation/animation-options";
import "./index.css";
import { getAnimations } from "services/logic/animation-logic";
import { getPatterns } from "services/logic/pattern-logic";
import { emptyGuid } from "services/shared/math";
import { stringIsEmpty } from "services/shared/general";

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
    getAnimations().then((a) => {
      setAnimations(a);
      const uuid = a.at(0)?.uuid ?? emptyGuid();
      setSelectedAnimationUuid(uuid);
    });
    getPatterns().then((p) => setPatterns(p));
  }, []);

  const sideNavSettings = {
    pageName: "Animation editor",
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
            setAnimations={setAnimations}
            animations={animations}
            patterns={patterns}
            selectedAnimationUuid={selectedAnimationUuid}
            selectedPatternAnimationUuid={selectedPatternAnimationUuid}
          />
          <PatternTimelineSection
            animations={animations}
            patternAnimations={patterns}
            selectedPatternAnimationUuid={selectedPatternAnimationUuid}
            selectedAnimationUuid={selectedAnimationUuid}
            setAnimations={setAnimations}
            onPatternAnimationSelect={(uuid) => {
              setChangesSaved(false);
              setSelectedPatternAnimationUuid(uuid);
            }}
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
