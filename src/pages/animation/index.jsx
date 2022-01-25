import { React, useState, useEffect } from "react";
import SideNav from "components/sidenav";
import PatternTimelineSection from "components/animation/pattern-timeline-section";
import AnimationSection from "components/animation/animation-section";
import AnimationOptions from "components/animation/animation-options";
import "./index.css";
import { getAnimations } from "services/logic/animation-logic";
import { getPatterns } from "services/logic/pattern-logic";
import { emptyGuid } from "services/shared/math";

export default function AnimationEditor() {
  const [selectedAnimationUuid, setSelectedAnimationUuid] = useState(
    emptyGuid()
  );
  const [selectedPatternUuid, setSelectedPatternUuid] = useState(emptyGuid());
  const [animations, setAnimations] = useState([]);
  const [patterns, setPatterns] = useState([]);
  const [changesSaved, setChangesSaved] = useState(true);

  const selectedPattern = patterns;

  useEffect(() => {
    getAnimations().then((value) => setAnimations(value));
    getPatterns().then((value) => setPatterns(value));
  }, []);

  const sideNavSettings = {
    pageName: "Animation editor",
  };

  const updateAnimationProperty = (property, value) => {
    if (typeof property !== "string") {
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
      {animations.length > 0 ? (
        <div>
          <AnimationSection
            animations={animations}
            patterns={patterns}
            setPatterns={setPatterns}
            selectedPattern={selectedPattern}
          />
          <PatternTimelineSection
            animations={animations}
            patterns={patterns}
            selectedPatternUuid={selectedPatternUuid}
            selectedAnimationUuid={selectedAnimationUuid}
            setAnimations={setAnimations}
            onPatternSelect={(uuid) => {
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
