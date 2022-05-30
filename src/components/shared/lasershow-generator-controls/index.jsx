import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  ButtonGroup,
  IconButton,
  LinearProgress,
  Switch,
  FormGroup,
  FormControlLabel,
  Alert,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import "./index.css";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import PauseIcon from "@mui/icons-material/Pause";
import { mapNumber } from "services/shared/math";
import {
  startLasershowGeneration,
  stopLasershowGeneration,
  getLasershowGeneratorStatus,
  updateLasershowGeneratorSettings,
} from "services/logic/lasershow-generation-logic";
import {
  getPlayerState,
  pausePlayer,
  startPlayer,
  skipSong,
  previousSong,
  getSpotifyDevices,
  getDataForCurrentArtist,
  getTrackAudioFeatures,
} from "services/logic/spotify";

export default function LasershowGeneratorControls() {
  const userIsLoggedIntoSpotify =
    localStorage.getItem("SpotifyAccessToken") !== null &&
    localStorage.getItem("SpotifyAccessToken") !== "undefined";
  const [open, setOpen] = useState(
    localStorage.getItem("show-spotify-controls") !== null
  );
  const [playing, setPlaying] = useState(false);
  const [activeDevice, setActiveDevice] = useState();
  const [lasershowGeneratorStatus, setLasershowGeneratorStatus] = useState({
    isActive: false,
  });
  const [intervalsSet, setIntervalsSet] = useState(false);
  const [generatorSubmitInProgress, setGeneratorSubmitInProgress] =
    useState(false);
  const selectedAudioDevice = localStorage.getItem("selected-audio-device");

  const playerStateRef = useRef();
  const currentArtistRef = useRef();
  const currentTrackDataRef = useRef();

  useEffect(() => {
    if (intervalsSet || !userIsLoggedIntoSpotify) {
      return;
    }

    setIntervalsSet(true);
    updateData();
    updateActiveDevice();
    setInterval(() => updateData(), 1800);
    setInterval(() => updateActiveDevice(), 10000);
  }, [activeDevice]);

  const updateData = () => {
    if (!userIsLoggedIntoSpotify) {
      return;
    }

    updateSpotifyPlayerState();
    if (!playerStateRef.current) {
      return;
    }

    updateArtistData();
    updateTrackData();
    updateGeneratorStatus();
    updateGeneratorSettings();
  };

  const updateGeneratorStatus = () => {
    getLasershowGeneratorStatus().then((status) =>
      setLasershowGeneratorStatus(status)
    );
  };

  const updateGeneratorSettings = () => {
    if (!currentArtistRef.current) {
      return;
    }

    updateLasershowGeneratorSettings({
      genres: currentArtistRef.current.genres,
      bpm: parseInt(currentTrackDataRef.current.tempo),
      saveLasershow: localStorage.getItem("save-generated-lasershows") !== null,
      songName: playerStateRef.current?.item?.name,
      isPlaying: playerStateRef.current?.is_playing,
    });
  };

  const updateActiveDevice = () => {
    getSpotifyDevices().then((data) => {
      const device = data.devices.find((dev) => dev.is_active);
      if (!device) {
        return;
      }

      setActiveDevice(device);
    });
  };

  const updateTrackData = () => {
    if (!playerStateRef.current) {
      return;
    }

    getTrackAudioFeatures(playerStateRef.current.item.id).then((trackData) => {
      currentTrackDataRef.current = trackData;
    });
  };

  const updateArtistData = () => {
    if (
      !playerStateRef.current ||
      playerStateRef.current.item.id === currentTrackDataRef.current?.id
    ) {
      return;
    }

    getDataForCurrentArtist(playerStateRef.current.item.artists.at(0).id).then(
      (data) => {
        currentArtistRef.current = data;
      }
    );
  };

  const updateSpotifyPlayerState = () => {
    getPlayerState().then((data) => {
      if (data) {
        setPlaying(data.is_playing);
        console.log(data);
        playerStateRef.current = data;
      }
    });
  };

  const onLasershowGeneratorToggle = (startGenerator) => {
    setGeneratorSubmitInProgress(true);
    setLasershowGeneratorStatus(startGenerator);
    startGenerator
      ? startLasershowGeneration(
          {
            genres: currentArtistRef.current.genres,
            bpm: parseInt(currentTrackDataRef.current.tempo),
          },
          selectedAudioDevice
        ).then(() => setGeneratorSubmitInProgress(false))
      : stopLasershowGeneration().then(() =>
          setGeneratorSubmitInProgress(false)
        );
  };

  const toggleControls = () => {
    setOpen(!open);
    open
      ? localStorage.removeItem("show-spotify-controls")
      : localStorage.setItem("show-spotify-controls", "");
  };

  const getPlayOrPauseButton = () =>
    playing ? (
      <IconButton onClick={() => pausePlayer()}>
        <PauseIcon />
      </IconButton>
    ) : (
      <IconButton onClick={() => startPlayer()}>
        <PlayArrowIcon />
      </IconButton>
    );

  const renderComponentByLoggedInAndDeviceState = () => {
    if (!userIsLoggedIntoSpotify) {
      return (
        <Alert severity="error">
          You are not logged in to Spotify. Login in the settings page
        </Alert>
      );
    }

    if (selectedAudioDevice === null) {
      return (
        <Alert severity="error">
          No audio device selected! Set an device in the settings page.
        </Alert>
      );
    }

    if (!activeDevice) {
      return (
        <Alert severity="error">
          No active device found! Play a song through Spotify and refresh the
          page or wait a few seconds.
        </Alert>
      );
    }

    return (
      <span>
        <FormGroup>
          <FormControlLabel
            control={
              <Switch
                disabled={generatorSubmitInProgress}
                key="lgc-switch"
                checked={lasershowGeneratorStatus.isActive}
                onChange={(e) => onLasershowGeneratorToggle(e.target.checked)}
              />
            }
            label="Enable lasershow generation"
          />
          {generatorSubmitInProgress ? (
            <LinearProgress style={{ width: "250px" }} />
          ) : null}
        </FormGroup>
        <br />
        <ButtonGroup>
          <IconButton onClick={() => previousSong()}>
            <SkipPreviousIcon />
          </IconButton>
          {getPlayOrPauseButton()}
          <IconButton onClick={() => skipSong()}>
            <SkipNextIcon />
          </IconButton>
        </ButtonGroup>
        <LinearProgress
          variant="determinate"
          value={mapNumber(
            playerStateRef.current?.progress_ms,
            0,
            playerStateRef.current?.item?.duration_ms,
            0,
            100
          )}
        />
        <small>{`Active device: ${activeDevice.name}`}</small>
        <br />
        {lasershowGeneratorStatus.isActive ? (
          <span>
            <small>{`Detected genre: ${
              lasershowGeneratorStatus.activeGenre ?? "not supported"
            }`}</small>
          </span>
        ) : null}
        <br />
        <small>{`Bpm: ${parseInt(currentTrackDataRef?.current?.tempo)}`}</small>
      </span>
    );
  };

  return (
    <div id="lasershow-generator-controls">
      <Accordion
        expanded={open}
        style={{ boxShadow: "0 2px 10px rgba(0, 0, 0, 0.8)" }}
      >
        <AccordionSummary onClick={toggleControls}>
          <small>
            {open ? "Close Spotify controls" : "Open Spotify controls"}
          </small>
        </AccordionSummary>
        <AccordionDetails>
          {renderComponentByLoggedInAndDeviceState()}
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
