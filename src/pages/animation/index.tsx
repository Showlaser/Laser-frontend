import "./index.css";
import React from "react";
import PopoverMenu from "components/shared/popover-menu";
import { MenuItem } from "@mui/material";
import SideNav from "components/sidenav";

export default () => {
  return (
    <SideNav>
      <PopoverMenu>
        <MenuItem onClick={() => alert("Test")}>Test</MenuItem>
        <MenuItem>
          <PopoverMenu>
            <MenuItem onClick={() => alert("Test")}>Test2</MenuItem>
          </PopoverMenu>
        </MenuItem>
      </PopoverMenu>
    </SideNav>
  );
};
