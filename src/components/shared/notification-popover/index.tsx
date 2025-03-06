import {
  Badge,
  Button,
  Divider,
  Fade,
  IconButton,
  Menu,
  Tooltip,
} from "@mui/material";
import React, { useState } from "react";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SelectList from "components/select-list";
import { Notification } from "models/components/shared/notification";
import { OnTrue } from "../on-true";

export default function NotificationPopover() {
  const [selectedNotificationsUuid, setSelectedNotificationsUuid] =
    React.useState<string[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      uuid: "dffa530c-ea5d-446e-9970-cc8b11a4ad82",
      text: "Laser 1 overheating",
      description: "Current temp 60°C",
    },
  ]);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const onRemoveClick = () => {
    const updatedNotifications = [...notifications].filter(
      (notification) => !selectedNotificationsUuid.includes(notification.uuid)
    );
    setSelectedNotificationsUuid([]);
    setNotifications(updatedNotifications);
  };

  return (
    <>
      <Tooltip title="Notifications">
        <IconButton
          onClick={handleClick}
          area-haspopup="true"
          id="notification-popover-button"
        >
          <Badge badgeContent={notifications?.length} color="error">
            <NotificationsIcon color="action" />
          </Badge>
        </IconButton>
      </Tooltip>
      <Menu
        id="notification-popover-menu"
        anchorEl={anchorEl}
        open={open}
        area-labelledby="notification-popover-button"
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
        <div style={{ padding: "5px", minWidth: "200px" }}>
          <Fade in={open} timeout={1000}>
            <span>
              <h4 style={{ textAlign: "center" }}>Notifications</h4>
              <Divider />
              <SelectList
                onSelect={setSelectedNotificationsUuid}
                items={
                  notifications?.map((notification: Notification) => ({
                    uuid: notification.uuid,
                    name: notification.text,
                    description: notification.description,
                  })) ?? []
                }
              />

              <OnTrue onTrue={selectedNotificationsUuid.length > 0}>
                <Button fullWidth onClick={onRemoveClick} color="error">
                  Delete selected
                </Button>
              </OnTrue>
            </span>
          </Fade>
        </div>
      </Menu>
    </>
  );
}
