import LasershowOptions from "components/lasershow/lasershow-options";
import TimelineSection from "components/shared/timeline-section";
import SideNav from "components/sidenav";
import { useEffect, useState } from "react";
import { getAnimations } from "services/logic/animation-logic";
import {
  getLasershowAnimationPlaceHolder,
  getLasershows,
} from "services/logic/lasershow-logic";
import { stringIsEmpty } from "services/shared/general";
import { emptyGuid } from "services/shared/math";

export default function LaserShow() {
  const [lasershows, setLasershows] = useState([]);
  const [animations, setAnimations] = useState([]);
  const [selectedAnimationUuid, setSelectedAnimationUuid] = useState(
    emptyGuid()
  );
  const [selectedLasershowUuid, setSelectedLasershowUuid] = useState(
    emptyGuid()
  );
  const [changesSaved, setChangesSaved] = useState();

  useEffect(() => {
    getLasershows().then((data) => setLasershows(data));
    getAnimations().then((data) => setAnimations(data));
  }, []);

  const addAnimationToLasershow = (selectedAnimation) => {
    if (selectedAnimation === undefined) {
      return;
    }

    let updatedLasershows = structuredClone(lasershows);
    let updatedLasershow = updatedLasershows.find(
      (l) => l.uuid === selectedLasershowUuid
    );

    const placeholder = getLasershowAnimationPlaceHolder(
      updatedLasershow,
      selectedAnimation
    );
    updatedLasershow?.animations?.push(placeholder);
    setLasershows(updatedLasershows);

    setChangesSaved(false);
    setSelectedAnimationUuid(placeholder.uuid);
  };

  const updateLasershowProperty = (property, value) => {
    if (typeof property !== "string" || stringIsEmpty(property)) {
      return;
    }

    let updatedLasershows = structuredClone(lasershows);
    let lasershowToUpdate = updatedLasershows.find(
      (l) => l.uuid === selectedLasershowUuid
    );
    lasershowToUpdate[property] = value;
    setLasershows(updatedLasershows);
    setChangesSaved(false);
  };

  const getAnimationDuration = (lasershowAnimation) => {
    let highestStartTime = 0;
    lasershowAnimation?.animation?.patternAnimations.forEach(
      (patternAnimation) => {
        const startTime = patternAnimation?.animationSettings
          ?.sort((a, b) => (a.startTime < b.startTime ? -1 : 1))
          .at(-1)?.startTime;
        if (startTime !== undefined && startTime > highestStartTime) {
          highestStartTime = startTime;
        }
      }
    );

    return highestStartTime;
  };

  const content = (
    <div>
      <LasershowOptions
        lasershows={lasershows}
        selectedLasershowUuid={selectedLasershowUuid}
        changesSaved={changesSaved}
        updateLasershowProperty={updateLasershowProperty}
        setSelectedLasershowUuid={setSelectedLasershowUuid}
        setChangesSaved={setChangesSaved}
        setLasershows={setLasershows}
      />
      {lasershows.length > 0 ? (
        <div>
          <TimelineSection
            setSelectedSubItemUuid={setSelectedAnimationUuid}
            getSubItemDuration={getAnimationDuration}
            subItemsName="animations"
            items={lasershows}
            availableItems={animations}
            selectedSubItemUuid={selectedAnimationUuid}
            selectedItemUuid={selectedLasershowUuid}
            setItems={setAnimations}
            onSelect={addAnimationToLasershow}
          />
        </div>
      ) : null}
    </div>
  );

  const settings = {
    pageName: "Lasershow",
  };

  return <SideNav content={content} settings={settings} />;
}
