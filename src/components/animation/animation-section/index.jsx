import AnimationSettings from "./settings";
import "./index.css";
import AnimationTimeline from "./animation-timeline";
import { useEffect } from "react";

export default function AnimationSection(props) {
  const { selectedPattern, patterns, setPatterns } = props;

  useEffect(() => [props]);

  return (
    <div id="animation-section">
      <AnimationSettings
        patterns={patterns}
        setPatterns={setPatterns}
        selectedPattern={selectedPattern}
      />
      <AnimationTimeline selectedPattern={selectedPattern} />
    </div>
  );
}
