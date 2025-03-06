import {
  Divider,
  Fade,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  Tooltip,
} from "@mui/material";
import React, { useState } from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Link } from "react-router-dom";
import paths from "services/shared/router-paths";
import LogoutIcon from "@mui/icons-material/Logout";

export default function AccountPopover() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Tooltip title="Account">
        <IconButton onClick={handleClick} area-haspopup="true" id="account-popover-button">
          <AccountCircleIcon />
        </IconButton>
      </Tooltip>
      <Menu
        id="account-popover-menu"
        anchorEl={anchorEl}
        open={open}
        area-labelledby="account-popover-button"
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <div style={{ padding: "5px" }}>
          <Fade in={open} timeout={1000}>
            <span>
              <h4 style={{ textAlign: "center" }}>Welcome Vincent</h4>
              <Divider />
              <List>
                <ListItemButton component={Link} to={paths.Account}>
                  <ListItemIcon>
                    <AccountCircleIcon />
                  </ListItemIcon>
                  <ListItemText primary="Manage account" />
                </ListItemButton>
                <ListItemButton component={Link} to={paths.Logout}>
                  <ListItemIcon>
                    <LogoutIcon />
                  </ListItemIcon>
                  <ListItemText primary="Logout" />
                </ListItemButton>
              </List>
            </span>
          </Fade>
        </div>
      </Menu>
    </>
  );
}
