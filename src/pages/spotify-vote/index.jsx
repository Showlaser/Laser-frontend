import { Alert, Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import Loading from "components/shared/loading";
import SideNav from "components/shared/sidenav";
import SpotifyPlaylist from "components/spotify-vote/spotify-playlist";
import VoteOverView from "components/spotify-vote/vote-overview";
import VoteSettings from "components/spotify-vote/vote-settings";
import { useEffect, useState } from "react";
import {
  getPlayerState,
  getPlaylistSongs,
  getUserPlaylists,
  playPlaylist,
} from "services/logic/spotify";
import { getVoteData, startVote } from "services/logic/vote-logic";
import { toCamelCase } from "services/shared/general";
import { createGuid } from "services/shared/math";
import Cookies from "universal-cookie";

export default function SpotifyVote() {
  const cookie = new Cookies();
  const accessToken = localStorage.getItem("SpotifyAccessToken");
  const voteCookie = cookie.get("vote-started");
  const voteInProgress = voteCookie !== undefined;

  const [userPlaylists, setUserPlaylists] = useState();
  const [voteValidTimeInMinutes, setVoteValidTimeInMinutes] = useState(5);
  const [voteStarted, setVoteStarted] = useState(voteInProgress);
  const [joinData, setJoinData] = useState(voteCookie?.joinInfo ?? undefined);
  const [voteState, setVoteState] = useState();
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (accessToken === null) {
      return;
    }

    getUserPlaylists().then((data) => {
      const playlistsWithTracks = data.items.filter(
        (playlist) => playlist.tracks.total > 0
      );
      setUserPlaylists(playlistsWithTracks);
    });
    if (!voteStarted) {
      return;
    }

    if (!connected) {
      connectToWebsocketServer(
        voteCookie.joinInfo.joinCode,
        voteCookie.joinInfo.accessCode
      ).then((conn) => setConnected(conn));
    }
  }, [voteStarted, accessToken]);

  const connectToWebsocketServer = async (joinCode, accessCode) => {
    const response = await getVoteData({ joinCode, accessCode });
    if (response.status !== 200) {
      return false;
    }

    let voteData = await response.json();
    voteData.validUntil = new Date(voteData.validUntil);

    let newSocket = new WebSocket("wss://laser-vote-api.vdarwinkel.nl/ws");
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

  const sideNavSettings = {
    pageName: "Vote",
  };

  const onVoteStart = async (selectedPlaylistsId) => {
    const expirationDate = new Date();
    expirationDate.setUTCMinutes(
      expirationDate.getUTCMinutes() + voteValidTimeInMinutes
    );

    const voteDataUuid = createGuid();
    const voteData = {
      uuid: voteDataUuid,
      validUntil: expirationDate,
      voteablePlaylistCollection: await Promise.all(
        selectedPlaylistsId.map(async (playlistId) => {
          {
            const playlist = userPlaylists.find((p) => p.id === playlistId);
            const playlistSongs = await getPlaylistSongs(playlistId);
            const playlistUuid = createGuid();

            return {
              uuid: createGuid(),
              voteDataUuid,
              playlistName: playlist.name,
              spotifyPlaylistId: playlistId,
              playlistImageUrl: playlist?.images?.at(0)?.url,
              songsInPlaylist: playlistSongs.map((track) => {
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
  };

  const onVoteEnded = async (joinInfo) => {
    const { joinCode, accessCode } = joinInfo;
    const response = await getVoteData({ joinCode, accessCode });
    if (response.status !== 200) {
      return false;
    }

    const playPlaylistAfterSongEnded = document
      .getElementById("play-after-song-ended-checkbox")
      .getElementsByTagName("input")
      .item(0).checked;

    const voteData = await response.json();
    const mostVotedPlaylist = voteData?.voteablePlaylistCollection
      ?.sort((a, b) => (a.votes.length > b.votes.length ? -1 : 1))
      .at(0);

    const oldPlayerState = await getPlayerState();

    if (playPlaylistAfterSongEnded) {
      const interval = setInterval(async () => {
        const currentPlayerState = await getPlayerState();
        if (currentPlayerState.item.id !== oldPlayerState.item.id) {
          playPlaylist(
            mostVotedPlaylist.spotifyPlaylistId,
            currentPlayerState.device.id
          );
          clearInterval(interval);
        }
      }, 2000);
      return;
    }

    playPlaylist(mostVotedPlaylist.spotifyPlaylistId, oldPlayerState.device.id);
  };

  const voteComponents = voteStarted ? (
    <Loading objectToLoad={joinData}>
      <p>
        Users can join the session at https://laser-vote.vdarwinkel.nl with the
        following codes:
        <br />
        Join code: {joinData?.joinCode}
        <br />
        Access code: {joinData?.accessCode}
      </p>
      <FormGroup>
        <FormControlLabel
          id="play-after-song-ended-checkbox"
          control={<Checkbox defaultChecked />}
          label="Play playlist after current playing song finished"
        />
      </FormGroup>
      <VoteOverView voteCookie={voteCookie} voteState={voteState} />
    </Loading>
  ) : (
    <Loading objectToLoad={userPlaylists}>
      <VoteSettings setVoteValidTimeInMinutes={setVoteValidTimeInMinutes} />
      <SpotifyPlaylist
        voteStarted={voteStarted}
        userPlaylists={userPlaylists}
        onVoteStart={(selectedPlaylistsId) => onVoteStart(selectedPlaylistsId)}
      />
    </Loading>
  );

  const content =
    accessToken !== null ? (
      voteComponents
    ) : (
      <Alert severity="error">
        You are not logged in to Spotify. Login in the settings page
      </Alert>
    );

  return (
    <div>
      <SideNav content={content} settings={sideNavSettings} />
    </div>
  );
}
