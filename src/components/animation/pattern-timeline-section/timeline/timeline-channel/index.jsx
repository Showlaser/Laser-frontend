import { useEffect } from "react";
import "./index.css";

export default function TimeLineChannel(props) {
  const { timeline, animationPatternsInTimeline } = props;

  useEffect(() => [props]);

  return (
    <div className="timeline-channel">
      <div className="timeline-identifier">
        <p>{timeline?.index}:</p>
      </div>
      <div className="timeline-content">
        {animationPatternsInTimeline?.map((animationPattern) => (
          <span
            style={{
              marginLeft: `${animationPattern?.startTimeOffset}px`,
            }}
            key={animationPattern?.uuid + "timeline"}
            onClick={() => {
              props.onTimelineChannelItemClick(animationPattern.uuid);
            }}
            className="timeline-channel-item"
          >
            {animationPattern.name}
          </span>
        ))}
      </div>
    </div>
  );
}
