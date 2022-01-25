import PatternSelector from "./pattern-selector";
import React, { useEffect } from "react";
import "./index.css";
import Timeline from "./timeline";
import { getAnimationTimelinePlaceholder } from "services/logic/animation-logic";

export default function PatternTimelineSection(props) {
  const { patterns, animations, selectedAnimationUuid } = props;

  useEffect(() => [patterns, animations]);

  const selectedAnimation = animations.find(
    (a) => a.uuid === selectedAnimationUuid
  );

  const onPatternSelect = (selectedPatternName) => {
    const selectedPattern = patterns.find(
      (p) => p.name === selectedPatternName
    );

    if (selectedPattern === undefined) {
      return;
    }

    props.onPatternSelect(selectedPattern.uuid);

    let updatedAnimations = [...animations];
    let updatedAnimation = updatedAnimations.find(
      (a) => a.uuid === selectedAnimationUuid
    );

    updatedAnimation?.patternAnimations?.push(
      getAnimationTimelinePlaceholder(selectedPattern, updatedAnimation)
    );

    props?.setAnimations(updatedAnimations);
  };

  return (
    <div id="pattern-timeline-section">
      <div id="pattern-selector">
        <PatternSelector
          data={{
            callback: (value) => onPatternSelect(value),
            options: patterns?.map((p) => p.name),
          }}
        />
      </div>
      <div id="timeline">
        <Timeline
          onTimelineChannelItemClick={props.onPatternSelect}
          patternsInTimeline={selectedAnimation?.patternAnimations}
        />
      </div>
    </div>
  );
}
