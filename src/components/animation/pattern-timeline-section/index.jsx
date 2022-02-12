import PatternSelector from "./pattern-selector";
import React, { useEffect } from "react";
import "./index.css";
import Timeline from "./timeline";
import { getPatternAnimationPlaceholder } from "services/logic/animation-logic";

export default function PatternTimelineSection(props) {
  const { patternAnimations, animations, selectedAnimationUuid } = props;

  useEffect(() => [props]);

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

    let updatedAnimations = [...animations];
    let updatedAnimation = updatedAnimations.find(
      (a) => a.uuid === selectedAnimationUuid
    );

    const placeholder = getPatternAnimationPlaceholder(
      selectedPattern,
      updatedAnimation
    );
    updatedAnimation?.patternAnimations?.push(placeholder);
    props.onPatternAnimationSelect(placeholder.uuid);

    props?.setAnimations(updatedAnimations);
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
          onTimelineChannelItemClick={props.onPatternAnimationSelect}
          patternsInTimeline={selectedAnimation?.patternAnimations}
        />
      </div>
    </div>
  );
}
