import {
  Avatar,
  Button,
  Checkbox,
  Divider,
  LinearProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import React from "react";
import { useState } from "react";

type Props = {
  userPlaylists: any;
  onVoteStart: any;
  voteStarted: boolean;
};

export default function SpotifyPlaylist({ userPlaylists, onVoteStart, voteStarted }: Props) {
  const [selectedPlaylistIds, setSelectedPlaylistIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = (value: string) => () => {
    const currentIndex = selectedPlaylistIds.findIndex((e) => e === value);
    const newChecked = [...selectedPlaylistIds];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setSelectedPlaylistIds(newChecked);
  };

  const startVote = async () => {
    setIsLoading(true);
    await onVoteStart(selectedPlaylistIds);
    setIsLoading(false);
  };

  return (
    <div style={{ marginBottom: "50px" }}>
      <h3>Playlists</h3>
      <small>Select the playlists to vote on</small>
      <Divider />
      <List style={{ maxHeight: "50vh", overflow: "auto" }} sx={{ width: "100%" }}>
        {userPlaylists?.map((playlist: any, index: number) => {
          const labelId = `checkbox-list-label-${index}`;

          return (
            <ListItem key={index} disablePadding>
              <ListItemButton role={undefined} onClick={handleToggle(playlist?.id)} dense>
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={selectedPlaylistIds.findIndex((e) => e === playlist?.id) !== -1}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{ "aria-labelledby": labelId }}
                  />
                </ListItemIcon>
                <ListItemAvatar>
                  <Avatar alt="Spotify image" src={playlist?.images?.at(0)?.url} />
                </ListItemAvatar>
                <ListItemText id={labelId} primary={playlist?.name} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      <br />
      <Button fullWidth disabled={isLoading || voteStarted} variant="contained" onClick={startVote}>
        Start vote
      </Button>
      {isLoading ? <LinearProgress /> : null}
    </div>
  );
}
