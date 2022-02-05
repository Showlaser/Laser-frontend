import { useEffect } from "react";
import { createGuid } from "services/shared/math";
import "./index.css";

export default function TimeLineChannel(props) {
  const { timeline } = props;

  useEffect(() => [props]);

  return (
    <div className="timeline-channel">
      <div className="timeline-identifier">
        <p>{timeline?.index}:</p>
      </div>
      <div className="timeline-content">
        {timeline?.animationPatterns?.map((animationPattern) => (
          <span
            style={{
              marginLeft: `${
                animationPattern?.animationSettings[0]?.startTime +
                animationPattern?.startTimeOffset
              }px`,
            }}
            key={createGuid()}
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
