import {
  Avatar,
  Button,
  Checkbox,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import SideNav from "components/sidenav";
import { useEffect, useState } from "react";
import SpotifyWebApi from "spotify-web-api-js";

export default function SpotifyVote() {
  const Spotify = new SpotifyWebApi();
  const accessToken = localStorage.getItem("SpotifyAccessToken");
  const [userPlaylists, setUserPlaylists] = useState([]);
  const [checked, setChecked] = useState([0]);

  useEffect(() => {
    if (accessToken === null) {
      return;
    }

    Spotify.setAccessToken(accessToken);
    Spotify.getUserPlaylists().then((data) => {
      setUserPlaylists(data?.items);
    });
  }, []);

  const sideNavSettings = {
    pageName: "Vote",
  };

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const content =
    accessToken !== null ? (
      <div>
        <h3>Playlists</h3>
        <small>Select the playlists to vote on</small>
        <Divider />
        <List sx={{ width: "100%", bgcolor: "background.paper" }}>
          {userPlaylists.map((playlist, index) => {
            const labelId = `checkbox-list-label-${index}`;

            return (
              <ListItem key={index} disablePadding>
                <ListItemButton
                  role={undefined}
                  onClick={handleToggle(index)}
                  dense
                >
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={checked.indexOf(index) !== -1}
                      tabIndex={-1}
                      disableRipple
                      inputProps={{ "aria-labelledby": labelId }}
                    />
                  </ListItemIcon>
                  <ListItemAvatar>
                    <Avatar
                      alt="Spotify image"
                      src={playlist?.images?.at(0)?.url}
                    />
                  </ListItemAvatar>
                  <ListItemText id={labelId} primary={playlist?.name} />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
        <Button>Start vote</Button>
      </div>
    ) : (
      <h1>You are not logged in to Spotify. Login in the settings page</h1>
    );

  return (
    <div>
      <SideNav content={content} settings={sideNavSettings} />
    </div>
  );
}
