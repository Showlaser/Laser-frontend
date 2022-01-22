import { React, useState, useEffect } from "react";
import SideNav from "components/sidenav";
import PatternTimelineSection from "components/animation/pattern-timeline-section";
import AnimationSection from "components/animation/animation-section";
import AnimationOptions from "components/animation/animation-options";
import "./index.css";

export default function AnimationEditor() {
  const [selectedPattern, setSelectedPattern] = useState();
  const [changesSaved, setChangesSaved] = useState(true);

  useEffect(() => [selectedPattern, changesSaved]);

  const sideNavSettings = {
    pageName: "Animation editor",
  };

  const content = (
    <div id="animation">
      <AnimationOptions
        setChangesSaved={setChangesSaved}
        changesSaved={changesSaved}
      />
      <AnimationSection selectedPattern={selectedPattern} />
      <PatternTimelineSection
        onPatternSelect={(pattern) => {
          setChangesSaved(false);
          setSelectedPattern(pattern);
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
