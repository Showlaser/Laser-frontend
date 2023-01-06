import {
  Button,
  Fade,
  FormControlLabel,
  IconButton,
  LinearProgress,
  Link,
  Menu,
  Skeleton,
  Switch,
  Tooltip,
} from "@mui/material";
import React, { useEffect } from "react";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import { mapNumber } from "services/shared/math";
import {
  getPlayerState,
  getTrackAudioFeatures,
  pausePlayer,
  previousSong,
  skipSong,
  startPlayer,
} from "services/logic/spotify";
import paths from "services/shared/router-paths";
import MusicNoteIcon from "@mui/icons-material/MusicNote";

export default function SpotifyController() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [songData, setSongData] = React.useState<any>({});
  const [player, setPlayer] = React.useState<any>({});
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const userIsLoggedIntoSpotify =
    localStorage.getItem("SpotifyAccessToken") !== null && localStorage.getItem("SpotifyAccessToken") !== "undefined";

  useEffect(() => {
    const interval = setInterval(() => getData(), 2000);
    return () => clearInterval(interval);
  }, [player, songData]);

  const getData = async () => {
    const menuClosed = document.getElementById("spotify-controller-menu") === null;
    if (menuClosed) {
      return;
    }

    const playerResult = await getPlayerStatus();
    if (playerResult?.item?.id !== songData?.id) {
      const trackResult = await getTrackData(playerResult);
      setSongData(trackResult);
    }

    setPlayer(playerResult);
  };

  const getPlayerStatus = async () => await getPlayerState();

  const getTrackData = async (playerResult: any) => await getTrackAudioFeatures(playerResult?.item?.id ?? "");

  const onPlay = async () => {
    await startPlayer();
  };

  const onPause = async () => {
    await pausePlayer();
  };

  const isLoading = player?.item === undefined;

  const getComponentsByLoginState = () => {
    if (userIsLoggedIntoSpotify) {
      const imageUrl = player?.item?.album?.images?.at(1)?.url ?? player?.item?.album?.images?.at(0)?.url;
      return (
        <div style={{ padding: "20px" }}>
          <Fade in={open} timeout={1000}>
            <span>
              {imageUrl === undefined ? (
                <Skeleton animation="wave" variant="rectangular" width={300} height={282.5} />
              ) : (
                <Fade style={{ width: 300, height: 300 }} in={imageUrl !== undefined} timeout={1000}>
                  <img src={imageUrl} />
                </Fade>
              )}
              <br />
              <FormControlLabel
                disabled={isLoading}
                control={<Switch key="lgc-switch" />}
                label="Enable lasershow generation"
              />
              <br />
              <small style={{ color: isLoading ? "gray" : "whitesmoke" }}>{`Bpm: ${parseInt(
                songData?.tempo ?? 0
              )}`}</small>
              <br />
              <small style={{ color: isLoading ? "gray" : "whitesmoke" }}>{`Song: ${
                player?.item?.name ?? "loading"
              }`}</small>
              <br />
              <IconButton disabled={isLoading} onClick={previousSong} size="small">
                <SkipPreviousIcon />
              </IconButton>
              <IconButton disabled={isLoading} size="small" onClick={() => (player?.is_playing ? onPause() : onPlay())}>
                {player?.is_playing ? <PauseIcon /> : <PlayArrowIcon />}
              </IconButton>
              <IconButton disabled={isLoading} size="small" onClick={skipSong}>
                <SkipNextIcon />
              </IconButton>
              {isLoading ? (
                <Skeleton animation="wave" variant="rectangular" width={300} height={4} />
              ) : (
                <LinearProgress
                  variant="determinate"
                  value={mapNumber(player?.progress_ms, 0, player?.item?.duration_ms, 0, 100)}
                />
              )}
            </span>
          </Fade>
        </div>
      );
    } else {
      return (
        <Button variant="contained" href={paths.Settings}>
          Login to Spotify to use this component
        </Button>
      );
    }
  };

  return (
    <>
      <Tooltip title="Spotify / lasershow generator controller">
        <IconButton onClick={handleClick} area-haspopup="true" id="spotify-controller-button">
          <MusicNoteIcon />
        </IconButton>
      </Tooltip>
      <Menu
        id="spotify-controller-menu"
        anchorEl={anchorEl}
        open={open}
        area-labelledby="spotify-controller-button"
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
        {getComponentsByLoginState()}{" "}
      </Menu>
    </>
  );
}
