import { React, useState, useEffect } from "react";
import SideNav from "components/sidenav";
import PatternTimelineSection from "components/animation/pattern-timeline-section";
import AnimationSection from "components/animation/animation-section";
import AnimationOptions from "components/animation/animation-options";
import "./index.css";
import { getAnimations } from "services/logic/animation-logic";
import { getPatterns } from "services/logic/pattern-logic";

export default function AnimationEditor() {
  const [selectedAnimationId, setSelectedAnimationId] = useState(0);
  const [selectedPatternId, setSelectedPatternId] = useState(0);
  const [animations, setAnimations] = useState([]);
  const [patterns, setPatterns] = useState([]);
  const [changesSaved, setChangesSaved] = useState(true);

  const selectedAnimation = animations[selectedAnimationId];

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
    updatedAnimations[selectedAnimationId][property] = value;
    setAnimations(updatedAnimations);
  };

  const content = (
    <div id="animation">
      <AnimationOptions
        setAnimations={setAnimations}
        animations={animations}
        setChangesSaved={setChangesSaved}
        changesSaved={changesSaved}
      />
      <AnimationSection
        animations={animations}
        selectedPatternId={selectedAnimationId}
      />
      <PatternTimelineSection
        animations={animations}
        patterns={patterns}
        selectedPatternId={selectedPatternId}
        selectedAnimationId={selectedAnimationId}
        setAnimations={setAnimations}
        onPatternSelect={(patternId) => {
          setChangesSaved(false);
          setSelectedPatternId(patternId);
        }}
      />
    </div>
  );

  return (
    <div>
      <SideNav content={content} settings={sideNavSettings} />
    </div>
  );
}
