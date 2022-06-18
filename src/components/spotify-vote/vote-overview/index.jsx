import { Button, Grid, List, ListItemText } from "@mui/material";
import LinearWithValueLabel from "components/shared/progress-with-label";
import { useEffect, useState } from "react";
import { normalise } from "services/shared/math";
import { getDifferenceBetweenTwoDatesInMinutesAndSecondsString } from "services/shared/general";
import paths from "services/shared/router-paths";
import Cookies from "universal-cookie";

export default function VoteOverView({ voteState, voteCookie, onVoteEnded }) {
  const [voteEnded, setVoteEnded] = useState(false);

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

      if (!voteEnded) {
        document.getElementById("countdown").innerHTML = value;
      }
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
      {!voteEnded ? (
        <div>
          <small>Voting closes in</small>
          <h2 id="countdown" />
          <Button
            size="small"
            onClick={async () => {
              setVoteEnded(true);
              const cookie = new Cookies();
              cookie.remove("vote-started", { path: "/vote" });
              await onVoteEnded();

              const playPlaylistAfterSongEnded = document
                .getElementById("play-after-song-ended-checkbox")
                .getElementsByTagName("input")
                .item(0).checked;

              if (!playPlaylistAfterSongEnded) {
                window.location = paths.SpotifyVote;
              }
            }}
          >
            End vote session
          </Button>
        </div>
      ) : (
        <div>
          <h3>Voting ended by user</h3>
        </div>
      )}

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
