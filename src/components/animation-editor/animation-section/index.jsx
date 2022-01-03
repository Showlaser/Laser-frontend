import AnimationSettings from "./settings";
import "./index.css";
import AnimationTimeline from "./animation-timeline";

export default function AnimationSection(props) {
  return (
    <div id="animation-section">
      <AnimationSettings />
      <AnimationTimeline />
    </div>
  );
}
