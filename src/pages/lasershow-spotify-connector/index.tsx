import {
  Button,
  ButtonGroup,
  Checkbox,
  FormControl,
  InputBase,
  InputLabel,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Divider,
  Tooltip,
} from "@mui/material";
import SideNav from "components/shared/sidenav";
import React, { useEffect, useState } from "react";
import { getAnimations } from "services/logic/animation-logic";
import { addLasershowToSpotifyConnector, getAllConnectors } from "services/logic/lasershow-spotify-connector";
import { getCurrentTracksData, searchSpotify } from "services/logic/spotify";
import { createGuid } from "services/shared/math";
import HelpIcon from "@mui/icons-material/Help";

export default function LasershowSpotifyConnector() {
  const [searchResults, setSearchResults] = useState<any>([]);
  const [lasershows, setLasershows] = useState<any>([]);
  const [selectedLasershowUuid, setSelectedLasershowUuid] = useState<string | undefined>(undefined);
  const [existingConnectors, setExistingConnectors] = useState<any>([]);
  const [selectedSpotifySongIds, setSelectedSpotifySongIds] = useState<string[]>([]);

  useEffect(() => {
    if (lasershows.length === 0) {
      getAnimations().then((animations) => setLasershows(animations));
    }
    if (existingConnectors.length === 0) {
      getAllConnectors().then((data) => setExistingConnectors(data));
    }
  }, [setSearchResults]);

  const onSearchInput = (searchValue: string) => {
    if (searchValue === "") {
      setSearchResults([]);
    }
    searchSpotify(searchValue, 20).then((searchResult) =>
      setSearchResults(
        searchResult?.tracks?.items.map((track: any) => ({
          artist: track.artists[0]?.name,
          songName: track.name,
          id: track.id,
        }))
      )
    );
  };

  const onSave = () => {
    const connectorUuid = createGuid();
    const connector = {
      uuid: connectorUuid,
      lasershowUuid: selectedLasershowUuid,
      spotifySongs: selectedSpotifySongIds.map((spdi) => ({
        uuid: createGuid(),
        lasershowSpotifyConnectorUuid: connectorUuid,
        spotifySongId: spdi,
      })),
    };

    addLasershowToSpotifyConnector(connector);
    let newExistingConnectors = [...existingConnectors];
    newExistingConnectors.push(connector);
    setExistingConnectors(newExistingConnectors);
  };

  const handleToggle = (value: string) => () => {
    const currentIndex = selectedSpotifySongIds.indexOf(value);
    const newChecked = [...selectedSpotifySongIds];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setSelectedSpotifySongIds(newChecked);
  };

  const onLasershowSelect = (lasershowUuid: string) => {
    setSelectedLasershowUuid(lasershowUuid);
    const lasershowConnector = existingConnectors.find((c: any) => c.lasershowUuid === lasershowUuid);
    if (lasershowConnector === undefined) {
      setSearchResults([]);
      setSelectedSpotifySongIds([]);
      return;
    }

    getCurrentTracksData(lasershowConnector.spotifySongs.map((ss: any) => ss.spotifySongId)).then((data) => {
      const newValues = data.tracks.map((track: any) => ({
        artist: track.artists[0]?.name,
        songName: track.name,
        id: track.id,
      }));

      const combinedSearchResults = newValues.concat(searchResults);
      setSearchResults(combinedSearchResults);
      setSelectedSpotifySongIds(newValues.map((track: any) => track.id));
    });
  };

  return (
    <SideNav pageName="Lasershow Spotify connector">
      {" "}
      <>
        <div style={{ maxWidth: "30%", marginBottom: "10px", marginTop: "25px" }}>
          <ButtonGroup>
            {lasershows.length > 0 ? (
              <FormControl style={{ minWidth: "250px" }}>
                <InputLabel>Lasershow to connect songs to</InputLabel>
                <Select defaultValue="">
                  {lasershows.map((lasershow: any) => (
                    <MenuItem
                      onClick={() => onLasershowSelect(lasershow.uuid)}
                      value={lasershow.name}
                      key={createGuid()}
                    >
                      {lasershow.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : (
              <h1>No lasershows available create one first</h1>
            )}
            <Button
              variant="text"
              onClick={onSave}
              disabled={lasershows.length === 0 || selectedSpotifySongIds.length === 0}
            >
              Save
            </Button>
          </ButtonGroup>
        </div>
        <Divider />
        <small>
          A song can only be connected to one lasershow{" "}
          <Tooltip title="A song cannot be connected to multiple lasershows since it would run two lasershows at the same time.">
            <HelpIcon fontSize="inherit" />
          </Tooltip>
        </small>
        <Paper
          style={{ backgroundColor: "#363535" }}
          sx={{
            m: "8px 0 0 0",
            p: "4px 6px",
            display: "flex",
            alignItems: "center",
            width: 400,
          }}
        >
          <Tooltip title={selectedLasershowUuid !== undefined ? "" : "Select a lasershow first!"}>
            <InputBase
              disabled={selectedLasershowUuid === undefined}
              sx={{ ml: 1, flex: 1 }}
              placeholder="Search Spotify"
              onChange={(e) => onSearchInput(e.target.value)}
            />
          </Tooltip>
        </Paper>
        <List sx={{ width: "100%" }} disablePadding>
          {searchResults.map((searchResult: any, index: number) => {
            const songIsAlreadyConnected = existingConnectors.some(
              (ex: any) =>
                ex.spotifySongs.some((ss: any) => ss.spotifySongId === searchResult?.id) &&
                ex.lasershowUuid !== selectedLasershowUuid
            );

            return (
              <ListItem key={searchResult?.songName + index} disablePadding>
                <ListItemButton
                  role={undefined}
                  onClick={handleToggle(searchResult?.id)}
                  disabled={songIsAlreadyConnected}
                  dense
                >
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={selectedSpotifySongIds?.some((spsi) => spsi === searchResult.id)}
                      tabIndex={-1}
                      disableRipple
                      inputProps={{
                        "aria-labelledby": `checkbox-list-label-${index}`,
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    id={`checkbox-list-label-${index}`}
                    primary={`${searchResult?.songName} | ${searchResult.artist} ${
                      songIsAlreadyConnected ? " (this song is already connected)" : ""
                    }`}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </>
    </SideNav>
  );
}
