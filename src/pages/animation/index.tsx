import "./index.css";
import React from "react";
import SideNav from "components/sidenav";
import TemporaryDrawer from "components/shared/drawer";
import { IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import PublicIcon from "@mui/icons-material/Public";
import SvgToCoordinatesConverter from "components/svg-to-coordinates-converter";

export default function AnimationPage() {
  return (
    <SideNav>
      <TemporaryDrawer
        location="bottom"
        button={
          <IconButton>
            <MenuIcon />
          </IconButton>
        }
        topMenuItems={[
          {
            icon: <AttachFileIcon />,
            text: "Import from file",
            onClick: () => {
              alert("file!");
            },
          },
          {
            icon: <PublicIcon />,
            text: "Import from online",
            onClick: () => {
              alert("online!");
            },
          },
        ]}
      />
      <SvgToCoordinatesConverter />
    </SideNav>
  );
}
