import { useEffect } from "react";
import "./index.css";

export default function TimeLineChannel({
  timeline,
  itemsInTimeline,
  onTimelineChannelItemClick,
  itemsInTimelineSubItemsName,
}) {
  useEffect(() => [itemsInTimeline]);

  return (
    <div className="timeline-channel">
      <div className="timeline-identifier">
        <p>{timeline?.index}:</p>
      </div>
      <div>
        {itemsInTimeline?.map((item) => (
          <div
            style={{
              marginLeft: `${item?.startTimeOffset}px`,
              width: `${
                item[itemsInTimelineSubItemsName]
                  ?.sort((a, b) => (a.startTime > b.startTime ? 1 : -1))
                  ?.at(-1)?.startTime
              }px`,
            }}
            key={item?.uuid + "timeline"}
            onClick={() => {
              onTimelineChannelItemClick(item.uuid);
            }}
            className="timeline-channel-item"
          >
            {item.name}
          </div>
        ))}
      </div>
    </div>
  );
}
