import { Get } from "services/shared/api/api-actions";
import { sendRequest } from "services/shared/api/api-middleware";
import apiEndpoints from "services/shared/api/api-endpoints";
import SpotifyWebApi from "spotify-web-api-js";
import { stringIsEmpty } from "services/shared/general";

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
    if (refreshToken?.length < 20 || stringIsEmpty(refreshToken)) {
      return;
    }

    const tokens = await refreshSpotifyAccessToken(refreshToken);
    const tokensInvalid =
      !tokens.access_token ||
      tokens.access_token.length < 20 ||
      !tokens.refresh_token ||
      tokens.refresh_token.length < 20;
    if (tokensInvalid) {
      return;
    }

    localStorage.setItem("SpotifyAccessToken", tokens.access_token);
    localStorage.setItem("SpotifyRefreshToken", tokens.refresh_token);
    Spotify.setAccessToken(tokens.access_token);
  }
};

export const grandSpotifyAccess = () => {
  return sendRequest(() => Get(apiEndpoints.grandSpotifyAccess), []);
};

export const getSpotifyAccessTokens = (code) =>
  sendRequest(
    () => Get(`${apiEndpoints.getSpotifyAccessToken}?code=${code}`),
    []
  ).then((value) => value.json());

export const refreshSpotifyAccessToken = async (refreshToken) =>
  sendRequest(
    () =>
      Get(
        `${apiEndpoints.refreshSpotifyAccessToken}?refreshToken=${refreshToken}`
      ).then((value) => value.json()),
    [],
    undefined,
    false
  );

const executeRequest = (request) => {
  const accessToken = localStorage.getItem("SpotifyAccessToken");
  if (accessToken === null || accessToken === "undefined") {
    return;
  }

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

export const startPlayer = async (deviceId = null) =>
  executeRequest(() =>
    Spotify.play(deviceId !== null ? { device_id: deviceId } : undefined)
  );

export const pausePlayer = async () => executeRequest(() => Spotify.pause());

export const skipSong = async () => executeRequest(() => Spotify.skipToNext());

export const previousSong = async () =>
  executeRequest(() => Spotify.skipToPrevious());

export const getSpotifyDevices = async () =>
  executeRequest(() => Spotify.getMyDevices());

export const getDataForCurrentArtist = async (artistId) =>
  executeRequest(() => Spotify.getArtist(artistId));

export const getTrackAudioFeatures = async (trackId) =>
  executeRequest(() => Spotify.getAudioFeaturesForTrack(trackId));

export const searchSpotify = async (searchValue, limit = 50) =>
  executeRequest(() =>
    Spotify.search(searchValue, ["track"], {
      limit,
    })
  );

export const getCurrentTracksData = async (trackIds) =>
  executeRequest(() => Spotify.getTracks(trackIds));
