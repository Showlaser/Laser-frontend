import { useEffect } from "react";
import "./index.css";

export default function TimeLineChannel({
  timeline,
  animationPatternsInTimeline,
  onTimelineChannelItemClick,
}) {
  useEffect(() => [animationPatternsInTimeline]);

  return (
    <div className="timeline-channel">
      <div className="timeline-identifier">
        <p>{timeline?.index}:</p>
      </div>
      <div>
        {animationPatternsInTimeline?.map((animationPattern) => (
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
