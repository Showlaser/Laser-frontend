import { Box } from "@material-ui/core";
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
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-start",
        flexDirection: "column",
      }}
    >
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
    </Box>
  );
}
