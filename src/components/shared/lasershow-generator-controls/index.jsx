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
  Select,
  MenuItem,
} from "@mui/material";
import { useEffect, useState } from "react";
import "./index.css";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import PauseIcon from "@mui/icons-material/Pause";
import { mapNumber } from "services/shared/math";
import {
  startLasershowGeneration,
  stopLasershowGeneration,
} from "services/logic/lasershow-generation-logic";
import {
  getPlayerState,
  pausePlayer,
  startPlayer,
  skipSong,
  previousSong,
} from "services/logic/spotify";

export default function LasershowGeneratorControls() {
  const [open, setOpen] = useState(
    localStorage.getItem("show-spotify-controls") !== null
  );
  const [playing, setPlaying] = useState(false);
  const [lasershowGeneratorActive, setLasershowGeneratorActive] =
    useState(false);
  const [intervalSet, setIntervalSet] = useState(false);
  const [playerState, setPlayerState] = useState();

  useEffect(() => {
    if (intervalSet) {
      return;
    }

    setIntervalSet(true);
    setInterval(() => getSpotifyPlayerState(), 2000);
  }, []);

  const getSpotifyPlayerState = () => {
    getPlayerState().then((data) => {
      setPlaying(data.is_playing);
      setPlayerState(data);
    });
  };

  const onLasershowGeneratorToggle = (state) => {
    setLasershowGeneratorActive(state);
    state ? startLasershowGeneration() : stopLasershowGeneration();
  };

  const toggleControls = () => {
    setOpen(!open);
    open
      ? localStorage.removeItem("show-spotify-controls")
      : localStorage.setItem("show-spotify-controls", "");
  };

  return (
    <div id="lasershow-generator-controls">
      <Accordion expanded={open}>
        <AccordionSummary onClick={toggleControls}>
          <small>
            {open ? "Close Spotify controls" : "Open Spotify controls"}
          </small>
        </AccordionSummary>
        <AccordionDetails>
          {localStorage.getItem("SpotifyRefreshToken") !== null ? (
            <span>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch
                      onChange={(e) =>
                        onLasershowGeneratorToggle(e.target.checked)
                      }
                    />
                  }
                  label="Enable lasershow generation"
                />
              </FormGroup>
              <br />
              <ButtonGroup>
                <IconButton>
                  <SkipPreviousIcon onClick={() => previousSong()} />
                </IconButton>
                <IconButton>
                  {playing ? (
                    <PauseIcon onClick={() => pausePlayer()} />
                  ) : (
                    <PlayArrowIcon onClick={() => startPlayer()} />
                  )}
                </IconButton>
                <IconButton>
                  <SkipNextIcon onClick={() => skipSong()} />
                </IconButton>
              </ButtonGroup>
              <LinearProgress
                variant="determinate"
                value={mapNumber(
                  playerState?.progress_ms,
                  0,
                  playerState?.item?.duration_ms,
                  0,
                  100
                )}
              />
            </span>
          ) : (
            <h1>
              You are not logged in to Spotify. Login in the settings page
            </h1>
          )}
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
