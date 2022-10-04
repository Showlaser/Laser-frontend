import { IconButton, LinearProgress } from "@mui/material";
import React, { useEffect, useState } from "react";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import { normalise } from "services/shared/math";

export default function SpotifyController() {
  const [progress, setProgress] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prevProgress) => prevProgress + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <small>Spotify controller</small>
      <IconButton>
        <SkipPreviousIcon />
      </IconButton>
      <IconButton onClick={() => setIsPlaying(!isPlaying)}>{isPlaying ? <PlayArrowIcon /> : <PauseIcon />}</IconButton>
      <IconButton>
        <SkipNextIcon />
      </IconButton>
      <LinearProgress variant="determinate" value={normalise(progress, 0, 120)} />
    </>
  );
}
