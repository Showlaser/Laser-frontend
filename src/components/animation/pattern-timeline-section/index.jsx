import PatternSelector from "./pattern-selector";
import { getPatterns } from "services/logic/pattern-logic";
import React, { useEffect, useState } from "react";
import "./index.css";
import Timeline from "./timeline";

export default function PatternTimelineSection(props) {
  const [patterns, setPatterns] = useState([]);
  const [patternsInTimeline, setPatternsInTimeline] = useState([]);

  useEffect(() => {
    getPatterns().then((value) => setPatterns(value));
  }, [patternsInTimeline, props]);

  const onPatternSelect = (selectedPatternName) => {
    const selectedPattern = patterns.find(
      (p) => p.name === selectedPatternName
    );

    props.onPatternSelect(selectedPattern);
    let newPatternsInTimeline = patternsInTimeline;
    newPatternsInTimeline.push({
      pattern: selectedPattern,
      timeLineId: 1,
    });

    setPatternsInTimeline(newPatternsInTimeline);
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
          patternsInTimeline={patternsInTimeline}
        />
      </div>
    </div>
  );
}
