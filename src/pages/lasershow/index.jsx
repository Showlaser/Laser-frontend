import TimelineSection from "components/shared/timeline-section";
import SideNav from "components/sidenav";
import { useEffect, useState } from "react";

export default function LaserShow() {
  const [lasershows, setLasershows] = useState([]);
  const [animations, setAnimations] = useState([]);
  const [selectedAnimationUuid, setSelectedAnimationUuid] = useState();
  const [selectedLasershowUuid, setSelectedLasershowUuid] = useState();

  useEffect(() => {}, []);

  const content =
    lasershows.length > 0 ? (
      <div>
        <TimelineSection
          items={lasershows}
          availableItems={animations}
          selectedSubItemUuid={selectedAnimationUuid}
          selectedItemUuid={selectedLasershowUuid}
          setItems={setAnimations}
          onSelect={(selectedItem) => {}}
        />
      </div>
    ) : null;

  const settings = {
    pageName: "Lasershow",
  };

  return <SideNav content={content} settings={settings} />;
}
