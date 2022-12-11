import { Button, Grid, List, ListItemText } from "@mui/material";
import LinearWithValueLabel from "components/shared/progress-with-label";
import { useEffect, useState, useRef } from "react";
import { normalise } from "services/shared/math";
import { getDifferenceBetweenTwoDatesInMinutesAndSecondsString } from "services/shared/general";
import Cookies from "universal-cookie";
import React from "react";
import { VoteData } from "models/components/shared/Spotify";

type Props = {
  voteState: VoteData | undefined;
  voteCookie: any;
  onVoteEnded: () => void;
};

export default function VoteOverView({ voteState, voteCookie, onVoteEnded }: Props) {
  const [voteEnded, setVoteEnded] = useState(false);
  const voteEndedRef = useRef(false);

  const totalVotes = voteState?.votablePlaylistCollection
    ?.map((p) => p?.votes?.length)
    .reduce((partialSum, a) => partialSum + a, 0);

  useEffect(() => {
    const validUntilDate = new Date(voteCookie?.validUntil);
    setInterval(() => {
      const value = getDifferenceBetweenTwoDatesInMinutesAndSecondsString(validUntilDate, new Date());

      if (!voteEndedRef.current) {
        const countDown = document.getElementById("countdown");
        if (countDown === null) {
          return;
        }

        countDown.innerHTML = value;
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
              voteEndedRef.current = true;
              const cookie = new Cookies();
              cookie.remove("vote-started", { path: "/vote" });
              await onVoteEnded();
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
        {voteState?.votablePlaylistCollection?.map((playlist) => {
          const value = normalise(playlist?.votes?.length, 0, Number(totalVotes));
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
