import { Get } from "services/shared/api/api-actions";
import { sendRequest } from "services/shared/api/api-middleware";
import apiEndpoints from "services/shared/api/api-urls";
import SpotifyWebApi from "spotify-web-api-js";

const Spotify = new SpotifyWebApi();

export const getCodeFromResponse = () => {
  const urlData = window.location.search;
  const indexOfData = urlData.indexOf("=");
  return urlData.substring(indexOfData + 1, urlData.length);
};

const onError = async (errorCode) => {
  const code = Number(errorCode);
  if (code === 401) {
    const refreshToken = localStorage.getItem("SpotifyRefreshToken");
    const tokens = await refreshSpotifyAccessToken(refreshToken);
    localStorage.setItem("SpotifyAccessToken", tokens.access_token);
    localStorage.setItem("SpotifyRefreshToken", tokens.refresh_token);
    Spotify.setAccessToken(tokens.access_token);
  }
};

export const grandSpotifyAccess = () => {
  return sendRequest(() => Get(apiEndpoints.grandSpotifyAccess), []);
};

export const getSpotifyAccessTokens = (code) => {
  return sendRequest(
    () => Get(`${apiEndpoints.getSpotifyAccessToken}?code=${code}`),
    []
  );
};

export const refreshSpotifyAccessToken = (refreshToken) => {
  return sendRequest(
    () =>
      Get(
        `${apiEndpoints.refreshSpotifyAccessToken}?refreshToken=${refreshToken}`
      ),
    []
  );
};

const executeRequest = (request) => {
  const accessToken = localStorage.getItem("SpotifyAccessToken");
  Spotify.setAccessToken(accessToken);

  return request()
    .then((data) => data)
    .catch(async (error) => {
      await onError(error.status);
      return request().then((data) => data);
    });
};

export const getUserPlaylists = () => {
  return executeRequest(() => Spotify.getUserPlaylists());
};

export const getPlaylistSongs = (selectedPlaylistId) => {
  return executeRequest(() =>
    Spotify.getPlaylistTracks(selectedPlaylistId).then((data) => {
      const items = data.items;
      return items.map((track) => track.track);
    })
  );
};

export const playPlaylist = (id, deviceToPlayId) => {
  return executeRequest(() =>
    Spotify.play({
      context_uri: `spotify:playlist:${id}`,
      device_id: deviceToPlayId,
    })
  );
};

export const getPlayerState = async () =>
  executeRequest(() =>
    Spotify.getMyCurrentPlaybackState().then((data) => data)
  );
