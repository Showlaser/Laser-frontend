import "./index.css";
import React, { useState } from "react";
import SideNav from "components/shared/sidenav";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import { Box, SpeedDial, SpeedDialAction } from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import SvgToCoordinatesConverter from "components/svg-to-coordinates-converter";
import SettingsIcon from "@mui/icons-material/Settings";

export default function PatternPage() {
  const [uploadedFile, setUploadedFile] = useState<any>();

  const getSpeedDialBeforeFileUpload = () => (
    <SpeedDial
      ariaLabel="SpeedDial basic example"
      sx={{ position: "absolute", bottom: 30, right: 30 }}
      icon={uploadedFile === undefined ? <SpeedDialIcon /> : <SettingsIcon />}
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
  );

  return (
    <SideNav pageName="Pattern editor">
      {uploadedFile === undefined ? null : (
        <SvgToCoordinatesConverter uploadedFile={uploadedFile} setUploadedFile={setUploadedFile} />
      )}
      <Box>
        <input
          hidden
          id="raised-button-file"
          type="file"
          key={uploadedFile?.name}
          accept="image/svg+xml"
          onChange={(e) => {
            if (e?.target?.files === null) {
              return;
            }

            setUploadedFile(e.target.files[0]);
          }}
        />
        {uploadedFile === undefined ? getSpeedDialBeforeFileUpload() : null}
      </Box>
    </SideNav>
  );
}
