import "./index.css";

export default function TimeLineChannel({
  timeline,
  animationPatternsInTimeline,
  onTimelineChannelItemClick,
}) {
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
                animationPattern?.animationSettings?.at(-1)?.startTime
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
