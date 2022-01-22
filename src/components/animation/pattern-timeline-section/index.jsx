import PatternSelector from "./pattern-selector";
import React from "react";
import "./index.css";
import Timeline from "./timeline";
import { getAnimationTimelinePlaceholder } from "services/logic/animation-logic";

export default function PatternTimelineSection(props) {
  const { patterns, animations, selectedPatternId, selectedAnimationId } =
    props;

  const selectedAnimation = animations[selectedAnimationId];

  const onPatternSelect = (selectedPatternName) => {
    const selectedPatternIndex = patterns.findIndex(
      (p) => p.name === selectedPatternName
    );

    if (selectedPatternIndex === -1) {
      return;
    }

    props.onPatternSelect(selectedPatternIndex);

    let updatedAnimations = [...animations];
    let updatedAnimation = updatedAnimations[selectedAnimationId];

    updatedAnimation?.animationTimeline?.push(
      getAnimationTimelinePlaceholder(
        patterns[selectedPatternIndex],
        updatedAnimation
      )
    );

    props?.setAnimation(updatedAnimations);
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
          patternsInTimeline={selectedAnimation?.animationTimeline}
        />
      </div>
    </div>
  );
}
