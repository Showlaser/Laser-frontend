import "./index.css";
import React, { useState } from "react";
import SideNav from "components/shared/sidenav";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import { SpeedDial, SpeedDialAction } from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import SettingsIcon from "@mui/icons-material/Settings";

export default function AnimationPage() {
  const [animation, setAnimation] = useState(undefined);

  return (
    <SideNav pageName="Animation editor">
      <div>
        <SpeedDial
          ariaLabel="SpeedDial basic example"
          sx={{ position: "absolute", bottom: 30, right: 30 }}
          icon={animation === undefined ? <SpeedDialIcon /> : <SettingsIcon />}
        >
          <SpeedDialAction
            key="sd-upload"
            icon={
              <label htmlFor="raised-button-file" style={{ cursor: "pointer", padding: "25px" }}>
                <AttachFileIcon style={{ marginTop: "8px" }} />
              </label>
            }
            tooltipTitle="Upload local file"
          />
        </SpeedDial>
      </div>
    </SideNav>
  );
}
