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
              <InputLabel>Lasershow to set song to</InputLabel>
              <Select>
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
          <Button variant="text" onClick={onSave}>
            Save
          </Button>
        </ButtonGroup>
      </div>
      <Divider />
      <small>Only one song can be connected to a lasershow!</small>
      {selectedLasershowUuid !== undefined ? (
        <List sx={{ width: "100%" }} disablePadding>
          {searchResults.map((searchResult, index) => (
            <ListItem key={searchResult?.songName + index} disablePadding>
              <ListItemButton
                role={undefined}
                onClick={handleToggle(searchResult?.id)}
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
                  primary={`${searchResult?.songName} | ${searchResult.artist}`}
                />
              </ListItemButton>
            </ListItem>
          ))}
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
