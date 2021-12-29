import PatternSelector from "./pattern-selector";
import { getPatterns } from "services/logic";
import React, { useEffect, useState } from "react";
import "./index.css";
import Timeline from "./timeline";

export default function PatternTimelineSection(props) {
  const [patterns, setPatterns] = useState([]);

  useEffect(() => {
    getPatterns().then((value) => setPatterns(value.map((p) => p.name)));
  }, []);

  const onPatternSelect = (selectedPatternName) => {
    alert(selectedPatternName);
  };

  return (
    <div id="pattern-timeline-section">
      <div id="pattern-selector">
        <PatternSelector
          data={{
            callback: (value) => onPatternSelect(value),
            options: patterns,
          }}
        />
      </div>
      <div id="timeline">
        <Timeline />
      </div>
    </div>
  );
}
