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
  const [selectedPatternAnimationUuid, setSelectedPatternUuid] = useState(
    emptyGuid()
  );
  const [animations, setAnimations] = useState([]);
  const [patterns, setPatterns] = useState([]);
  const [changesSaved, setChangesSaved] = useState(true);

  const selectedPatternAnimation = patterns.find(
    (p) => p.uuid === selectedPatternAnimationUuid
  );

  useEffect(() => {
    getAnimations().then((value) => setAnimations(value));
    getPatterns().then((value) => setPatterns(value));
  }, []);

  const sideNavSettings = {
    pageName: "Animation editor",
  };

  const updateAnimationProperty = (property, value) => {
    if (typeof property !== "string" || stringIsEmpty(property)) {
      return;
    }

    let updatedAnimations = [...animations];
    updatedAnimations[selectedAnimationUuid][property] = value;
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
            animationPatterns={patterns}
            selectedPatternAnimationUuid={selectedPatternAnimationUuid}
            selectedAnimationUuid={selectedAnimationUuid}
            setAnimations={setAnimations}
            onPatternAnimationSelect={(uuid) => {
              setChangesSaved(false);
              setSelectedPatternUuid(uuid);
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
