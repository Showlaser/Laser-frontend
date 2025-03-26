import CloseIcon from "@mui/icons-material/Close";
import { Alert, Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import SideNav from "components/shared/sidenav";
import SpotifyPlaylist from "components/spotify-vote/spotify-playlist";
import VoteOverView from "components/spotify-vote/vote-overview";
import VoteSettings from "components/spotify-vote/vote-settings";
import { VoteablePlaylist, VoteData } from "models/components/shared/Spotify";
import React, { useEffect, useState } from "react";
import {
  getPlayerState,
  getPlaylistSongs,
  getUserPlaylists,
  playPlaylist,
} from "services/logic/spotify";
import { getVoteData, startVote } from "services/logic/vote-logic";
import { voteApiWebsocketUrl, voteFrontendUrl } from "services/shared/api/api-endpoints";
import { toCamelCase } from "services/shared/general";
import { createGuid } from "services/shared/math";
import Cookies from "universal-cookie";

export default function SpotifyVote() {
  const cookie = new Cookies();
  const accessToken = localStorage.getItem("SpotifyAccessToken");
  const voteCookie = cookie.get("vote-started");
  const voteInProgress = voteCookie !== undefined;

  const [userPlaylists, setUserPlaylists] = useState<SpotifyApi.PlaylistObjectSimplified[] | null>(
    null
  );
  const [voteValidTimeInMinutes, setVoteValidTimeInMinutes] = useState(5);
  const [voteStarted, setVoteStarted] = useState(voteInProgress);
  const [joinData, setJoinData] = useState(voteCookie?.joinInfo ?? undefined);
  const [voteState, setVoteState] = useState<VoteData | undefined>();
  const [connected, setConnected] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);

  const handleResize = () => {
    const windowWidth = window.innerWidth;
    /* let qrWidth = windowWidth * 0.8;
    if (qrWidth > window.innerHeight) {
      qrWidth = window.innerHeight - 100;
    }

    setQrCodeWidth(qrWidth);*/
  };

  window.addEventListener("resize", handleResize);

  useEffect(() => {
    if (accessToken === null) {
      return;
    }

    if (userPlaylists === null) {
      getUserPlaylists().then((data) => {
        const playlistsWithTracks = data.items.filter(
          (playlist: SpotifyApi.PlaylistObjectSimplified) => playlist.tracks.total > 0
        );
        setUserPlaylists(playlistsWithTracks);
      });
    }

    if (!voteStarted) {
      return;
    }

    if (!connected) {
      connectToWebsocketServer(voteCookie.joinInfo.joinCode, voteCookie.joinInfo.accessCode).then(
        (conn) => setConnected(conn)
      );
    }
  }, [voteStarted, accessToken, window.innerWidth]);

  const connectToWebsocketServer = async (joinCode: string, accessCode: string) => {
    const response = await getVoteData({ joinCode, accessCode });
    if (response?.status !== 200) {
      return false;
    }

    let voteData = await response.json();
    voteData.validUntil = new Date(voteData.validUntil);

    let newSocket = new WebSocket(voteApiWebsocketUrl);
    newSocket.onopen = () => {
      const identifier = {
        voteDataUuid: voteData.uuid,
        websocketUuid: createGuid(),
        joinCode,
        accessCode,
      };

      newSocket.send(JSON.stringify(identifier));
    };
    newSocket.onmessage = (event) => {
      const object = JSON.parse(event.data, toCamelCase);
      object.validUntil = new Date(voteData.validUntil);
      setVoteState(object);
    };

    const timeout = voteData.validUntil.getTime() - new Date().getTime();
    setTimeout(() => onVoteEnded({ joinCode, accessCode }), timeout);
    setVoteState(voteData);
    return true;
  };

  const onVoteStart = async (
    selectedPlaylistIds: string[]
  ): Promise<VoteablePlaylist | undefined> => {
    const expirationDate = new Date();
    expirationDate.setUTCMinutes(expirationDate.getUTCMinutes() + voteValidTimeInMinutes);

    const voteDataUuid = createGuid();
    const voteData = {
      uuid: voteDataUuid,
      validUntil: expirationDate,
      voteablePlaylistCollection: await Promise.all(
        selectedPlaylistIds.map(async (playlistId) => {
          {
            const playlist = userPlaylists?.find(
              (p: SpotifyApi.PlaylistBaseObject) => p.id === playlistId
            );
            const playlistSongs = await getPlaylistSongs(playlistId);
            const playlistUuid = createGuid();
            return {
              uuid: createGuid(),
              voteDataUuid,
              playlistName: playlist?.name,
              spotifyPlaylistId: playlistId,
              playlistImageUrl: playlist?.images?.at(0)?.url,
              songsInPlaylist: playlistSongs.map((track: SpotifyApi.TrackObjectFull) => {
                return {
                  uuid: createGuid(),
                  playlistUuid: playlistUuid,
                  songName: track.name,
                  artistName: track.artists.at(0)?.name,
                  songImageUrl: track.album.images.at(0)?.url,
                };
              }),
            };
          }
        })
      ),
    };

    const joinInfo = await startVote(voteData);
    if (joinInfo?.joinCode === undefined) {
      return;
    }
    cookie.set(
      "vote-started",
      { joinInfo, validUntil: expirationDate },
      {
        expires: expirationDate,
        path: "/vote",
      }
    );

    setVoteStarted(true);
    setJoinData(joinInfo);
    setTimeout(() => onVoteEnded(joinInfo), voteValidTimeInMinutes * 60000);
    window.addEventListener("beforeunload", function (e) {
      var confirmationMessage = "Aut play will not work!";

      (e || window.event).returnValue = confirmationMessage; //Gecko + IE
      return confirmationMessage; //Gecko + Webkit, Safari, Chrome etc.
    });
  };

  const onVoteEnded = async (joinInfo: { joinCode: string; accessCode: string }) => {
    const { joinCode, accessCode } = joinInfo;
    const response = await getVoteData({ joinCode, accessCode });
    if (response?.status !== 200 || voteState === undefined) {
      return;
    }

    let updatedVoteState: VoteData = { ...voteState };
    updatedVoteState.validUntil = new Date();
    setVoteState(updatedVoteState);

    const checkbox = document.getElementById("play-after-song-ended-checkbox");
    const playPlaylistAfterCurrentPlayingSongEnded = checkbox
      ?.getElementsByTagName("input")
      .item(0)?.checked;

    const voteData = await response.json();
    const mostVotedPlaylist = voteData?.voteablePlaylistCollection
      ?.sort((a: VoteablePlaylist, b: VoteablePlaylist) =>
        a.votes.length > b.votes.length ? -1 : 1
      )
      .at(0);

    const oldPlayerState = await getPlayerState();
    if (playPlaylistAfterCurrentPlayingSongEnded) {
      await playPlaylistAfterSongEnds(mostVotedPlaylist, oldPlayerState);
      return;
    }

    if (oldPlayerState?.device?.id === null) {
      return;
    }

    playPlaylistAfterCurrentPlayingSongEnded
      ? await playPlaylistAfterSongEnds(mostVotedPlaylist, oldPlayerState)
      : playPlaylist(mostVotedPlaylist.spotifyPlaylistId, oldPlayerState.device.id);
  };

  const playPlaylistAfterSongEnds = async (
    mostVotedPlaylist: VoteablePlaylist,
    oldPlayerState: SpotifyApi.CurrentlyPlayingObject
  ) => {
    const interval = setInterval(async () => {
      const currentPlayerState = await getPlayerState();
      if (currentPlayerState?.item === null || currentPlayerState?.device?.id === null) {
        return;
      }

      if (currentPlayerState.item.id !== oldPlayerState?.item?.id) {
        playPlaylist(mostVotedPlaylist.spotifyPlaylistId, currentPlayerState.device.id);
        clearInterval(interval);
      }
    }, 5000);
  };

  const voteComponents = voteStarted ? (
    <>
      <Modal open={showQRCode} onClose={() => setShowQRCode(false)} style={{ marginLeft: "15px" }}>
        <div
          style={{
            textAlign: "center",
            background: "white",
            padding: "16px",
            margin: "0 15px 0 0",
          }}
        >
          <br />
          <Button
            startIcon={<CloseIcon />}
            fullWidth
            variant="contained"
            onClick={() => setShowQRCode(false)}
          >
            Close
          </Button>
        </div>
      </Modal>

      <p>
        {`Users can join the session at ${voteFrontendUrl} with the following codes:`}
        <br />
        Join code: {joinData?.joinCode}
        <br />
        Access code: {joinData?.accessCode}
      </p>
      <Alert style={{ width: "515px" }} severity="info">
        Do not leave the page otherwise auto playing the playlist will not work!
      </Alert>
      <br />
      <Button variant="contained" onClick={() => setShowQRCode(true)}>
        Show QR code
      </Button>
      <FormGroup>
        <FormControlLabel
          id="play-after-song-ended-checkbox"
          control={<Checkbox defaultChecked />}
          label="Play playlist after current playing song finished"
        />
      </FormGroup>
      <VoteOverView
        voteCookie={voteCookie}
        voteState={voteState}
        onVoteEnded={() => onVoteEnded(joinData)}
      />
    </>
  ) : (
    <>
      <VoteSettings setVoteValidTimeInMinutes={setVoteValidTimeInMinutes} />
      <SpotifyPlaylist
        voteStarted={voteStarted}
        userPlaylists={userPlaylists}
        onVoteStart={(selectedPlaylistIds: string[]) => onVoteStart(selectedPlaylistIds)}
      />
    </>
  );

  return (
    <SideNav pageName="Spotify vote">
      {accessToken !== null ? (
        voteComponents
      ) : (
        <Alert severity="error">You are not logged in to Spotify. Login in the settings page</Alert>
      )}
    </SideNav>
  );
}
