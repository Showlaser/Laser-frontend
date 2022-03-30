import { Box, Card, CardContent, Divider, Typography } from "@mui/material";
import React from "react";
import "./index.css";
import ComputerIcon from "@mui/icons-material/Computer";
import CloudIcon from "@mui/icons-material/Cloud";
import PhoneLinkIcon from "@mui/icons-material/Phonelink";

export default function Installation() {
  const [selectedId, setSelectedId] = React.useState(-1);
  const options = [
    {
      nr: 0,
      text: "Local",
      icon: <ComputerIcon />,
      description:
        "Save data on your local computer. This option causes more waiting time if large amounts of data is stored.",
    },
    {
      nr: 1,
      text: "Cloud",
      icon: <CloudIcon />,
      description:
        "Save data in the cloud. This option is the best if large amounts of data is stored.",
    },
    {
      nr: 2,
      text: "Both",
      icon: <PhoneLinkIcon />,
      description:
        "Save data in the cloud and on your local computer. This option is the best if you want to work on different computers and want to work offline. This option is the slowest but recommended.",
    },
  ];

  return (
    <div id="installation">
      <h2>Storage option</h2>
      <p>
        Configure how you want to store your data. You can change this setting
        later.
      </p>
      {selectedId !== -1 ? <b>{options[selectedId].text} selected</b> : null}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          textAlign: "center",
          flexDirection: "row",
          p: 6,
          m: 1,
        }}
      >
        {options.map((option) => (
          <Card
            className="installation-card"
            onClick={() => setSelectedId(option.nr)}
          >
            <CardContent
              style={{
                backgroundColor: selectedId === option.nr ? "gray" : null,
              }}
            >
              {option.icon}
              <Typography>{option.text}</Typography>
              <Divider />
              <small>{option.description}</small>
            </CardContent>
          </Card>
        ))}
      </Box>
    </div>
  );
}
