import { Grid, List, ListItemText } from "@mui/material";
import LinearWithValueLabel from "components/shared/progress-with-label";
import { useEffect } from "react";
import { normalise } from "services/shared/math";
import { getDifferenceBetweenTwoDatesInMinutesAndSecondsString } from "services/shared/general";

export default function VoteOverView({ voteState, voteCookie }) {
  const totalVotes = voteState?.voteablePlaylistCollection
    ?.map((p) => p?.votes?.length)
    .reduce((partialSum, a) => partialSum + a, 0);

  useEffect(() => {
    const validUntilDate = new Date(voteCookie?.validUntil);
    setInterval(() => {
      const value = getDifferenceBetweenTwoDatesInMinutesAndSecondsString(
        validUntilDate,
        new Date()
      );
      document.getElementById("countdown").innerHTML = value;
    }, 1000);
  }, []);

  return (
    <Grid
      className="fade-up"
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      style={{ marginTop: "25px" }}
    >
      <small>Voting closes in</small>
      <h2 id="countdown" />
      <List style={{ width: "90%", maxWidth: "70vh" }}>
        {voteState?.voteablePlaylistCollection?.map((playlist) => {
          const value = normalise(playlist?.votes?.length, 0, totalVotes);
          return (
            <span key={playlist?.uuid}>
              <ListItemText primary={playlist?.playlistName} />
              <LinearWithValueLabel value={isNaN(value) ? 0 : value} />
            </span>
          );
        })}
      </List>
    </Grid>
  );
}
