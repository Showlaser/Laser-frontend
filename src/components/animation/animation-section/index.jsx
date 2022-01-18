import AnimationSettings from "./settings";
import "./index.css";
import AnimationTimeline from "./animation-timeline";
import { useEffect } from "react";

export default function AnimationSection(props) {
  useEffect(() => [props]);

  return (
    <div id="animation-section">
      <AnimationSettings selectedPattern={props.selectedPattern} />
      <AnimationTimeline selectedPattern={props.selectedPattern} />
    </div>
  );
}
