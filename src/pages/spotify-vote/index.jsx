import SideNav from "components/sidenav";
import SpotifyPlaylist from "components/spotify-vote/spotify-playlist";
import VoteOverView from "components/spotify-vote/vote-overview";
import VoteSettings from "components/spotify-vote/vote-settings";
import { useEffect, useState } from "react";
import {
  getCurrentDevice,
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
  const Cookie = new Cookies();
  const accessToken = localStorage.getItem("SpotifyAccessToken");
  const voteCookie = Cookie.get("vote-started");
  const voteInProgress = voteCookie !== undefined;

  const [userPlaylists, setUserPlaylists] = useState([]);
  const [voteValidTimeInMinutes, setVoteValidTimeInMinutes] = useState(5);
  const [voteStarted, setVoteStarted] = useState(voteInProgress);
  const [joinData, setJoinData] = useState(voteCookie?.joinInfo ?? undefined);
  const [voteState, setVoteState] = useState();
  const [connected, setConnected] = useState(false);
  const [playerState, setPlayerState] = useState();

  useEffect(() => {
    if (accessToken === null) {
      return;
    }

    getUserPlaylists().then((data) => setUserPlaylists(data.items));
    if (!voteStarted) {
      return;
    }

    if (!connected) {
      connectToWebsocketServer(
        voteCookie.joinInfo.joinCode,
        voteCookie.joinInfo.accessCode
      ).then((conn) => setConnected(conn));
    }

    setInterval(() => updatePlayerState(), 2000);
  }, [voteStarted, accessToken]);

  const updatePlayerState = () => {
    getPlayerState().then((data) => {
      console.log(data);
      setPlayerState(data);
    });
  };

  const connectToWebsocketServer = async (joinCode, accessCode) => {
    const response = await getVoteData({ joinCode, accessCode });
    if (response.status !== 200) {
      return false;
    }

    let voteData = await response.json();
    voteData.validUntil = new Date(voteData.validUntil);

    let newSocket = new WebSocket("ws://localhost:5002/ws");
    newSocket.onopen = (event) => {
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
    Cookie.set(
      "vote-started",
      { joinInfo, validUntil: expirationDate },
      {
        expires: expirationDate,
        path: "/vote",
      }
    );

    setVoteStarted(true);
    setJoinData(joinInfo);
  };

  const onVoteEnded = () => {
    const mostVotedPlaylist = voteState?.voteablePlaylistCollection
      ?.sort((a, b) => (a.votes.length < b.votes.length ? -1 : 1))
      .at(0);
    playPlaylist(mostVotedPlaylist.spotifyPlaylistId, playerState.device.id);
  };

  const voteComponents = voteStarted ? (
    <div>
      <p>
        Users can join the session at http://localhost:3001/ with the following
        codes:
        <br />
        Join code: {joinData?.joinCode}
        <br />
        Access code: {joinData?.accessCode}
      </p>
      <VoteOverView
        voteCookie={voteCookie}
        voteState={voteState}
        onVoteEnded={onVoteEnded}
      />
    </div>
  ) : (
    <div>
      <VoteSettings setVoteValidTimeInMinutes={setVoteValidTimeInMinutes} />
      <SpotifyPlaylist
        userPlaylists={userPlaylists}
        onVoteStart={(selectedPlaylistsId) => onVoteStart(selectedPlaylistsId)}
      />
    </div>
  );

  const content =
    accessToken !== null ? (
      voteComponents
    ) : (
      <h1>You are not logged in to Spotify. Login in the settings page</h1>
    );

  return (
    <div>
      <SideNav content={content} settings={sideNavSettings} />
    </div>
  );
}
