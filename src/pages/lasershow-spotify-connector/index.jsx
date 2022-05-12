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
} from "@mui/material";
import SideNav from "components/shared/sidenav";
import { useEffect, useState } from "react";
import { getAnimations } from "services/logic/animation-logic";
import { searchSpotify } from "services/logic/spotify";

export default function LasershowSpotifyConnector() {
  const [searchResults, setSearchResults] = useState([]);
  const [lasershows, setLasershows] = useState([]);
  const [checked, setChecked] = useState([]);

  useEffect(() => {
    if (lasershows.length === 0) {
      getAnimations().then((animations) =>
        setLasershows(animations.map((a) => a.name))
      );
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

  const handleToggle = (value) => () => {
    const currentIndex = checked.findIndex((e) => e === value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
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
      <div style={{ maxWidth: "30%", marginBottom: "10px" }}>
        <ButtonGroup>
          <FormControl style={{ minWidth: "250px" }}>
            <InputLabel>Lasershow to set songs to</InputLabel>
            <Select>
              {lasershows.map((lasershow) => (
                <MenuItem value={lasershow}>{lasershow}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button>Save</Button>
        </ButtonGroup>
      </div>
      <List sx={{ width: "100%", bgcolor: "background.paper" }} disablePadding>
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
                  checked={
                    checked.findIndex((e) => e === searchResult.id) !== -1
                  }
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
    </div>
  );

  return (
    <SideNav
      content={content}
      settings={{ pageName: "Lasershow spotify connector" }}
    />
  );
}
