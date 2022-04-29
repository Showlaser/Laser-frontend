import TimeLineChannel from "./timeline-channel";

export default function Timeline({
  itemsInTimeline,
  onTimelineChannelItemClick,
  getSubItemDuration,
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
          itemsInTimeline={itemsInTimeline?.filter(
            (p) => p.timeLineId === index
          )}
          onTimelineChannelItemClick={onTimelineChannelItemClick}
          key={index + "timelinechannel"}
          timeline={timeline}
          getSubItemDuration={getSubItemDuration}
        />
      ))}
    </div>
  );
}
