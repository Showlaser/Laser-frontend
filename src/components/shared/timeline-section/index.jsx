import SubItemSelector from "./subitem-selector";
import React, { useEffect } from "react";
import "./index.css";
import Timeline from "./timeline";

export default function TimelineSection({
  items,
  availableItems,
  selectedSubItemUuid,
  selectedItemUuid,
  setItems,
  onSelect,
}) {
  useEffect(() => [
    items,
    availableItems,
    selectedSubItemUuid,
    selectedItemUuid,
    setItems,
    onSelect,
  ]);

  const selectedItem = items.find((a) => a.uuid === selectedItemUuid);

  const onSubItemSelect = (selectedSubItemName) => {
    const selectedSubItem = availableItems.find(
      (p) => p.name === selectedSubItemName
    );

    onSelect(selectedSubItem);
  };

  return (
    <div id="subitem-timeline-section">
      <div id="subitem-selector">
        <SubItemSelector
          onSubitemSelect={onSubItemSelect}
          options={availableItems?.map((p) => p.name)}
        />
      </div>
      <div id="timeline">
        <Timeline
          onTimelineChannelItemClick={onSelect}
          itemsInTimeline={selectedItem?.patternAnimations}
        />
      </div>
    </div>
  );
}
