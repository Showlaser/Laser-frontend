import PatternSelector from "./pattern-selector";
import React, { useEffect } from "react";
import "./index.css";
import Timeline from "./timeline";
import { getPatternAnimationPlaceholder } from "services/logic/animation-logic";

export default function PatternTimelineSection({
  animations,
  patternAnimations,
  selectedPatternAnimationUuid,
  selectedAnimationUuid,
  setAnimations,
  onPatternAnimationSelect,
}) {
  useEffect(() => [
    animations,
    patternAnimations,
    selectedPatternAnimationUuid,
    selectedAnimationUuid,
    setAnimations,
    onPatternAnimationSelect,
  ]);

  const selectedAnimation = animations.find(
    (a) => a.uuid === selectedAnimationUuid
  );

  const onPatternSelect = (selectedPatternName) => {
    const selectedPattern = patternAnimations.find(
      (p) => p.name === selectedPatternName
    );

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
    onPatternAnimationSelect(placeholder.uuid);
    setAnimations(updatedAnimations);
  };

  return (
    <div id="pattern-timeline-section">
      <div id="pattern-selector">
        <PatternSelector
          onPatternSelect={onPatternSelect}
          options={patternAnimations?.map((p) => p.name)}
        />
      </div>
      <div id="timeline">
        <Timeline
          onTimelineChannelItemClick={onPatternAnimationSelect}
          patternsInTimeline={selectedAnimation?.patternAnimations}
        />
      </div>
    </div>
  );
}
