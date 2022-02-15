import TimeLineChannel from "./timeline-channel";

export default function Timeline(props) {
  const { patternsInTimeline } = props;
  const timelines = [
    {
      index: 0,
    },
    {
      index: 1,
    },
    {
      index: 2,
    },
  ];

  return (
    <div>
      {timelines?.map((timeline, index) => (
        <TimeLineChannel
          animationPatternsInTimeline={patternsInTimeline?.filter(
            (p) => p.timelineId === index
          )}
          onTimelineChannelItemClick={props.onTimelineChannelItemClick}
          key={index + "timelinechannel"}
          timeline={timeline}
        />
      ))}
    </div>
  );
}
