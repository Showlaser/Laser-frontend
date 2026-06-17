import MusicNoteIcon from "@mui/icons-material/MusicNote";
import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import RepeatIcon from "@mui/icons-material/Repeat";
import RepeatOneIcon from "@mui/icons-material/RepeatOne";
import ShuffleIcon from "@mui/icons-material/Shuffle";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import VolumeDownIcon from "@mui/icons-material/VolumeDown";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import {
  Alert,
  Button,
  Divider,
  Fade,
  FormControlLabel,
  Grid,
  IconButton,
  Menu,
  Skeleton,
  Slider,
  Switch,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  getPlayerState,
  pausePlayer,
  previousSong,
  seekToPosition,
  setPlayerVolume,
  setRepeat,
  setShuffle,
  skipSong,
  startPlayer,
} from "services/logic/spotify";
import paths from "services/shared/router-paths";
import { dataSavingIsEnabled } from "services/shared/user-settings";
import { OnTrue } from "../on-true";

const formatMsToTime = (ms: number): string => {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

export default function SpotifyController() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [player, setPlayer] = useState<SpotifyApi.CurrentPlaybackResponse>(
    {} as SpotifyApi.CurrentPlaybackResponse,
  );
  const [noActiveDevice, setNoActiveDevice] = useState<boolean>(false);
  const [progressMs, setProgressMs] = useState<number>(0);
  const [isSeeking, setIsSeeking] = useState<boolean>(false);
  const [volumePercent, setVolumePercent] = useState<number>(0);
  const [isAdjustingVolume, setIsAdjustingVolume] = useState<boolean>(false);
  const open = Boolean(anchorEl);
  const { palette } = useTheme();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const userIsLoggedIntoSpotify =
    localStorage.getItem("SpotifyAccessToken") !== null &&
    localStorage.getItem("SpotifyAccessToken") !== "undefined";

  useEffect(() => {
    if (!open) {
      return;
    }

    getData();
    const interval = setInterval(() => getData(), dataSavingIsEnabled() ? 5000 : 2000);
    return () => clearInterval(interval);
  }, [open]);

  // Keep the progress bar moving smoothly between the (throttled) API polls
  // by advancing a local counter, while each poll re-syncs it to Spotify.
  // While the user is scrubbing, leave the local value alone.
  useEffect(() => {
    if (isSeeking) {
      return;
    }

    setProgressMs(player?.progress_ms ?? 0);
  }, [player, isSeeking]);

  // Mirror the device volume locally so the slider can be dragged smoothly,
  // unless the user is currently adjusting it.
  useEffect(() => {
    if (isAdjustingVolume) {
      return;
    }

    setVolumePercent(player?.device?.volume_percent ?? 0);
  }, [player, isAdjustingVolume]);

  useEffect(() => {
    if (!open || !player?.is_playing || isSeeking) {
      return;
    }

    const duration = player?.item?.duration_ms ?? 0;
    const interval = setInterval(
      () => setProgressMs((previous) => Math.min(previous + 500, duration)),
      500,
    );
    return () => clearInterval(interval);
  }, [open, player?.is_playing, player?.item?.duration_ms, isSeeking]);

  const getData = async () => {
    const playerResult = await getPlayerState();
    if (playerResult?.device === undefined) {
      setNoActiveDevice(true);
      return;
    }

    setNoActiveDevice(false);
    setPlayer(playerResult);
  };

  const onPlay = async () => {
    await startPlayer();
  };

  const onPause = async () => {
    await pausePlayer();
  };

  const onSeekCommitted = async (positionMs: number) => {
    await seekToPosition(positionMs);
    setProgressMs(positionMs);
    setIsSeeking(false);
  };

  const onToggleShuffle = async () => {
    await setShuffle(!player?.shuffle_state);
    await getData();
  };

  const onCycleRepeat = async () => {
    const nextState: SpotifyApi.PlaybackRepeatState =
      player?.repeat_state === "off"
        ? "context"
        : player?.repeat_state === "context"
          ? "track"
          : "off";
    await setRepeat(nextState);
    await getData();
  };

  const onVolumeCommitted = async (nextVolumePercent: number) => {
    await setPlayerVolume(nextVolumePercent);
    setVolumePercent(nextVolumePercent);
    setIsAdjustingVolume(false);
  };

  const isLoading = player?.item === undefined;
  const durationMs = player?.item?.duration_ms ?? 0;

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

    const imageUrl =
      player?.item?.album?.images?.at(1)?.url ?? player?.item?.album?.images?.at(0)?.url;
    return (
      <div style={{ padding: "20px", width: "350px" }}>
        <Fade in={open} timeout={1000}>
          <span>
            {imageUrl === undefined ? (
              <Skeleton animation="wave" variant="rectangular" width={300} height={282.5} />
            ) : (
              <Fade style={{ width: 300, height: 300 }} in={imageUrl !== undefined} timeout={1000}>
                <img src={imageUrl} alt="Song image" />
              </Fade>
            )}
            <br />
            <label
              style={{
                fontSize: "90%",
              }}
            >
              {`${player?.item?.artists[0]?.name ?? "loading"} / `}
              {`${player?.item?.name ?? "loading"}`}
            </label>
            <Grid container justifyContent="center">
              <Grid>
                <Tooltip title="Shuffle" placement="bottom-end">
                  <IconButton
                    disabled={isLoading}
                    size="small"
                    color={player?.shuffle_state ? "primary" : "default"}
                    onClick={onToggleShuffle}
                  >
                    <ShuffleIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Previous song" placement="bottom">
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
                <Tooltip title="Next song" placement="bottom">
                  <IconButton disabled={isLoading} size="small" onClick={skipSong}>
                    <SkipNextIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip
                  title={player?.repeat_state === "track" ? "Repeat one" : "Repeat"}
                  placement="bottom-start"
                >
                  <IconButton
                    disabled={isLoading}
                    size="small"
                    color={player?.repeat_state !== "off" ? "primary" : "default"}
                    onClick={onCycleRepeat}
                  >
                    {player?.repeat_state === "track" ? <RepeatOneIcon /> : <RepeatIcon />}
                  </IconButton>
                </Tooltip>
              </Grid>
            </Grid>
            {isLoading ? (
              <Skeleton animation="wave" variant="rectangular" width={300} height={4} />
            ) : (
              <>
                <Slider
                  size="small"
                  min={0}
                  max={durationMs}
                  value={Math.min(progressMs, durationMs)}
                  onChange={(_, value) => {
                    setIsSeeking(true);
                    setProgressMs(value as number);
                  }}
                  onChangeCommitted={(_, value) => onSeekCommitted(value as number)}
                  aria-label="Seek song position"
                />
                <Grid container justifyContent="space-between">
                  <Typography variant="caption">{formatMsToTime(progressMs)}</Typography>
                  <Typography variant="caption">{formatMsToTime(durationMs)}</Typography>
                </Grid>
                <Grid container alignItems="center" spacing={1}>
                  <Grid item>
                    <VolumeDownIcon fontSize="small" />
                  </Grid>
                  <Grid item xs>
                    <Slider
                      size="small"
                      min={0}
                      max={100}
                      value={volumePercent}
                      onChange={(_, value) => {
                        setIsAdjustingVolume(true);
                        setVolumePercent(value as number);
                      }}
                      onChangeCommitted={(_, value) => onVolumeCommitted(value as number)}
                      aria-label="Volume"
                    />
                  </Grid>
                  <Grid item>
                    <VolumeUpIcon fontSize="small" />
                  </Grid>
                </Grid>
              </>
            )}
            <br />
            <Divider />
            <FormControlLabel
              disabled={isLoading}
              control={<Switch key="lgc-switch" />}
              label="Enable lasershow generation"
            />
            <OnTrue onTrue={dataSavingIsEnabled()}>
              <small style={{ color: palette.warning.main }}>
                Data saving enabled. Updating every 5 seconds
              </small>
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
