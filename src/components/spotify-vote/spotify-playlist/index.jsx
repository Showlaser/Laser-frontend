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
import { useState } from "react";

export default function SpotifyPlaylist({
  userPlaylists,
  onVoteStart,
  voteStarted,
}) {
  const [checked, setChecked] = useState([]);

  const handleToggle = (value) => () => {
    const currentIndex = checked.findIndex((e) => e === value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  return (
    <div>
      <h3>Playlists</h3>
      <small>Select the playlists to vote on</small>
      <Divider />
      <List sx={{ width: "100%", bgcolor: "background.paper" }}>
        {userPlaylists?.map((playlist, index) => {
          const labelId = `checkbox-list-label-${index}`;

          return (
            <ListItem key={index} disablePadding>
              <ListItemButton
                role={undefined}
                onClick={handleToggle(playlist?.id)}
                dense
              >
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={
                      checked.findIndex((e) => e === playlist?.id) !== -1
                    }
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
      <Button
        variant="contained"
        disabled={voteStarted}
        onClick={() => onVoteStart(checked)}
      >
        Start vote
      </Button>
    </div>
  );
}
