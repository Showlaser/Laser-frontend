import { React, useState, useEffect } from "react";
import SideNav from "components/sidenav";
import PatternTimelineSection from "components/animation/pattern-timeline-section";
import AnimationSection from "components/animation/animation-section";
import AnimationOptions from "components/animation/animation-options";

export default function AnimationEditor() {
  const [selectedPattern, setSelectedPattern] = useState();

  useEffect(() => [selectedPattern]);

  const sideNavSettings = {
    pageName: "Animation editor",
  };

  const content = (
    <div>
      <AnimationOptions />
      <AnimationSection selectedPattern={selectedPattern} />
      <PatternTimelineSection
        onPatternSelect={(pattern) => {
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
