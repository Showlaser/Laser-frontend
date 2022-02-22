import { useEffect } from "react";
import TimeLineChannel from "./timeline-channel";

export default function Timeline({
  patternsInTimeline,
  onTimelineChannelItemClick,
}) {
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
            (p) => p.timeLineId === index
          )}
          onTimelineChannelItemClick={onTimelineChannelItemClick}
          key={index + "timelinechannel"}
          timeline={timeline}
        />
      ))}
    </div>
  );
}
