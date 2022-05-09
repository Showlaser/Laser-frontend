import "./index.css";
import React, { useEffect } from "react";
import SideNav from "components/sidenav";
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

export default function AnimationPage() {
  const [uploadedFile, setUploadedFiles] = React.useState<any>();

  return (
    <SideNav>
      <TemporaryDrawer
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
            onChange={(e) => {
              if (e?.target?.files === null) {
                return;
              }

              setUploadedFiles(e.target.files[0]);
            }}
          />
          <label htmlFor="raised-button-file">
            <ListItem button key={"file-button"}>
              <ListItemIcon>
                <AttachFileIcon />
              </ListItemIcon>
              <ListItemText primary="Import from file" />
            </ListItem>
          </label>
        </span>
      </TemporaryDrawer>
      <SvgToCoordinatesConverter uploadedFile={uploadedFile} />
    </SideNav>
  );
}
