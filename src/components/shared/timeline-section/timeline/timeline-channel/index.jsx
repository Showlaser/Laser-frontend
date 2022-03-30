import { useEffect } from "react";
import "./index.css";

export default function TimeLineChannel({
  timeline,
  itemsInTimeline,
  onTimelineChannelItemClick,
}) {
  useEffect(() => [itemsInTimeline]);

  return (
    <div className="timeline-channel">
      <div className="timeline-identifier">
        <p>{timeline?.index}:</p>
      </div>
      <div>
        {itemsInTimeline?.map((animationPattern) => (
          <div
            style={{
              marginLeft: `${animationPattern?.startTimeOffset}px`,
              width: `${
                animationPattern?.animationSettings
                  ?.sort((a, b) => (a.startTime > b.startTime ? 1 : -1))
                  ?.at(-1)?.startTime
              }px`,
            }}
            key={animationPattern?.uuid + "timeline"}
            onClick={() => {
              onTimelineChannelItemClick(animationPattern.uuid);
            }}
            className="timeline-channel-item"
          >
            {animationPattern.name}
          </div>
        ))}
      </div>
    </div>
  );
}
