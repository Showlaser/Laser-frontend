import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  FormControlLabel,
  IconButton,
  LinearProgress,
  Switch,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import { mapNumber } from "services/shared/math";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  getPlayerState,
  getTrackAudioFeatures,
  pausePlayer,
  previousSong,
  skipSong,
  startPlayer,
} from "services/logic/spotify";

export default function SpotifyController() {
  const [, updateState] = React.useState({});
  const forceUpdate = React.useCallback(() => updateState({}), []);

  const [accordionIsOpen, setAccordionIsOpen] = useState<boolean>(false);

  const playerRef = useRef<any>();
  const songDataRef = useRef<any>();

  useEffect(() => {
    getData();
    const interval = setInterval(getData, 4000);
    return () => clearInterval(interval);
  }, []);

  const getData = async () => {
    await getPlayerStatus();
    await getTrackData();
    forceUpdate();
  };

  const getPlayerStatus = async () => {
    const result = await getPlayerState();
    playerRef.current = result;
  };

  const getTrackData = async () => {
    const result = await getTrackAudioFeatures(playerRef.current?.item?.id ?? "");
    songDataRef.current = result;
  };

  const onPlay = async () => {
    await startPlayer();
    playerRef.current.is_playing = true;
    forceUpdate();
  };

  const onPause = async () => {
    await pausePlayer();
    playerRef.current.is_playing = false;
    forceUpdate();
  };

  return (
    <Accordion expanded={accordionIsOpen}>
      <AccordionSummary
        style={{ cursor: "default" }}
        expandIcon={
          <IconButton onClick={() => setAccordionIsOpen(!accordionIsOpen)}>
            <ExpandMoreIcon />
          </IconButton>
        }
      >
        <span>
          <small>Spotify / lasershow generator controller</small>
          <IconButton onClick={previousSong}>
            <SkipPreviousIcon />
          </IconButton>
          <IconButton onClick={() => (playerRef?.current?.is_playing ? onPause() : onPlay())}>
            {playerRef?.current?.is_playing ? <PauseIcon /> : <PlayArrowIcon />}
          </IconButton>
          <IconButton onClick={skipSong}>
            <SkipNextIcon />
          </IconButton>
        </span>
      </AccordionSummary>
      <AccordionDetails>
        <FormControlLabel control={<Switch key="lgc-switch" />} label="Enable lasershow generation" />
        <br />
        <small>{`Bpm: ${parseInt(songDataRef?.current?.tempo)}`}</small>
        <br />
        <small>{`Song: ${playerRef.current?.item?.name}`}</small>
        <LinearProgress
          variant="determinate"
          value={mapNumber(playerRef?.current?.progress_ms, 0, playerRef?.current?.item?.duration_ms, 0, 100)}
        />
      </AccordionDetails>
    </Accordion>
  );
}
