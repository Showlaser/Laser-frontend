import { Box } from "@material-ui/core";
import { useEffect, useState } from "react";
import { createGuid } from "services/shared/math";
import TimeLineChannel from "./timeline-channel";

export default function Timeline(props) {
  const { patternsInTimeline } = props;
  const [timelines, setTimelines] = useState([
    {
      index: 0,
    },
    {
      index: 1,
    },
    {
      index: 2,
    },
  ]);

  useEffect(() => {
    let newTimeLines = [...timelines];
    newTimeLines.forEach((tl, index) => {
      tl.animationPatterns = patternsInTimeline?.filter(
        (p) => p.timelineId === index
      );
    });

    setTimelines(newTimeLines);
  }, [props]);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-start",
        flexDirection: "column",
      }}
    >
      {timelines?.map((timeline) => (
        <TimeLineChannel
          onTimelineChannelItemClick={props.onTimelineChannelItemClick}
          key={createGuid()}
          timeline={timeline}
        />
      ))}
    </Box>
  );
}
