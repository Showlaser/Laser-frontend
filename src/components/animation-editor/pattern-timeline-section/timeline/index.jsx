import { Box } from "@material-ui/core";
import { useState } from "react";
import TimeLineChannel from "./timeline-channel";

export default function Timeline(props) {
  const [timelines, setTimelines] = useState([
    {
      items: [],
    },
    {
      items: [],
    },
    {
      items: [],
    },
  ]);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-start",
        flexDirection: "column",
      }}
    >
      {timelines?.map((timeline, index) => (
        <TimeLineChannel id={index} />
      ))}
    </Box>
  );
}
