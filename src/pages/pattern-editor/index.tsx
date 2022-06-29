import "./index.css";
import React, { useState } from "react";
import SideNav from "components/shared/sidenav";
import TemporaryDrawer from "components/shared/drawer";
import {
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import SvgToCoordinatesConverter from "components/svg-to-coordinates-converter";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";

export default function PatternPage() {
  const [uploadedFile, setUploadedFiles] = useState<any>();
  const [forceCloseDrawer, setForceCloseDrawer] = useState<boolean>(false);

  return (
    <SideNav pageName="Pattern editor">
      <TemporaryDrawer
        forceClose={forceCloseDrawer}
        location="bottom"
        button={
          <IconButton>
            <MenuIcon />
          </IconButton>
        }
      >
        <span>
          <input
            hidden
            id="raised-button-file"
            type="file"
            accept="image/svg+xml"
            onChange={(e) => {
              if (e?.target?.files === null) {
                return;
              }

              setUploadedFiles(e.target.files[0]);
              setForceCloseDrawer(true);
            }}
          />
          <label htmlFor="raised-button-file">
            <ListItem button key={"file-button"}>
              <ListItemIcon>
                <AttachFileIcon />
              </ListItemIcon>
              <ListItemText primary="Import from local file" />
            </ListItem>
          </label>
        </span>
      </TemporaryDrawer>
      <br />
      {uploadedFile === undefined ? (
        <div>
          <ArrowUpwardIcon />
          <p>No file selected! Click the menu above to select a pattern.</p>
        </div>
      ) : (
        <SvgToCoordinatesConverter uploadedFile={uploadedFile} />
      )}
    </SideNav>
  );
}
