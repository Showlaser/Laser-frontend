import * as React from "react";
import { Box, Button, ButtonGroup, TextField, Typography } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StopIcon from "@mui/icons-material/Stop";
import SelectList from "components/select-list";

type Laser = {
  name: string;
  uuid: string;
  online: boolean;
};

export default function ToLaserProjector() {
  const [isPlaying, setIsPlaying] = React.useState<boolean>(
    localStorage.getItem("lasers-are-playing") !== null
  );
  const [selectedLasersUuid, setSelectedLasersUuid] = React.useState<string[]>(
    []
  );
  const [searchValue, setSearchValue] = React.useState<string>();
  const [availableLasers, setAvailableLasers] = React.useState<Laser[]>([
    {
      name: "test laser",
      uuid: "45ad82c4-8432-468b-89f7-370459b4d000",
      online: true,
    },
    {
      name: "test laser 2",
      uuid: "3d21fa4d-3edb-4a3b-9ae9-d21703406c00",
      online: false,
    },
  ]);

  return (
    <Box>
      <Typography id="modal-modal-title" variant="h6" component="h2">
        Project to laser
      </Typography>
      <ButtonGroup>
        <TextField
          label="Search laser"
          onChange={(e) => setSearchValue(e.target.value)}
        />
        {isPlaying ? (
          <Button
            onClick={() => {
              setIsPlaying(false);
              localStorage.removeItem("lasers-are-playing");
            }}
            variant="outlined"
            style={{ marginLeft: "10px" }}
            startIcon={<StopIcon />}
          >
            Stop
          </Button>
        ) : (
          <Button
            onClick={() => {
              setIsPlaying(true);
              localStorage.setItem("lasers-are-playing", "");
            }}
            variant="outlined"
            style={{ marginLeft: "10px" }}
            startIcon={<PlayArrowIcon />}
            disabled={selectedLasersUuid.length === 0}
          >
            Play
          </Button>
        )}
      </ButtonGroup>
      <SelectList
        onSelect={setSelectedLasersUuid}
        items={availableLasers.filter((laser) =>
          searchValue ? laser.name.includes(searchValue) : true
        )}
        disabled={isPlaying}
      />
    </Box>
  );
}
