import SideNav from "components/sidenav";
import SpotifyPlaylist from "components/spotify-vote/spotify-playlist";
import VoteSettings from "components/spotify-vote/vote-settings";
import { useEffect, useState } from "react";
import { startVote } from "services/logic/vote-logic";
import { createGuid } from "services/shared/math";
import SpotifyWebApi from "spotify-web-api-js";

export default function SpotifyVote() {
  const Spotify = new SpotifyWebApi();
  const accessToken = localStorage.getItem("SpotifyAccessToken");
  const [userPlaylists, setUserPlaylists] = useState([]);
  const [voteValidTimeInMinutes, setVoteValidTimeInMinutes] = useState(5);
  const [voteStarted, setVoteStarted] = useState(false);
  const [joinData, setJoinData] = useState();

  useEffect(() => {
    if (accessToken === null) {
      return;
    }

    Spotify.setAccessToken(accessToken);
    Spotify.getUserPlaylists().then((data) => setUserPlaylists(data?.items));
  }, []);

  const sideNavSettings = {
    pageName: "Vote",
  };

  const getPlaylistSongs = async (selectedPlaylistId) => {
    const data = (await Spotify.getPlaylistTracks(selectedPlaylistId)).items;
    return data.map((track) => track.track);
  };

  const onVoteStart = async (selectedPlaylistsId) => {
    const expirationDate = new Date();
    expirationDate.setMinutes(
      expirationDate.getMinutes() + voteValidTimeInMinutes
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
    setVoteStarted(true);
    setJoinData(joinInfo);
  };

  const content =
    accessToken !== null ? (
      <div>
        {voteStarted ? (
          <div>
            <h3>Voting started!</h3>
            <p>
              Users can join the session at http://localhost:3001/ with the
              following codes:
              <br />
              Join code: {joinData?.joinCode}
              <br />
              Access code: {joinData?.accessCode}
            </p>
          </div>
        ) : (
          <div>
            <VoteSettings
              setVoteValidTimeInMinutes={setVoteValidTimeInMinutes}
            />
            <SpotifyPlaylist
              userPlaylists={userPlaylists}
              onVoteStart={(selectedPlaylistsId) =>
                onVoteStart(selectedPlaylistsId)
              }
            />
          </div>
        )}
      </div>
    ) : (
      <h1>You are not logged in to Spotify. Login in the settings page</h1>
    );

  return (
    <div>
      <SideNav content={content} settings={sideNavSettings} />
    </div>
  );
}
