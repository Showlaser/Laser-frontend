import {
  Alert,
  Button,
  Divider,
  Fade,
  FormControlLabel,
  FormLabel,
  Grid,
  IconButton,
  LinearProgress,
  Menu,
  Skeleton,
  Switch,
  Tooltip,
  useTheme,
} from "@mui/material";
import React, { useEffect, useState } from "react";
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
import { dataSavingIsEnabled } from "services/shared/user-settings";
import { OnTrue } from "../on-true";

export default function SpotifyController() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [songData, setSongData] = useState<any>({});
  const [player, setPlayer] = useState<any>({});
  const [noActiveDevice, setNoActiveDevice] = useState<boolean>(false);
  const open = Boolean(anchorEl);
  const { palette } = useTheme();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const userIsLoggedIntoSpotify =
    localStorage.getItem("SpotifyAccessToken") !== null && localStorage.getItem("SpotifyAccessToken") !== "undefined";

  useEffect(() => {
    const interval = setInterval(() => getData(), dataSavingIsEnabled() ? 5000 : 2000);
    return () => clearInterval(interval);
  }, [player, songData]);

  const getData = async () => {
    const menuClosed = document.getElementById("spotify-controller-menu") === null;
    if (menuClosed) {
      return;
    }

    const playerResult = await getPlayerState();
    if (playerResult?.device === undefined) {
      setNoActiveDevice(true);
      return;
    }

    setNoActiveDevice(false);

    if (playerResult?.item?.id !== songData?.id) {
      const trackResult = await getTrackAudioFeatures(playerResult?.item?.id ?? "");
      setSongData(trackResult);
    }

    setPlayer(playerResult);
  };

  const onPlay = async () => {
    await startPlayer();
  };

  const onPause = async () => {
    await pausePlayer();
  };

  const isLoading = player?.item === undefined;

  const getComponentsByLoginState = () => {
    if (!userIsLoggedIntoSpotify) {
      return (
        <Button variant="contained" href={paths.Account}>
          Login to Spotify to use this component
        </Button>
      );
    }

    if (noActiveDevice) {
      return (
        <div style={{ margin: "10px" }}>
          <Alert severity="error">Please open Spotify on a device and play a song</Alert>
        </div>
      );
    }

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
            <label style={{ color: isLoading ? "gray" : "whitesmoke", fontSize: "90%" }}>
              {`${player?.item?.artists[0]?.name ?? "loading"} / `}
              {`${player?.item?.name ?? "loading"}`}
            </label>
            <br />
            <small style={{ color: isLoading ? "gray" : "whitesmoke" }}>
              {`Bpm: ${parseInt(songData?.tempo ?? 0)}`}
            </small>
            <Grid container justifyContent="center">
              <Grid>
                <Tooltip title="Previous song" placement="bottom-end">
                  <IconButton disabled={isLoading} onClick={previousSong} size="small">
                    <SkipPreviousIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Pause song" placement="bottom">
                  <IconButton
                    disabled={isLoading}
                    size="small"
                    onClick={() => (player?.is_playing ? onPause() : onPlay())}
                  >
                    {player?.is_playing ? <PauseIcon /> : <PlayArrowIcon />}
                  </IconButton>
                </Tooltip>
                <Tooltip title="Next song" placement="bottom-start">
                  <IconButton disabled={isLoading} size="small" onClick={skipSong}>
                    <SkipNextIcon />
                  </IconButton>
                </Tooltip>
              </Grid>
            </Grid>
            {isLoading ? (
              <Skeleton animation="wave" variant="rectangular" width={300} height={4} />
            ) : (
              <LinearProgress
                variant="determinate"
                value={mapNumber(player?.progress_ms, 0, player?.item?.duration_ms, 0, 100)}
              />
            )}
            <br />
            <Divider />
            <FormControlLabel
              disabled={isLoading}
              control={<Switch key="lgc-switch" />}
              label="Enable lasershow generation"
            />
            <OnTrue onTrue={dataSavingIsEnabled()}>
              <small style={{ color: palette.warning.main }}>Data saving enabled. Updating every 5 seconds</small>
            </OnTrue>
          </span>
        </Fade>
      </div>
    );
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
        {getComponentsByLoginState()}
      </Menu>
    </>
  );
}
