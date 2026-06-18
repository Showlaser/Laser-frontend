import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
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
  Box,
  Button,
  Chip,
  Divider,
  Fade,
  FormControlLabel,
  Grid,
  IconButton,
  Link,
  Menu,
  Skeleton,
  Slider,
  Switch,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { keyframes } from "@mui/system";
import React, { useEffect, useRef, useState } from "react";
import {
  getPlayerState,
  getSpotifyDevices,
  pausePlayer,
  previousSong,
  removeSavedSong,
  saveSong,
  seekToPosition,
  setPlayerVolume,
  setRepeat,
  setShuffle,
  skipSong,
  songsAreSaved,
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

const marquee = keyframes`
  0%, 10% { transform: translateX(0); }
  90%, 100% { transform: translateX(var(--marquee-shift)); }
`;

const equalize = keyframes`
  0%, 100% { height: 30%; }
  50% { height: 100%; }
`;

const LASERSHOW_GENERATION_KEY = "LasershowGenerationEnabled";

// Sample the album cover on a small canvas and average its pixels to get a
// dominant colour for the background gradient. Returns null when the image
// cannot be read (e.g. a CORS failure).
const extractDominantColor = (url: string): Promise<string | null> =>
  new Promise((resolve) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => {
      const size = 16;
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const context = canvas.getContext("2d");
      if (context === null) {
        resolve(null);
        return;
      }

      context.drawImage(image, 0, 0, size, size);
      try {
        const { data } = context.getImageData(0, 0, size, size);
        let red = 0;
        let green = 0;
        let blue = 0;
        const pixels = data.length / 4;
        for (let i = 0; i < data.length; i += 4) {
          red += data[i];
          green += data[i + 1];
          blue += data[i + 2];
        }

        resolve(
          `rgb(${Math.round(red / pixels)}, ${Math.round(green / pixels)}, ${Math.round(
            blue / pixels,
          )})`,
        );
      } catch {
        resolve(null);
      }
    };
    image.onerror = () => resolve(null);
    image.src = url;
  });

const EqualizerBars = ({ active, color }: { active: boolean; color: string }) => (
  <Box sx={{ display: "inline-flex", alignItems: "flex-end", gap: "2px", height: 16, width: 18 }}>
    {[0, 1, 2, 3].map((bar) => (
      <Box
        key={bar}
        sx={{
          width: "3px",
          height: "30%",
          backgroundColor: color,
          borderRadius: "1px",
          animation: active ? `${equalize} 0.9s ease-in-out infinite` : "none",
          animationDelay: `${bar * 0.15}s`,
        }}
      />
    ))}
  </Box>
);

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
  const [songIsSaved, setSongIsSaved] = useState<boolean>(false);
  const [titleShift, setTitleShift] = useState<number>(0);
  const [lasershowEnabled, setLasershowEnabled] = useState<boolean>(
    localStorage.getItem(LASERSHOW_GENERATION_KEY) === "true",
  );
  const [gradientColor, setGradientColor] = useState<string | null>(null);
  const titleRef = useRef<HTMLSpanElement>(null);
  // Ignore poll-driven progress syncs until this timestamp, giving Spotify
  // time to register a seek so the slider does not snap back to the old spot.
  const seekSettleUntilRef = useRef<number>(0);
  // Count consecutive empty player responses; Spotify's endpoint returns these
  // intermittently while playback continues, so we only act on repeated misses.
  const noDeviceCountRef = useRef<number>(0);
  const open = Boolean(anchorEl);
  const { palette } = useTheme();

  const imageUrl =
    player?.item?.album?.images?.at(1)?.url ?? player?.item?.album?.images?.at(0)?.url;

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
    if (isSeeking || Date.now() < seekSettleUntilRef.current) {
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

  // Look up whether the current track is in the user's library.
  useEffect(() => {
    const trackId = player?.item?.id;
    if (!open || trackId === undefined) {
      return;
    }

    songsAreSaved([trackId]).then((results) => setSongIsSaved(results?.at(0) ?? false));
  }, [open, player?.item?.id]);

  // Measure whether the title overflows its container; only then scroll it.
  useEffect(() => {
    const element = titleRef.current;
    if (element === null) {
      setTitleShift(0);
      return;
    }

    const overflow = element.scrollWidth - element.clientWidth;
    setTitleShift(overflow > 0 ? -overflow : 0);
  }, [player?.item?.id, open]);

  // Derive a background gradient colour from the current album cover.
  useEffect(() => {
    if (imageUrl === undefined) {
      setGradientColor(null);
      return;
    }

    let cancelled = false;
    extractDominantColor(imageUrl).then((color) => {
      if (!cancelled) {
        setGradientColor(color);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [imageUrl]);

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
    if (playerResult?.device !== undefined) {
      noDeviceCountRef.current = 0;
      setNoActiveDevice(false);
      setPlayer(playerResult);
      return;
    }

    // Spotify's player endpoint returns an empty body intermittently while
    // playback continues. Confirm against the (more reliable) devices list
    // before showing the error, keeping the last known player meanwhile.
    const devices = await getSpotifyDevices();
    const activeDeviceExists = devices?.devices?.some((device) => device.is_active) ?? false;
    if (activeDeviceExists) {
      noDeviceCountRef.current = 0;
      setNoActiveDevice(false);
      return;
    }

    // Only surface the error after a few confirmed misses in a row.
    noDeviceCountRef.current += 1;
    if (noDeviceCountRef.current >= 3) {
      setNoActiveDevice(true);
    }
  };

  const onPlay = async () => {
    await startPlayer();
  };

  const onPause = async () => {
    await pausePlayer();
  };

  const onSeekCommitted = async (positionMs: number) => {
    // Suppress poll syncs for a little over one poll cycle so an in-flight
    // (pre-seek) response cannot snap the slider back.
    seekSettleUntilRef.current = Date.now() + (dataSavingIsEnabled() ? 5000 : 2000) + 1000;
    setProgressMs(positionMs);
    setIsSeeking(false);
    await seekToPosition(positionMs);
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

  const onToggleSaved = async () => {
    const trackId = player?.item?.id;
    if (trackId === undefined) {
      return;
    }

    if (songIsSaved) {
      await removeSavedSong(trackId);
      setSongIsSaved(false);
    } else {
      await saveSong(trackId);
      setSongIsSaved(true);
    }
  };

  const onToggleLasershow = (enabled: boolean) => {
    setLasershowEnabled(enabled);
    localStorage.setItem(LASERSHOW_GENERATION_KEY, String(enabled));
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

    return (
      <div
        style={{
          padding: "20px",
          width: "350px",
          background:
            gradientColor !== null
              ? `linear-gradient(to bottom, ${gradientColor} 0%, transparent 65%)`
              : undefined,
          transition: "background 1s ease",
        }}
      >
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
            <Grid container wrap="nowrap" spacing={1} sx={{ alignItems: "center" }}>
              <Grid size="grow" sx={{ minWidth: 0 }}>
                <Typography
                  noWrap
                  component="div"
                  sx={{ overflow: "hidden", whiteSpace: "nowrap" }}
                >
                  <Box
                    ref={titleRef}
                    component="span"
                    sx={{
                      display: "inline-block",
                      maxWidth: "100%",
                      "--marquee-shift": `${titleShift}px`,
                      animation:
                        titleShift < 0 ? `${marquee} 8s ease-in-out infinite alternate` : "none",
                    }}
                  >
                    <Link
                      href={player?.item?.external_urls?.spotify}
                      target="_blank"
                      rel="noreferrer"
                      underline="hover"
                      color="inherit"
                      sx={{ fontWeight: "bold" }}
                    >
                      {player?.item?.name ?? "loading"}
                    </Link>
                  </Box>
                </Typography>
                <Typography variant="body2" color="text.secondary" noWrap>
                  <Link
                    href={player?.item?.artists?.at(0)?.external_urls?.spotify}
                    target="_blank"
                    rel="noreferrer"
                    underline="hover"
                    color="inherit"
                  >
                    {player?.item?.artists?.at(0)?.name ?? "loading"}
                  </Link>
                </Typography>
              </Grid>
              <Grid>
                <Tooltip title={songIsSaved ? "Remove from library" : "Save to library"}>
                  <span>
                    <IconButton
                      disabled={isLoading}
                      size="small"
                      color={songIsSaved ? "error" : "default"}
                      onClick={onToggleSaved}
                    >
                      {songIsSaved ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                    </IconButton>
                  </span>
                </Tooltip>
              </Grid>
            </Grid>
            <Grid container sx={{ justifyContent: "center" }}>
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
                <Grid container sx={{ justifyContent: "space-between" }}>
                  <Typography variant="caption">{formatMsToTime(progressMs)}</Typography>
                  <Typography variant="caption">{formatMsToTime(durationMs)}</Typography>
                </Grid>
                <Grid container spacing={1} sx={{ alignItems: "center" }}>
                  <Grid>
                    <VolumeDownIcon fontSize="small" />
                  </Grid>
                  <Grid size="grow">
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
                  <Grid>
                    <VolumeUpIcon fontSize="small" />
                  </Grid>
                </Grid>
              </>
            )}
            <br />
            <Divider />
            <FormControlLabel
              disabled={isLoading}
              control={
                <Switch
                  key="lgc-switch"
                  checked={lasershowEnabled}
                  onChange={(event) => onToggleLasershow(event.target.checked)}
                />
              }
              label="Enable lasershow generation"
            />
            <OnTrue onTrue={lasershowEnabled}>
              <Grid container spacing={1} sx={{ mb: 1, alignItems: "center" }}>
                <Grid>
                  <EqualizerBars active={player?.is_playing ?? false} color={palette.primary.main} />
                </Grid>
                <Grid>
                  <Chip
                    size="small"
                    color="primary"
                    variant="outlined"
                    label={player?.is_playing ? "Generating lasershow…" : "Lasershow ready"}
                  />
                </Grid>
              </Grid>
            </OnTrue>
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
