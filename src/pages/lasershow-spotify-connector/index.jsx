import {
  Button,
  ButtonGroup,
  Checkbox,
  FormControl,
  Grid,
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
import { useEffect, useState } from "react";
import { getAnimations } from "services/logic/animation-logic";
import {
  addLasershowToSpotifyConnector,
  getAllConnectors,
} from "services/logic/lasershow-spotify-connector";
import { getCurrentTracksData, searchSpotify } from "services/logic/spotify";
import { createGuid } from "services/shared/math";
import HelpIcon from "@mui/icons-material/Help";

export default function LasershowSpotifyConnector() {
  const [searchResults, setSearchResults] = useState([]);
  const [lasershows, setLasershows] = useState([]);
  const [selectedLasershowUuid, setSelectedLasershowUuid] = useState();
  const [existingConnectors, setExistingConnectors] = useState([]);
  const [selectedSpotifySongIds, setSelectedSpotifySongIds] = useState([]);

  useEffect(() => {
    if (lasershows.length === 0) {
      getAnimations().then((animations) => setLasershows(animations));
    }
    if (existingConnectors.length === 0) {
      getAllConnectors().then((data) => setExistingConnectors(data));
    }
  }, [setSearchResults]);

  const onSearchInput = (searchValue) => {
    if (searchValue === "") {
      setSearchResults([]);
    }
    searchSpotify(searchValue, 20).then((searchResult) =>
      setSearchResults(
        searchResult.tracks.items.map((track) => ({
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

  const handleToggle = (value) => () => {
    const currentIndex = selectedSpotifySongIds.indexOf(value);
    const newChecked = [...selectedSpotifySongIds];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setSelectedSpotifySongIds(newChecked);
  };

  const onLasershowSelect = (lasershowUuid) => {
    setSelectedLasershowUuid(lasershowUuid);
    const lasershowConnector = existingConnectors.find(
      (c) => c.lasershowUuid === lasershowUuid
    );
    if (lasershowConnector === undefined) {
      setSearchResults([]);
      setSelectedSpotifySongIds([]);
      return;
    }

    getCurrentTracksData(
      lasershowConnector.spotifySongs.map((ss) => ss.spotifySongId)
    ).then((data) => {
      const newValues = data.tracks.map((track) => ({
        artist: track.artists[0]?.name,
        songName: track.name,
        id: track.id,
      }));

      const combinedSearchResults = newValues.concat(searchResults);
      setSearchResults(combinedSearchResults);
      setSelectedSpotifySongIds(newValues.map((track) => track.id));
    });
  };

  const content = (
    <div>
      <Grid
        style={{ marginTop: "25px" }}
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
      >
        <Paper
          id="spotify-search-paper"
          sx={{
            p: "4px 6px",
            display: "flex",
            alignItems: "center",
            width: 400,
          }}
        >
          <InputBase
            disabled={selectedLasershowUuid === undefined}
            sx={{ ml: 1, flex: 1 }}
            placeholder="Search Spotify"
            onChange={(e) => onSearchInput(e.target.value)}
          />
        </Paper>
      </Grid>
      <div style={{ maxWidth: "30%", marginBottom: "10px", marginTop: "25px" }}>
        <ButtonGroup>
          {lasershows.length > 0 ? (
            <FormControl style={{ minWidth: "250px" }}>
              <InputLabel>Lasershow to connect songs to</InputLabel>
              <Select defaultValue="">
                {lasershows.map((lasershow) => (
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
            disabled={
              lasershows.length === 0 || selectedSpotifySongIds.length === 0
            }
          >
            Save
          </Button>
        </ButtonGroup>
      </div>
      <Divider />
      <small>
        A song can only be connected to one lasershow
        <Tooltip title="This is not possible since it would run two lasershows at the same time.">
          <HelpIcon fontSize="inherit" />
        </Tooltip>
      </small>
      {selectedLasershowUuid !== undefined ? (
        <List sx={{ width: "100%" }} disablePadding>
          {searchResults.map((searchResult, index) => {
            const songIsAlreadyConnected = existingConnectors.some(
              (ex) =>
                ex.spotifySongs.some(
                  (ss) => ss.spotifySongId === searchResult?.id
                ) && ex.lasershowUuid !== selectedLasershowUuid
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
                      checked={selectedSpotifySongIds?.some(
                        (spsi) => spsi === searchResult.id
                      )}
                      tabIndex={-1}
                      disableRipple
                      inputProps={{
                        "aria-labelledby": `checkbox-list-label-${index}`,
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    id={`checkbox-list-label-${index}`}
                    primary={`${searchResult?.songName} | ${
                      searchResult.artist
                    } ${
                      songIsAlreadyConnected
                        ? " (this song is already connected)"
                        : ""
                    }`}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      ) : (
        <h3>
          No lasershow selected. Select a lasershow first and the type in the
          searchbox
        </h3>
      )}
    </div>
  );

  return (
    <SideNav
      content={content}
      settings={{ pageName: "Lasershow spotify connector" }}
    />
  );
}
